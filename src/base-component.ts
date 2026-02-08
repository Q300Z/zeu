import { GLOBAL } from './global';
import Utility from './utility';
import Shape from './shape';
import { COLOR } from './color';
import { ThemeManager, ColorTheme } from './theme';

export interface BaseOptions {
  viewWidth?: number;
  viewHeight?: number;
  [key: string]: unknown;
}

export interface MoveEvent {
  type: 'move';
  destX: number;
  destY: number;
  speedX: number;
  speedY: number;
}

export interface AlertState {
  on: boolean;
  lastCall: number;
  dashOffSet: number;
  text: string;
  interval: number;
  lineColor: string;
  fontColor: string;
  bgColor: string;
}

export default class BaseComponent {
  protected _canvas: HTMLCanvasElement;
  protected _ctx: CanvasRenderingContext2D;
  protected _x: number;
  protected _y: number;
  protected _width: number;
  protected _height: number;
  protected _viewWidth: number;
  protected _viewHeight: number;
  protected _scaleX: number;
  protected _scaleY: number;
  protected _display: boolean;
  protected _eventQueue: MoveEvent[];
  protected _shape: Shape;
  protected _alert: AlertState;
  protected _dirty: boolean;
  protected _offscreenCanvas: HTMLCanvasElement;
  protected _offscreenCtx: CanvasRenderingContext2D;
  protected _staticRendered: boolean;
  private _themeListener: () => void;

  get theme(): ColorTheme {
    return ThemeManager.getInstance().theme;
  }

  constructor(canvasId: string, options: BaseOptions = {}, viewWidth: number, viewHeight: number) {
    // Canvas
    const canvasElement = document.getElementById(canvasId);

    if (!canvasElement || !(canvasElement instanceof HTMLCanvasElement)) {
      throw new Error(`Canvas element with id '${canvasId}' not found or is not a canvas.`);
    }
    this._canvas = canvasElement;

    // Canvas 2d context
    const context = this._canvas.getContext('2d');

    if (!context) {
      throw new Error('Could not get 2d context from canvas.');
    }
    this._ctx = context;

    // HiDPI support
    Utility.prepareCanvas(this._canvas, this._ctx);

    // Offscreen canvas for pre-rendering
    this._offscreenCanvas = document.createElement('canvas');
    const offscreenContext = this._offscreenCanvas.getContext('2d');

    if (!offscreenContext) {
      throw new Error('Could not get 2d context from offscreen canvas.');
    }
    this._offscreenCtx = offscreenContext;
    this._staticRendered = false;

    // Current X value (Left 0 to right)
    this._x = 0;

    // Current Y value (Top 0 to bottom)
    this._y = 0;

    // The width and height used to draw the component.
    this._viewWidth = viewWidth;
    this._viewHeight = viewHeight;

    // Initialize width/height
    this._width = viewWidth;
    this._height = viewHeight;

    // Scale parameters used in scale()
    this._scaleX = 1;
    this._scaleY = 1;

    // Get canvas height
    const canvasHeight = this._canvas.height || (this._canvas.parentNode as HTMLElement)?.clientHeight || viewHeight;

    // Set actual width and height of the component based on scales.
    this.scaleByHeight(canvasHeight);

    this._display = true;

    // Event queue that stores animation movements like 'move', 'scale', 'display' and etc.
    this._eventQueue = [];

    // Bind the drawFrame function.
    this.drawFrame = this.drawFrame.bind(this);

    // Init Shape instance.
    this._shape = new Shape(this._ctx);

    const alert: AlertState = {
      on: false,
      lastCall: 0,
      dashOffSet: 0,
      text: '',
      interval: 1500,
      lineColor: COLOR.red,
      fontColor: COLOR.red,
      bgColor: COLOR.yellow
    };

    this._alert = alert;
    this.alertFunc = this.alertFunc.bind(this);

    this._dirty = true;

    // Theme subscription
    this._themeListener = () => {
      this._dirty = true;
      this._staticRendered = false; // Invalidate offscreen cache
    };
    ThemeManager.getInstance().subscribe(this._themeListener);

    // Set options
    this.setOptions(options);

    // Post constructor.
    this.postConstructor();
  }

  // ********** INTERNAL API **********
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  setOptions(_options: BaseOptions) {}

  postConstructor() {
    this.removeFromAnimationQueue();
    this.addToAnimationQueue();
  }

  drawFrame() {
    // Check movement
    if (this._eventQueue.length > 0) {
      const event = this._eventQueue[0];

      if (event.type === 'move') {
        if (this._x === event.destX && this._y === event.destY) {
          this._eventQueue.shift();
        } else {
          this._x = Utility.getNextPos(this._x, event.destX, event.speedX);
          this._y = Utility.getNextPos(this._y, event.destY, event.speedY);
          this._dirty = true;
        }
      }
    }

    // Check display or not.
    if (!this.isDisplay() || (!this._dirty && !this.isAlert())) {
      return;
    }

    this.clear();

    this.save();
    this.drawObject();
    this._ctx.restore();

    if (this.isAlert()) {
      this.save();
      this._alert.lastCall = this.nextAlert(this.alertFunc, this._alert.lastCall, this._alert.interval);
      this._ctx.restore();
    }

    // Reset dirty flag if not animating or alerting
    if (this._eventQueue.length === 0 && !this.isAlert() && !this.isAnimating()) {
      this._dirty = false;
    }
  }

  isAnimating(): boolean {
    return false;
  }

  drawObject() {}

  drawStatic() {
    // Override this to draw static elements to this._offscreenCtx
  }

  drawOffscreen() {
    if (!this._staticRendered) {
      this.drawStatic();
      this._staticRendered = true;
    }
    this._ctx.drawImage(
      this._offscreenCanvas,
      0, 0, this._offscreenCanvas.width, this._offscreenCanvas.height,
      this._x, this._y, this._width, this._height
    );
  }

  clear() {
    this._ctx.clearRect(this._x, this._y, this._width, this._height);
  }

  scale() {
    this._ctx.scale(this._scaleX, this._scaleY);
  }

  save() {
    this._ctx.save();
    this.scale();
  }

  addToAnimationQueue() {
    const index = this.getAnimationFrameArrayPos();

    if (index === -1) {
      GLOBAL.requestAnimationFrameArray.push(this.drawFrameObj());
    }
  }

  removeFromAnimationQueue() {
    const index = this.getAnimationFrameArrayPos();

    if (index !== -1) {
      GLOBAL.requestAnimationFrameArray.splice(index, 1);
    }
  }

  drawFrameObj() {
    return {
      func: this.drawFrame,
      self: this
    };
  }

  getAnimationFrameArrayPos() {
    return GLOBAL.requestAnimationFrameArray.findIndex(obj => obj.self === this);
  }

  get isAnimationOn() {
    return this.getAnimationFrameArrayPos() !== -1;
  }

  nextAlert(alertFunc: () => void, lastAlert: number, interval: number): number {
    const now = Date.now();

    if (now - lastAlert < interval) {
      alertFunc.call(this);
      return lastAlert;
    } else if (now - lastAlert < (interval * 2)) {
      return lastAlert;
    }
    return now;
  }

  alertFunc() {
    this._shape.fillRect(this._x, this._y, this._width, this._height, this._alert.bgColor);

    this._ctx.setLineDash([20, 16]);
    this._ctx.lineDashOffset = -this._alert.dashOffSet;
    this._ctx.lineWidth = 20;
    this._ctx.strokeStyle = this._alert.lineColor;
    this._ctx.strokeRect(this._x, this._y, this._width, this._height);

    this._alert.dashOffSet++;
    if (this._alert.dashOffSet > 32) {
      this._alert.dashOffSet = 0;
    }

    this._shape.fillText(this._alert.text, (this._width - this._x) / 2, (this._height - this._y) / 2 + 10,
      'Bold 30px Arial', 'center', this._alert.fontColor);
  }

  // ********** EXTERNAL API **********
  /**
   * Destroy.
   */
  destroy() {
    ThemeManager.getInstance().unsubscribe(this._themeListener);
    this.removeFromAnimationQueue();
    this.clear();
    // Releasing references
    // @ts-expect-error: Intentional cleanup
    this._canvas = null;
    // @ts-expect-error: Intentional cleanup
    this._ctx = null;
    // @ts-expect-error: Intentional cleanup
    this._alert = null;
  }

  /**
   * Turn on alert.
   */
  alertOn(params: Partial<AlertState> = {}) {
    this._alert.text = params.text || 'ALERT';
    this._alert.interval = params.interval || 1500;
    this._alert.bgColor = params.bgColor || COLOR.yellow;
    this._alert.fontColor = params.fontColor || COLOR.red;
    this._alert.lineColor = params.lineColor || COLOR.red;
    this._alert.on = true;
    this._dirty = true;
  }

  /**
   * Turn off alert.
   */
  alertOff() {
    this._alert.on = false;
    this._dirty = true;
  }

  isAlert() {
    return this._alert.on;
  }

  moveTo(destX: number, destY: number, duration: number) {
    let srcX = this._x;
    let srcY = this._y;

    // Find last move event.
    for (let i = (this._eventQueue.length - 1); i >= 0; i--) {
      const event = this._eventQueue[i];

      if (event.type === 'move') {
        srcX = event.destX;
        srcY = event.destY;
        break;
      }
    }

    // Calculate the speed.
    const speed = duration / 60;
    const sX = Math.abs(destX - srcX) / speed;
    const sY = Math.abs(destY - srcY) / speed;
    const speedX = destX > srcX ? sX : -sX;
    const speedY = destY > srcY ? sY : -sY;

    // Push the movement to the queue.
    this._eventQueue.push({
      type: 'move',
      destX: destX,
      destY: destY,
      speedX: speedX,
      speedY: speedY
    });

    return this;
  }

  scaleTo(x: number, y: number) {
    this._scaleX = x;
    this._scaleY = y;
    this._width = this._scaleX * this._viewWidth;
    this._height = this._scaleY * this._viewHeight;
    this._dirty = true;
    return this;
  }

  scaleByHeight(height: number) {
    this._scaleY = height / this._viewHeight;
    this._scaleX = this._scaleY;
    this._width = this._scaleX * this._viewWidth;
    this._height = this._scaleY * this._viewHeight;

    // Resize offscreen canvas
    const dpr = window.devicePixelRatio || 1;

    this._offscreenCanvas.width = this._width * dpr;
    this._offscreenCanvas.height = this._height * dpr;
    this._offscreenCtx.setTransform(1, 0, 0, 1, 0, 0);
    this._offscreenCtx.scale(dpr * this._scaleX, dpr * this._scaleY);
    this._staticRendered = false;
    this._dirty = true;

    return this;
  }

  show() {
    this._display = true;
    this._dirty = true;
  }

  hide() {
    this._display = false;
  }

  isDisplay() {
    return this._display;
  }

  get canvas() {
    return this._canvas;
  }

  get context() {
    return this._ctx;
  }

  get eventQueue() {
    return this._eventQueue;
  }

  get viewWidth() {
    return this._viewWidth;
  }

  get viewHeight() {
    return this._viewHeight;
  }
}

import Utility from './utility';
import { COLOR } from './color';
import BaseComponent, { BaseOptions } from './base-component';

export interface HeartbeatOptions extends BaseOptions {
  speed?: number;
  fontColor?: string;
  maxQueueCapacity?: number;
}

export interface BeatPoint {
  time: string | null;
  x: number;
  color?: string;
  space?: number;
}

export interface BeatParams {
  color?: string;
  space?: number;
}

export default class Heartbeat extends BaseComponent {
  private _queue: BeatPoint[] = [];
  private _lastSec: string | number = 0;
  private _timer: ReturnType<typeof setInterval> | null = null;
  private _speed: number = 2;
  private _fontColor: string = COLOR.black;
  private _maxQueueCapacity: number = 30;

  constructor(canvas: string, options: HeartbeatOptions = {}) {
    const viewWidth = options.viewWidth || 200;

    super(canvas, options, viewWidth, 100);

    this.drawSeconds();
  }

  setOptions(options: HeartbeatOptions = {}) {
    this._speed = options.speed || 2;
    this._fontColor = options.fontColor || (this.theme ? this.theme.black : COLOR.black);
    this._maxQueueCapacity = options.maxQueueCapacity || 30;
  }

  postConstructor() {
    super.postConstructor();
    // Start drawing the seconds
    this.tick();
  }

  destroy() {
    if (this._timer != null) {
      clearInterval(this._timer);
    }
    super.destroy();
  }

  beat(params: BeatParams = {}) {
    const beatColor = params.color || (this.theme ? this.theme.green : COLOR.green);
    const beatSpace = params.space || 0;

    if (this._queue.length >= this._maxQueueCapacity) {
      this._queue.shift();
    }
    this._queue.push({
      time: null,
      x: -30,
      color: beatColor,
      space: beatSpace
    });
    this._dirty = true;
  }

  tick() {
    if (this._timer == null) {
      this._timer = setInterval(() => {
        this.drawSeconds();
      }, 1000);
    }
  }

  drawSeconds() {
    if (this._queue.length >= this._maxQueueCapacity) {
      this._queue.shift();
    }

    const now = new Date();
    const currSec = Utility.leftPadZero(now.getMinutes()) + ':' + Utility.leftPadZero(now.getSeconds());

    if (currSec !== this._lastSec) {
      this._queue.push({ time: currSec, x: -30 });
      this._lastSec = currSec;
      this._dirty = true;
    }
  }

  isAnimating(): boolean {
    return this._queue.length > 0;
  }

  drawObject() {
    this._ctx.textAlign = 'center';
    this._ctx.font = '12px Arial';

    // Draw the horizontal line
    this._shape.fillRect(0, 50, this._viewWidth, 2, this._fontColor);

    // Draw the pulse
    for (let i = 0; i < this._queue.length; i++) {
      const q = this._queue[i];

      if (q.time != null) {
        this._ctx.fillStyle = this._fontColor;
        this._ctx.fillText(q.time, q.x, 90);

        this._shape.fillRect(q.x - 1, 45, 2, 12, this._fontColor);
      } else {
        this._ctx.fillStyle = q.color || this._fontColor;
        this._ctx.beginPath();
        this._ctx.moveTo(q.x - 10, 50);
        this._ctx.quadraticCurveTo(q.x - 5, -20 + (q.space || 0) * 2, q.x, 50);
        this._ctx.quadraticCurveTo(q.x + 5, 100 - (q.space || 0) * 1, q.x + 10, 50);
        this._ctx.closePath();
        this._ctx.fill();
      }
      q.x += this._speed;
    }

    if (this._queue.length > 0) {
      this._dirty = true;
    }
  }
}

import { COLOR } from './color';
import BaseComponent, { BaseOptions } from './base-component';

export interface MessageQueueOptions extends BaseOptions {
  barHeight?: number;
  speed?: number;
  space?: number;
  maxQueueCapacity?: number;
}

export interface MessageItem {
  x: number;
  y: number;
  color: string;
  space: number;
}

export interface MessagePushParam {
  color?: string;
  space?: number;
}

export default class MessageQueue extends BaseComponent {
  private _queue: MessageItem[] = [];
  private _arcWidth: number = 10;
  private _barHeight!: number;
  private _speed!: number;
  private _space!: number;
  private _maxQueueCapacity!: number;

  constructor(canvas: string, options: MessageQueueOptions = {}) {
    const viewWidth = options.viewWidth || 100;
    const viewHeight = options.viewHeight || 200;

    super(canvas, options, viewWidth, viewHeight);
  }

  setOptions(options: MessageQueueOptions = {}) {
    this._barHeight = options.barHeight || 20;
    this._speed = options.speed || 5;
    this._space = options.space || 5;
    this._maxQueueCapacity = options.maxQueueCapacity !== undefined ? options.maxQueueCapacity : 20;
  }

  isAnimating(): boolean {
    const bars = Math.floor(this._viewHeight / (this._barHeight + this._space));
    const drawQueueSize = Math.min(this._queue.length, bars);

    for (let i = 0; i < drawQueueSize; i++) {
      const q = this._queue[i];
      const currY = (this._barHeight + this._space) * i + this._space;

      if (currY < q.y) {
        return true;
      }
    }
    return false;
  }

  drawObject() {
    // Bars can be seen in the view
    const bars = Math.floor(this._viewHeight / (this._barHeight + this._space));
    const drawQueueSize = Math.min(this._queue.length, bars);
    let animating = false;

    for (let i = 0; i < drawQueueSize; i++) {
      const q = this._queue[i];
      const currY = (this._barHeight + this._space) * i + this._space;

      // Move up
      if (currY < q.y) {
        q.y -= this._speed;
        animating = true;
      } else {
        q.y = currY;
      }

      this._ctx.fillStyle = q.color;
      this._shape.fillRect(q.x, q.y, this._viewWidth - 2 * (this._arcWidth + q.space), this._barHeight, q.color);

      this._ctx.beginPath();
      this._ctx.moveTo(q.x, q.y);
      this._ctx.quadraticCurveTo(q.x - this._arcWidth, q.y + this._barHeight / 2, q.x, q.y + this._barHeight);
      this._ctx.fill();
      this._ctx.closePath();

      this._ctx.beginPath();
      this._ctx.moveTo(this._viewWidth - this._arcWidth - q.space, q.y);
      this._ctx.quadraticCurveTo(this._viewWidth - q.space, q.y + this._barHeight / 2,
        this._viewWidth - this._arcWidth - q.space, q.y + this._barHeight);
      this._ctx.fill();
      this._ctx.closePath();
    }

    if (animating) {
      this._dirty = true;
    } else {
      this._dirty = false;
    }
  }
  push(param: MessagePushParam = {}) {
    const barColor = param.color || (this.theme ? this.theme.blue : COLOR.blue);
    const barSpace = param.space || 0;

    if (this._queue.length >= this._maxQueueCapacity) {
      this.pop();
    }

    this._queue.push({
      x: this._arcWidth + barSpace,
      y: this._viewHeight + this._barHeight,
      color: barColor,
      space: barSpace
    });
    this._dirty = true;
  }

  pop() {
    if (this._queue.length > 0) {
      this._queue.shift();
      this._dirty = true;
    }
  }

  get queueSize(): number {
    return this._queue.length;
  }
}

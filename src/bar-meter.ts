import { COLOR } from './color';
import Utility from './utility';
import BaseComponent, { BaseOptions } from './base-component';

export interface BarMeterOptions extends BaseOptions {
  min?: number;
  max?: number;
  value?: number;
  dashColor?: string;
  barColor?: string;
  speed?: number;
  gradient?: boolean;
  space?: number;
}

export default class BarMeter extends BaseComponent {
  private _min!: number;
  private _max!: number;
  private _value!: number;
  private _currBar: number = 0;
  private _numberOfBars!: number;
  private _barMax!: number;
  private _barWidth!: number;
  private _barHeight: number = 15;

  public dashColor!: string;
  public barColor!: string;
  public speed!: number;
  private _isGradient!: boolean;
  private _space!: number;

  constructor(canvas: string, options: BarMeterOptions = {}) {
    const viewWidth = options.viewWidth || 100;

    super(canvas, options, viewWidth, 200);

    this._barWidth = this._viewWidth - 2 * this._space;

    // Initial calculation
    this._numberOfBars = Math.floor((this._value - this._min) / (this._max - this._min) * 10);
    this._barMax = this._numberOfBars * 100;
  }

  setOptions(options: BarMeterOptions = {}) {
    this._min = options.min !== undefined ? options.min : 0;
    this._max = options.max !== undefined ? options.max : 100;
    this._value = options.value !== undefined ? options.value : 0;
    this.dashColor = options.dashColor || (this.theme ? this.theme.grey : COLOR.grey);
    this.barColor = options.barColor || (this.theme ? this.theme.green : COLOR.green);
    this.speed = options.speed !== undefined ? options.speed : 5;
    this._isGradient = options.gradient || false;
    this._space = options.space !== undefined ? options.space : 20;
  }
  isAnimating(): boolean {
    return this._currBar < this._barMax;
  }

  drawObject() {
    this.drawOffscreen();

    // Draw bars.
    if (this._currBar >= this._barMax) {
      this._currBar = -100;
    } else {
      const bar = this._currBar / 100;

      let colors: string[] = [];

      if (this._isGradient) {
        colors = Utility.generateGradientColor(this.theme.white, this.barColor, bar);
      } else {
        this._ctx.fillStyle = this.barColor;
      }

      for (let i = 0; i < bar; i++) {
        const y = this._viewHeight - (15 + i * 20);

        if (this._isGradient) {
          this._ctx.fillStyle = '#' + colors[i];
        }

        this._ctx.beginPath();
        this._ctx.fillRect(this._space, y, this._barWidth, this._barHeight);
        this._ctx.closePath();
      }

      this._currBar += this.speed;
      this._dirty = true;
    }
  }

  drawStatic() {
    // Draw the dash.
    for (let i = 0; i < 10; i++) {
      const y = 5 + i * 20;

      this._offscreenCtx.fillStyle = this.dashColor;
      this._offscreenCtx.fillRect(this._space, y, this._barWidth, this._barHeight);
    }
  }

  set value(value: number) {
    this._value = value;
    this._numberOfBars = Math.floor((this._value - this._min) / (this._max - this._min) * 10);
    this._barMax = this._numberOfBars * 100;
    this._dirty = true;
  }

  get valuePct(): number {
    return Math.floor((this._value - this._min) / (this._max - this._min) * 100);
  }
}

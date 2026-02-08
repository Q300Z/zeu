import Utility from './utility';
import { COLOR } from './color';
import BaseComponent, { BaseOptions } from './base-component';
import DigitalSymbol from './digital-symbol';

export interface DigitalClockOptions extends BaseOptions {
  numberColor?: string;
  dashColor?: string;
  hourOffset?: number;
}

export default class DigitalClock extends BaseComponent {
  private _barWidth: number = 8;
  private _space: number = 12;
  private _numberWidth: number = 50;
  private _numberHeight: number = 100;
  private _ds: DigitalSymbol;
  private _timer: ReturnType<typeof setInterval> | null = null;

  private _numberColor!: string;
  private _dashColor!: string;
  private _hourOffset!: number;

  constructor(canvas: string, options: DigitalClockOptions = {}) {
    super(canvas, options, 400, 100);

    this._ds = new DigitalSymbol(this._ctx, this._barWidth, this._numberWidth,
      this._numberHeight, this._dashColor, this._numberColor);
  }
  postConstructor() {
    super.postConstructor();
    this.tick();
  }

  setOptions(options: DigitalClockOptions = {}) {
    this._numberColor = options.numberColor || (this.theme ? this.theme.red : COLOR.red);
    this._dashColor = options.dashColor || (this.theme ? this.theme.lightGrey : COLOR.lightGrey);
    this._hourOffset = options.hourOffset || 0;
  }

  destroy() {
    this.stopTick();
    super.destroy();
  }

  tick() {
    if (this._timer == null) {
      this._timer = setInterval(() => {
        this.drawTime();
      }, 1000);
    }
  }

  stopTick() {
    if (this._timer != null) {
      clearInterval(this._timer);
      this._timer = null;
    }
  }

  isAnimating(): boolean {
    return true;
  }

  drawTime() {
    const now = Utility.addHour(this._hourOffset);

    this.clear();
    this.save();

    this.drawTwoDigits(this._ds, now.getHours(), this._numberWidth + this._space);
    this._ds.drawColon();
    this._ctx.translate(this._barWidth + this._space, 0);
    this.drawTwoDigits(this._ds, now.getMinutes(), this._numberWidth + this._space);
    this._ds.drawColon();
    this._ctx.translate(this._barWidth + this._space, 0);
    this.drawTwoDigits(this._ds, now.getSeconds(), this._numberWidth + this._space);

    this._ctx.restore();
    this._dirty = true;
  }

  drawTwoDigits(digitalNumber: DigitalSymbol, time: number, space: number) {
    if (time < 10) {
      digitalNumber.drawNumber(0);
      this._ctx.translate(space, 0);
      digitalNumber.drawNumber(time);
      this._ctx.translate(space, 0);
    } else {
      const left = Math.floor(time / 10);
      const right = time % 10;

      digitalNumber.drawNumber(left);
      this._ctx.translate(space, 0);
      digitalNumber.drawNumber(right);
      this._ctx.translate(space, 0);
    }
  }
}

import BaseComponent, { BaseOptions } from './base-component';
import { COLOR } from './color';
import Utility from './utility';

export interface VolumeMeterOptions extends BaseOptions {
  min?: {
    fontColor?: string;
    value?: number;
    bgColor?: string;
  };
  max?: {
    fontColor?: string;
    value?: number;
    bgColor?: string;
  };
  bar?: {
    borderColor?: string;
    fillColor?: string;
    graident?: boolean;
    speed?: number;
  };
  marker?: {
    bgColor?: string;
    fontColor?: string;
  };
  value?: number;
}

export default class VolumeMeter extends BaseComponent {
  private _lineWidth: number = 3;
  private _numberHeight: number = 20;
  private _minMax: 'min' | 'max' | 'normal' = 'min';
  private _meterWidth: number;
  private _meterHeight: number;
  private _numberStart: number;
  private _actualValue: number;
  private _minValue: number = 0;
  private _maxValue: number = 100;
  private _barY: number;
  private _nextBarY: number;

  private _minFontColor: string = COLOR.white;
  private _minBgColor: string = COLOR.red;
  private _maxFontColor: string = COLOR.white;
  private _maxBgColor: string = COLOR.blue;
  private _barBorderColor: string = COLOR.black;
  public barFillColor: string = COLOR.green;
  private _isGraident: boolean = false;
  private _speed: number = 5;
  public markerBgColor: string = COLOR.yellow;
  private _markerFontColor: string = COLOR.white;
  private _internalValue: number = 0;

  constructor(canvas: string, options: VolumeMeterOptions = {}) {
    const viewHeight = options.viewHeight || 200;

    super(canvas, options, 100, viewHeight);

    this._meterWidth = this._viewWidth / 2;
    this._meterHeight = this._viewHeight - 2 * this._numberHeight;
    this._numberStart = (this._viewWidth - this._meterWidth - this._lineWidth) / 2;
    // Used only if the value is out of range.
    this._actualValue = this._internalValue;

    this._barY = this._viewHeight - (((this._internalValue - this._minValue) /
      (this._maxValue - this._minValue)) * this._meterHeight) - this._numberHeight;
    this._nextBarY = this._barY;
  }

  setOptions(options: VolumeMeterOptions = {}) {
    const min = options.min || {};
    const max = options.max || {};
    const bar = options.bar || {};
    const marker = options.marker || {};

    this._minFontColor = min.fontColor || (this.theme ? this.theme.white : COLOR.white);
    this._minValue = min.value !== undefined ? min.value : 0;
    this._minBgColor = min.bgColor || (this.theme ? this.theme.red : COLOR.red);

    this._maxFontColor = max.fontColor || (this.theme ? this.theme.white : COLOR.white);
    this._maxValue = max.value !== undefined ? max.value : 100;
    this._maxBgColor = max.bgColor || (this.theme ? this.theme.blue : COLOR.blue);

    this._barBorderColor = bar.borderColor || (this.theme ? this.theme.black : COLOR.black);
    this.barFillColor = bar.fillColor || (this.theme ? this.theme.green : COLOR.green);
    this._isGraident = bar.graident || false;
    this._speed = bar.speed || 5;

    this.markerBgColor = marker.bgColor || (this.theme ? this.theme.yellow : COLOR.yellow);
    this._markerFontColor = marker.fontColor || (this.theme ? this.theme.white : COLOR.white);

    this._internalValue = options.value || 0;
  }

  isAnimating(): boolean {
    return this._barY !== this._nextBarY;
  }

  drawObject() {
    // Handle graident fill color.
    let barFillStyle: string | CanvasGradient = this.barFillColor;

    if (this._isGraident) {
      const gradient = this._ctx.createLinearGradient(this._viewWidth / 2, this._barY,
        this._viewWidth / 2, this._meterHeight + this._numberHeight);

      gradient.addColorStop(0, this.barFillColor);
      gradient.addColorStop(1, 'white');
      barFillStyle = gradient;
    }

    // Draw the filled part.
    this._shape.fillRect((this._viewWidth - this._meterWidth) / 2, this._barY, this._meterWidth,
      this._viewHeight - this._barY - this._numberHeight, barFillStyle as string);

    // Draw the border.
    this._ctx.beginPath();
    this._ctx.lineWidth = this._lineWidth;
    this._ctx.strokeStyle = this._barBorderColor;
    this._ctx.rect((this._viewWidth - this._meterWidth) / 2, this._numberHeight, this._meterWidth, this._meterHeight);
    this._ctx.stroke();
    this._ctx.closePath();

    // Draw value.
    this.drawMin();
    this.drawMax();
    this.drawMarker();

    // Calculate the Y value.
    const oldBarY = this._barY;

    this._barY = Utility.getNextPos(this._barY, this._nextBarY, this._speed);

    if (this._barY !== oldBarY) {
      this._dirty = true;
    }
  }

  drawMin() {
    this._shape.fillRect(this._numberStart, this._viewHeight - this._numberHeight - this._lineWidth / 2,
      this._meterWidth + this._lineWidth, this._numberHeight + this._lineWidth / 2, this._minBgColor);
    this._shape.fillText(String(this._minValue), this._meterWidth, this._meterHeight + this._numberHeight + 15,
      '15px Arial', 'center', this._minFontColor);
  }

  drawMax() {
    this._shape.fillRect(this._numberStart, 0, this._meterWidth + this._lineWidth,
      this._numberHeight + this._lineWidth / 2, this._maxBgColor);
    this._shape.fillText(String(this._maxValue), this._meterWidth, this._numberHeight - 4,
      '15px Arial', 'center', this._maxFontColor);
  }

  drawMarker() {
    const text = (this._minMax === 'max' || this._minMax === 'min') ? this._actualValue : this._internalValue;

    this._shape.fillRect(this._numberStart + this._meterWidth + this._lineWidth,
      this._barY - 8, (this._viewWidth - (this._numberStart + this._meterWidth + this._lineWidth)), 16,
      this.markerBgColor);

    this._shape.fillRect(0, this._barY - this._lineWidth / 2,
      this._numberStart + this._meterWidth + this._lineWidth, this._lineWidth, this.markerBgColor);

    this._shape.fillText(String(text), (this._viewWidth - this._meterWidth) / 4 * 3 + this._meterWidth, this._barY + 4,
      '10px Arial', 'center', this._markerFontColor);
  }

  set value(value: number) {
    let n = value;

    this._actualValue = n;

    if (n >= this._maxValue) {
      this._minMax = 'max';
      n = this._maxValue;
    } else if (n <= this._minValue) {
      this._minMax = 'min';
      n = this._minValue;
    } else {
      this._minMax = 'normal';
    }

    this._speed = n < this._internalValue ? Math.abs(this._speed) : -Math.abs(this._speed);
    this._nextBarY = this._viewHeight - (((n - this._minValue) /
      (this._maxValue - this._minValue)) * this._meterHeight) - this._numberHeight;
    this._internalValue = n;
    this._dirty = true;
  }

  get value(): number {
    return this._actualValue;
  }
}

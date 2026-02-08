import { COLOR } from './color';
import Utility from './utility';
import BaseComponent, { BaseOptions } from './base-component';

export interface TextMeterOptions extends BaseOptions {
  bar?: {
    speed?: number;
    fillColor?: string;
    bgColor?: string;
    borderColor?: string;
  };
  marker?: {
    bgColor?: string;
    fontColor?: string;
  };
  value?: number;
  displayValue?: string;
  arrowColor?: string;
}

export default class TextMeter extends BaseComponent {
  private _lineWidth: number = 5;
  private _arrowWidth: number = 30;
  private _pctHeight: number = 30;
  private _actualPctHeight: number;
  private _meterWidth: number;
  private _meterHeight: number;
  private _middleBarHeight: number;

  private _barX: number;
  private _nextBarX: number;

  private _arrow: 'left' | 'right' | null = null;
  private _arrowSpeed: number = 0.6;
  private _leftArrowX: number = -5;
  private _rightArrowX: number;

  public markerBgColor: string = COLOR.black;
  public markerFontColor: string = COLOR.white;
  public speed: number = 5;
  public fillColor: string = COLOR.red;
  public bgColor: string = COLOR.lightWhite;
  private _lineColor: string = COLOR.lightGreen;
  private _percentageValue: number = 0;
  public displayValue: string = '';
  public arrowColor: string = COLOR.blue;

  constructor(canvas: string, options: TextMeterOptions = {}) {
    const viewWidth = options.viewWidth || 200;

    super(canvas, options, viewWidth, 100);

    this._actualPctHeight = this._pctHeight - this._lineWidth / 2;
    this._meterWidth = this._viewWidth - 2 * this._arrowWidth;
    this._meterHeight = 100 - this._pctHeight - this._lineWidth / 2;
    this._middleBarHeight = this._meterHeight / 2 + this._pctHeight;

    this._barX = (this._percentageValue / 100) * this._meterWidth + this._arrowWidth;
    this._nextBarX = this._barX;

    this._rightArrowX = this._viewWidth + 5;
  }

  setOptions(options: TextMeterOptions = {}) {
    const bar = options.bar || {};
    const marker = options.marker || {};

    this.markerBgColor = marker.bgColor || (this.theme ? this.theme.black : COLOR.black);
    this.markerFontColor = marker.fontColor || (this.theme ? this.theme.white : COLOR.white);

    this.speed = bar.speed || 5;
    this.fillColor = bar.fillColor || (this.theme ? this.theme.red : COLOR.red);
    this.bgColor = bar.bgColor || (this.theme ? this.theme.lightWhite : COLOR.lightWhite);
    this._lineColor = bar.borderColor || (this.theme ? this.theme.lightGreen : COLOR.lightGreen);

    this._percentageValue = options.value || 0;
    this.displayValue = options.displayValue || '';
    this.arrowColor = options.arrowColor || (this.theme ? this.theme.blue : COLOR.blue);
  }

  isAnimating(): boolean {
    return this._barX !== this._nextBarX || this._arrow !== null;
  }

  drawObject() {
    this._ctx.globalCompositeOperation = 'destination-over';

    // Draw left half text
    this._ctx.save();
    this._ctx.beginPath();
    this._ctx.rect(this._arrowWidth, this._pctHeight, this._barX - this._arrowWidth, this._meterHeight);
    this._ctx.clip();

    this._shape.fillText(this.displayValue, this._viewWidth / 2, 75, '30px Arial', 'center', this.bgColor);

    this._ctx.fillStyle = this.fillColor;
    this._ctx.fillRect(this._arrowWidth, this._pctHeight, this._barX - this._arrowWidth, this._meterHeight);
    this._ctx.restore();

    this._ctx.save();
    this._ctx.globalCompositeOperation = 'destination-over';

    // Draw right half text
    this._ctx.beginPath();
    this._ctx.rect(this._barX, this._pctHeight, this._viewWidth - this._barX - this._arrowWidth, this._meterHeight);
    this._ctx.clip();

    this._shape.fillText(this.displayValue, this._viewWidth / 2, 75, '30px Arial', 'center', this.fillColor);

    this._shape.fillRect(this._barX, this._pctHeight, this._viewWidth - this._barX - this._arrowWidth,
      this._meterHeight, this.bgColor);
    this._ctx.restore();

    this._ctx.save();
    this._ctx.globalCompositeOperation = 'source-over';

    // Draw the border.
    this._ctx.lineWidth = this._lineWidth;
    this._ctx.strokeStyle = this._lineColor;
    this._ctx.beginPath();
    this._ctx.rect(this._arrowWidth, this._pctHeight, this._meterWidth, this._meterHeight);
    this._ctx.stroke();
    this._ctx.closePath();

    // Draw percentage value
    this._ctx.fillStyle = this.markerBgColor;

    this._ctx.fillRect(this._barX - 25, 0, 50, this._actualPctHeight);
    this._shape.fillText(this._percentageValue + '%', this._barX, 20, '16px Arial', 'center', this.markerFontColor);

    this._ctx.beginPath();
    this._ctx.fillStyle = this.markerBgColor;
    this._ctx.moveTo(this._barX - 8, this._actualPctHeight - this._lineWidth / 2);
    this._ctx.lineTo(this._barX, this._pctHeight + this._lineWidth / 2);
    this._ctx.lineTo(this._barX + 8, this._actualPctHeight - this._lineWidth / 2);
    this._ctx.fill();
    this._ctx.closePath();

    // Draw arrow.
    if (this._arrow === null) {
      this.drawLeftArrow();
      this.drawRightArrow();
    } else if (this._arrow === 'left') {
      this.drawLeftArrow();
    } else {
      // right
      this.drawRightArrow();
    }
    this._ctx.restore();

    // Calculate next position barX
    const oldBarX = this._barX;

    this._barX = Utility.getNextPos(this._barX, this._nextBarX, this.speed);

    if (this._barX !== oldBarX || this._arrow !== null) {
      this._dirty = true;
    }
  }

  drawLeftArrow() {
    if (this._leftArrowX <= 0) {
      this._leftArrowX = this._arrowWidth - 3;
    } else {
      this._leftArrowX = Utility.getNextPos(this._leftArrowX, 0, -this._arrowSpeed);
    }
    this._shape.fillTriangle(this._leftArrowX, this._actualPctHeight + 10, this._leftArrowX - 20, this._middleBarHeight,
      this._leftArrowX, 90, this.arrowColor);
  }

  drawRightArrow() {
    if (this._rightArrowX >= this._viewWidth) {
      this._rightArrowX = this._arrowWidth + 3 + this._meterWidth;
    } else {
      this._rightArrowX = Utility.getNextPos(this._rightArrowX, this._viewWidth, this._arrowSpeed);
    }
    this._shape.fillTriangle(this._rightArrowX, this._actualPctHeight + 10, this._rightArrowX + 20,
      this._middleBarHeight, this._rightArrowX, 90, this.arrowColor);
  }

  set value(value: number) {
    if (value >= 0 && value <= 100) {
      if (value < this._percentageValue) {
        this.speed = -Math.abs(this.speed);
        this._arrow = 'left';
      } else if (value > this._percentageValue) {
        this.speed = Math.abs(this.speed);
        this._arrow = 'right';
      } else {
        this._arrow = null;
      }
      this._percentageValue = Math.floor(value);
      this._nextBarX = (this._percentageValue / 100) * this._meterWidth + this._arrowWidth;
      this._dirty = true;
    }
  }

  get value(): number {
    return this._percentageValue;
  }
}

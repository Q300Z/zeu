import Utility from './utility';
import BaseComponent, { BaseOptions } from './base-component';
import { COLOR } from './color';

export interface TextBoxOptions extends BaseOptions {
  text?: {
    value?: string | number;
    fontColor?: string;
    bgColor?: string;
  };
  bgColor?: string;
  borderColor?: string;
  waveColor?: string;
}

export default class TextBox extends BaseComponent {
  private _borderWidth: number = 8;
  private _borderHeight: number = 30;
  private _space: number = 10;
  private _waveY: number = 0;
  private _waveSpeed: number = 1;
  private _isWaveOn: boolean = false;
  private _textValue: string | number = '';

  public textColor: string = COLOR.white;
  public textBgColor: string = COLOR.blue;
  public bgColor: string = 'rgba(0, 0, 0, 0.01)';
  public borderColor: string = COLOR.blue;
  public waveColor: string = COLOR.blue;

  constructor(canvas: string, options: TextBoxOptions = {}) {
    const viewWidth = options.viewWidth || 200;

    super(canvas, options, viewWidth, 100);
  }

  setOptions(options: TextBoxOptions = {}) {
    const text = options.text || {};

    this._textValue = text.value || '';
    this.textColor = text.fontColor || (this.theme ? this.theme.white : COLOR.white);
    this.textBgColor = text.bgColor || (this.theme ? this.theme.blue : COLOR.blue);

    this.bgColor = options.bgColor || 'rgba(0, 0, 0, 0.01)';
    this.borderColor = options.borderColor || (this.theme ? this.theme.blue : COLOR.blue);
    this.waveColor = options.waveColor || (this.theme ? this.theme.blue : COLOR.blue);
  }

  clear() {
    this._ctx.fillStyle = this.bgColor;
    this._ctx.fillRect(this._x, this._y, this._width, this._height);
  }

  isAnimating(): boolean {
    return this._isWaveOn;
  }

  drawObject() {
    this._ctx.textAlign = 'center';

    // Draw wave line
    if (this._isWaveOn) {
      const waveWidth = 1;

      if (this._waveY >= ((this._viewHeight / 2) + waveWidth)) {
        this._waveY = 0;
        this._isWaveOn = false;
      } else {
        this._ctx.fillStyle = this.waveColor;
        this._ctx.beginPath();
        this._ctx.fillRect(0, this._waveY, this._viewWidth + waveWidth, waveWidth);
        this._ctx.closePath();

        this._ctx.beginPath();
        this._ctx.fillRect(0, this._viewHeight - this._waveY - waveWidth, this._viewWidth, waveWidth);
        this._ctx.closePath();
        this._waveY = Utility.getNextPos(this._waveY, this._viewHeight / 2 + waveWidth, this._waveSpeed);
        this._dirty = true;
      }
    }

    // Draw the border.
    // Top left
    this._ctx.fillStyle = this.borderColor;
    this._ctx.fillRect(0, 0, this._borderHeight, this._borderWidth);
    this._ctx.fillRect(0, 0, this._borderWidth, this._borderHeight);
    // Bottom left
    this._ctx.fillRect(0, this._viewHeight - this._borderHeight, this._borderWidth, this._borderHeight);
    this._ctx.fillRect(0, this._viewHeight - this._borderWidth, this._borderHeight, this._borderWidth);
    // Top right
    this._ctx.fillRect(this._viewWidth - this._borderHeight, 0, this._borderHeight, this._borderWidth);
    this._ctx.fillRect(this._viewWidth - this._borderWidth, 0, this._borderWidth, this._borderHeight);

    // Bottom right
    this._ctx.fillRect(this._viewWidth - this._borderHeight, this._viewHeight - this._borderWidth,
      this._borderHeight, this._borderWidth);
    this._ctx.fillRect(this._viewWidth - this._borderWidth, this._viewHeight - this._borderHeight,
      this._borderWidth, this._borderHeight);

    // Draw background rect.
    this._ctx.fillStyle = this.textBgColor;
    this._ctx.fillRect(this._borderWidth + this._space, this._borderWidth + this._space,
      this._viewWidth - 2 * (this._borderWidth + this._space),
      this._viewHeight - 2 * (this._borderWidth + this._space));

    // Draw text.
    this._shape.fillText(String(this._textValue), this._viewWidth / 2, this._viewHeight - 35,
      '40px Arial', 'center', this.textColor);
  }

  set value(s: string | number) {
    this._textValue = s;
    this._isWaveOn = true;
    this._dirty = true;
  }

  get value(): string | number {
    return this._textValue;
  }
}

import Utility from './utility';
import BaseComponent, { BaseOptions } from './base-component';
import { COLOR } from './color';

export interface SpeedCircleOptions extends BaseOptions {
  circle1?: {
    speed?: number;
    color?: string;
  };
  circle2?: {
    speed?: number;
    color?: string;
  };
  circle3?: {
    speed?: number;
    color?: string;
  };
  circle4?: {
    speed?: number;
    color?: string;
  };
  text?: {
    color?: string;
    value?: string | number;
  };
}

export default class SpeedCircle extends BaseComponent {
  private _font: string = '25px Arial';
  private _degree1: number = 0;
  private _degree2: number = 0;
  private _degree3: number = 0;
  private _degree4: number = 0;

  public speed1!: number;
  public color1!: string;
  public speed2!: number;
  public color2!: string;
  public speed3!: number;
  public color3!: string;
  public speed4!: number;
  public color4!: string;
  public textColor!: string;
  public textValue!: string | number;

  constructor(canvas: string, options: SpeedCircleOptions = {}) {
    super(canvas, options, 200, 200);
  }

  setOptions(options: SpeedCircleOptions = {}) {
    const c1 = options.circle1 || {};
    const c2 = options.circle2 || {};
    const c3 = options.circle3 || {};
    const c4 = options.circle4 || {};
    const text = options.text || {};

    this.speed1 = c1.speed !== undefined ? c1.speed : 0.5;
    this.color1 = c1.color || (this.theme ? this.theme.red : COLOR.red);

    this.speed2 = c2.speed !== undefined ? c2.speed : -0.5;
    this.color2 = c2.color || (this.theme ? this.theme.yellow : COLOR.yellow);

    this.speed3 = c3.speed !== undefined ? c3.speed : 0.5;
    this.color3 = c3.color || (this.theme ? this.theme.blue : COLOR.blue);

    this.speed4 = c4.speed !== undefined ? c4.speed : -0.5;
    this.color4 = c4.color || (this.theme ? this.theme.grey : COLOR.grey);

    this.textColor = text.color || (this.theme ? this.theme.green : COLOR.green);
    this.textValue = text.value !== undefined ? text.value : '';
  }

  isAnimating(): boolean {
    return this.speed1 !== 0 || this.speed2 !== 0 || this.speed3 !== 0 || this.speed4 !== 0;
  }

  drawObject() {
    this._degree1 = Utility.getNextAngleByDegree(this._degree1, this.speed1);
    this._degree2 = Utility.getNextAngleByDegree(this._degree2, this.speed2);
    this._degree3 = Utility.getNextAngleByDegree(this._degree3, this.speed3);
    this._degree4 = Utility.getNextAngleByDegree(this._degree4, this.speed4);

    const a1 = Utility.getAngleByDegree(this._degree1);
    const a2 = Utility.getAngleByDegree(this._degree2);
    const a3 = Utility.getAngleByDegree(this._degree3);
    const a4 = Utility.getAngleByDegree(this._degree4);

    this._ctx.translate(100, 100);
    this._ctx.rotate(a1);
    // Draw bar circle 1.
    this._ctx.strokeStyle = this.color1;
    this._ctx.lineWidth = 8;
    const space = 0.02;
    let len = 0.5;
    let start = 0;
    let end = len;

    for (let i = 0; i < 6; i++) {
      this._ctx.beginPath();
      this._ctx.arc(0, 0, 90, Math.PI * start, Math.PI * end);
      this._ctx.stroke();
      this._ctx.closePath();

      start = end + space;
      len /= 1.7;
      end = start + len;
    }

    this._ctx.restore();
    this.save();
    this._ctx.translate(100, 100);
    this._ctx.rotate(a3);

    // Draw dot circle 3.
    for (let i = 0; i < 360; i = i + 9) {
      const a = Utility.getAngleByDegree(i);

      const x = 64 * Math.cos(a);
      const y = 64 * Math.sin(a);

      this._shape.fillCircle(x, y, 3, this.color3);
    }

    this._ctx.restore();
    this.save();
    this._ctx.translate(100, 100);
    this._ctx.rotate(a2);

    // Draw bar circle 2.
    for (let i = 0; i < 360; i = i + 8) {
      const a = Utility.getAngleByDegree(i);

      const x1 = 70 * Math.cos(a);
      const y1 = 70 * Math.sin(a);

      const x2 = 83 * Math.cos(a);
      const y2 = 83 * Math.sin(a);

      this._shape.line(x1, y1, x2, y2, 6, this.color2);
    }

    this._ctx.restore();
    this.save();
    this._ctx.translate(100, 100);
    this._ctx.rotate(a4);

    // Draw bar circle 4.
    this._ctx.lineWidth = 5;
    this._ctx.strokeStyle = this.color4;
    const len4 = (2 - (12 * space)) / 12;
    let start4 = 0;
    let end4 = len4;

    for (let i = 0; i < 12; i++) {
      this._ctx.beginPath();
      this._ctx.arc(0, 0, 56, Math.PI * start4, Math.PI * end4);
      this._ctx.stroke();
      this._ctx.closePath();
      start4 = end4 + space;
      end4 = start4 + len4;
    }

    this._ctx.restore();
    this.save();
    // Draw the text in the middle.
    this._shape.fillText(String(this.textValue), 100, 110, this._font, 'center', this.textColor);

    if (this.speed1 !== 0 || this.speed2 !== 0 || this.speed3 !== 0 || this.speed4 !== 0) {
      this._dirty = true;
    }
  }
}

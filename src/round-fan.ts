import { COLOR } from './color';
import Utility from './utility';
import BaseComponent, { BaseOptions } from './base-component';

export interface RoundFanOptions extends BaseOptions {
  fanColor?: string;
  center?: {
    color?: string;
    bgColor?: string;
  };
  speed?: number;
}

export default class RoundFan extends BaseComponent {
  private _degree: number = 0;
  public fanColor!: string;
  public centerColor!: string;
  public centerBgColor!: string;
  public speed!: number;

  constructor(canvas: string, options: RoundFanOptions = {}) {
    super(canvas, options, 200, 200);
  }

  setOptions(options: RoundFanOptions = {}) {
    const center = options.center || {};

    this.fanColor = options.fanColor || (this.theme ? this.theme.green : COLOR.green);

    this.centerColor = center.color || (this.theme ? this.theme.green : COLOR.green);
    this.centerBgColor = center.bgColor || (this.theme ? this.theme.white : COLOR.white);

    this.speed = options.speed !== undefined ? options.speed : 1;
  }

  isAnimating(): boolean {
    return this.speed !== 0;
  }

  drawObject() {
    this._degree = Utility.getNextAngleByDegree(this._degree, this.speed);
    const angle = Utility.getAngleByDegree(this._degree);

    this._ctx.translate(100, 100);
    this._ctx.rotate(angle);

    this._ctx.beginPath();
    this._ctx.moveTo(0, 0);

    // Up
    this._ctx.quadraticCurveTo(-60, -80, 0, -90);
    this._ctx.quadraticCurveTo(80, -100, 0, 0);

    // Right
    this._ctx.quadraticCurveTo(80, -60, 90, 0);
    this._ctx.quadraticCurveTo(100, 80, 0, 0);

    // Down
    this._ctx.quadraticCurveTo(60, 80, 0, 90);
    this._ctx.quadraticCurveTo(-80, 100, 0, 0);

    // Left
    this._ctx.quadraticCurveTo(-80, 60, -90, 0);
    this._ctx.quadraticCurveTo(-100, -80, 0, 0);

    this._ctx.fillStyle = this.fanColor;
    this._ctx.fill();
    this._ctx.closePath();

    this._shape.fillCircle(0, 0, 35, this.centerBgColor);
    this._shape.fillCircle(0, 0, 30, this.centerColor);
    this._shape.fillCircle(0, 0, 10, this.centerBgColor);

    if (this.speed !== 0) {
      this._dirty = true;
    }
  }
}

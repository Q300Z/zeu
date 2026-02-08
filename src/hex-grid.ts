import BaseComponent, { BaseOptions } from './base-component';
import { COLOR } from './color';

export interface HexText {
  value: string | number;
  color: string;
  font?: string;
  xOffset?: number;
  yOffset?: number;
}

export interface HexBlink {
  text: {
    value: string | number;
    color: string;
  };
  borderColor: string;
  bgColor: string;
  interval: number;
  on: boolean;
  lastCall: number;
}

export interface HexNode {
  id: string;
  x: number;
  y: number;
  bgColor: string;
  borderColor: string;
  text: HexText;
  blink: HexBlink;
}

export interface HexGridOptions extends BaseOptions {
  space?: number;
  radius?: number;
  border?: number;
}

export interface HexParams {
  id: string;
  x: number;
  y: number;
  bgColor?: string;
  borderColor?: string;
  text?: Partial<HexText>;
}

export interface BlinkParams {
  id: string;
  text?: Partial<HexText>;
  borderColor?: string;
  bgColor?: string;
  interval?: number;
}

export default class HexGrid extends BaseComponent {
  private _nodes: HexNode[] = [];
  private _space: number = 5;
  private _radius: number = 20;
  private _border: number = 3;

  constructor(canvas: string, options: HexGridOptions = {}) {
    const viewWidth = options.viewWidth || 200;
    const viewHeight = options.viewHeight || 200;

    super(canvas, options, viewWidth, viewHeight);
  }

  setOptions(options: HexGridOptions = {}) {
    this._space = options.space || 5;
    this._radius = options.radius || 20;
    this._border = options.border || 3;
  }

  isAnimating(): boolean {
    return this._nodes.some(h => h.blink.on);
  }

  drawObject() {
    // 1. Draw static background from offscreen cache
    this.drawOffscreen();

    // 2. Draw only dynamic (blinking) elements
    const s = this._space;
    const r = this._radius;
    const w = Math.pow(3, 0.5) * r / 2;
    const now = Date.now();
    let animating = false;

    this._nodes.forEach((h) => {
      if (h.blink.on) {
        animating = true;
        const interval = h.blink.interval;
        const lastCall = h.blink.lastCall;

        if (now - lastCall < interval) {
          const xOffset = h.x % 2 === 0 ? s + w : s * 3 / 2 + 2 * w;
          const y = (s + r) + (w + s / 2) * Math.pow(3, 0.5) * h.x;

          this.drawHex(xOffset + (2 * w + s) * h.y, y, r, h.blink.bgColor, h.blink.borderColor, h.blink.text as HexText,
            h.text.xOffset || 0, h.text.yOffset || 0);
        } else if (now - lastCall >= (interval * 2)) {
          h.blink.lastCall = now;
        }
      }
    });

    if (animating) {
      this._dirty = true;
    }
  }

  drawStatic() {
    const s = this._space;
    const r = this._radius;
    const w = Math.pow(3, 0.5) * r / 2;

    this._offscreenCtx.lineWidth = this._border;

    this._nodes.forEach((h) => {
      const xOffset = h.x % 2 === 0 ? s + w : s * 3 / 2 + 2 * w;
      const y = (s + r) + (w + s / 2) * Math.pow(3, 0.5) * h.x;

      const x = xOffset + (2 * w + s) * h.y;

      // Draw to offscreen context
      this._offscreenCtx.strokeStyle = h.borderColor;
      this._offscreenCtx.beginPath();
      this._offscreenCtx.moveTo(x, y - r);
      this._offscreenCtx.lineTo(x + w, y - r / 2);
      this._offscreenCtx.lineTo(x + w, y + r / 2);
      this._offscreenCtx.lineTo(x, y + r);
      this._offscreenCtx.lineTo(x - w, y + r / 2);
      this._offscreenCtx.lineTo(x - w, y - r / 2);
      this._offscreenCtx.lineTo(x, y - r);
      this._offscreenCtx.closePath();
      this._offscreenCtx.stroke();
      this._offscreenCtx.fillStyle = h.bgColor;
      this._offscreenCtx.fill();

      // Text to offscreen
      this._offscreenCtx.beginPath();
      this._offscreenCtx.font = h.text.font || '12px Arial';
      this._offscreenCtx.textAlign = 'center';
      this._offscreenCtx.fillStyle = h.text.color;
      this._offscreenCtx.fillText(String(h.text.value), x + (h.text.xOffset || 0), y + (h.text.yOffset || 0));
      this._offscreenCtx.closePath();
    });
  }
  drawHex(x: number, y: number, r: number, bgColor: string, lineColor: string,
    text: HexText, xOffset: number, yOffset: number) {
    const w = Math.pow(3, 0.5) * r / 2;

    this._ctx.strokeStyle = lineColor;
    this._ctx.beginPath();
    this._ctx.moveTo(x, y - r);
    this._ctx.lineTo(x + w, y - r / 2);
    this._ctx.lineTo(x + w, y + r / 2);
    this._ctx.lineTo(x, y + r);
    this._ctx.lineTo(x - w, y + r / 2);
    this._ctx.lineTo(x - w, y - r / 2);
    this._ctx.lineTo(x, y - r);
    this._ctx.closePath();
    this._ctx.stroke();
    this._ctx.fillStyle = bgColor;
    this._ctx.fill();

    this._shape.fillText(String(text.value), x + xOffset, y + yOffset, text.font || '12px Arial', 'center', text.color);
  }

  saveHex(params: HexParams) {
    const text = params.text || {};
    const node: HexNode = {
      id: params.id,
      x: params.x,
      y: params.y,
      bgColor: params.bgColor || (this.theme ? this.theme.white : COLOR.white),
      borderColor: params.borderColor || (this.theme ? this.theme.white : COLOR.white),
      text: {
        value: text.value !== undefined ? text.value : '',
        color: text.color || (this.theme ? this.theme.black : COLOR.black),
        font: text.font || '12px Arial',
        xOffset: text.xOffset || 0,
        yOffset: text.yOffset || 0
      },
      blink: {
        text: {
          value: '',
          color: (this.theme ? this.theme.black : COLOR.black)
        },
        borderColor: params.borderColor || (this.theme ? this.theme.white : COLOR.white),
        bgColor: (this.theme ? this.theme.red : COLOR.red),
        interval: 1000,
        on: false,
        lastCall: 0
      }
    };

    const index = this._nodes.findIndex(n => n.id === node.id);

    if (index !== -1) {
      this._nodes[index] = node;
    } else {
      this._nodes.push(node);
    }
    this._staticRendered = false;
    this._dirty = true;
  }

  blinkOn(params: BlinkParams) {
    const text = params.text || {};

    for (let i = 0; i < this._nodes.length; i++) {
      if (this._nodes[i].id === params.id) {
        this._nodes[i].blink.text.value = text.value !== undefined ? text.value : '';
        this._nodes[i].blink.text.color = text.color || (this.theme ? this.theme.black : COLOR.black);
        this._nodes[i].blink.borderColor = params.borderColor || (this.theme ? this.theme.white : COLOR.white);
        this._nodes[i].blink.bgColor = params.bgColor || (this.theme ? this.theme.red : COLOR.red);
        this._nodes[i].blink.interval = params.interval || 1000;
        this._nodes[i].blink.on = true;
        this._dirty = true;
        break;
      }
    }
  }

  blinkOff(id: string) {
    for (let i = 0; i < this._nodes.length; i++) {
      if (this._nodes[i].id === id) {
        this._nodes[i].blink.on = false;
        this._dirty = true;
        break;
      }
    }
  }
}

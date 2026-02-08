export default class Shape {
  private _ctx: CanvasRenderingContext2D;

  /**
   * @constructor
   * @param {CanvasRenderingContext2D} ctx context from canvas.getContext('2d')
   */
  constructor(ctx: CanvasRenderingContext2D) {
    this._ctx = ctx;
  }

  /**
   * Create a filled rectangle
   */
  fillRect(x1: number, y1: number, x2: number, y2: number, fillStyle: string) {
    this._ctx.beginPath();
    this._ctx.fillStyle = fillStyle;
    this._ctx.fillRect(x1, y1, x2, y2);
    this._ctx.closePath();
  }

  /**
   * Create a filled triangle
   */
  fillTriangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, fillStyle: string) {
    this._ctx.beginPath();
    this._ctx.fillStyle = fillStyle;
    this._ctx.moveTo(x1, y1);
    this._ctx.lineTo(x2, y2);
    this._ctx.lineTo(x3, y3);
    this._ctx.fill();
    this._ctx.closePath();
  }

  /**
   * Create a filled text
   */
  fillText(text: string, x: number, y: number, font: string, textAlign: CanvasTextAlign, fillStyle: string) {
    this._ctx.beginPath();
    this._ctx.font = font;
    this._ctx.textAlign = textAlign;
    this._ctx.fillStyle = fillStyle;
    this._ctx.fillText(text, x, y);
    this._ctx.closePath();
  }

  /**
   * Create a line
   */
  line(x1: number, y1: number, x2: number, y2: number, lineWidth: number, strokeStyle: string) {
    this._ctx.beginPath();
    this._ctx.lineWidth = lineWidth;
    this._ctx.strokeStyle = strokeStyle;
    this._ctx.moveTo(x1, y1);
    this._ctx.lineTo(x2, y2);
    this._ctx.closePath();
    this._ctx.stroke();
  }

  /**
   * Create a filled circle
   */
  fillCircle(x: number, y: number, radius: number, fillStyle: string) {
    this._ctx.beginPath();
    this._ctx.fillStyle = fillStyle;
    this._ctx.arc(x, y, radius, 0, 2 * Math.PI);
    this._ctx.fill();
    this._ctx.closePath();
  }
}

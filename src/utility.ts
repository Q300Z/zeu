export default class Utility {

  constructor() {}

  static getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static getRandomColor(): string {
    return '#' + ((1 << 24) * Math.random() | 0).toString(16);
  }

  static has(object: Record<string, unknown> | null | undefined, key: string): boolean {
    return object ? Object.prototype.hasOwnProperty.call(object, key) : false;
  }

  static addHour(h: number): Date {
    const now = new Date();

    now.setHours(now.getHours() + h);
    return now;
  }

  static getAngleByDate(speed: number, date: Date): number {
    return ((speed * Math.PI) / 6) * date.getSeconds() + ((speed * Math.PI) / 6000) * date.getMilliseconds();
  }

  static getNextAngleByDegree(degree: number, speed: number): number {
    if (degree >= 360) {
      return 0;
    }
    return degree + speed;
  }

  static getAngleByDegree(degree: number): number {
    return degree * Math.PI / 180;
  }

  static hexToRgba(hex: string, opacity: number): string {
    const h = hex.replace('#', '');
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);

    return 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
  }

  static hexToRgb(hex: string): number[] {
    const h = hex.replace('#', '');
    const color = [];

    color[0] = parseInt(h.substring(0, 2), 16);
    color[1] = parseInt(h.substring(2, 4), 16);
    color[2] = parseInt(h.substring(4, 6), 16);
    return color;
  }

  static hex(c: number): string {
    const s = '0123456789abcdef';

    // Safety check if c is not a number, though TS should prevent it
    if (isNaN(c)) {
      return '00';
    }

    const i = Math.round(Math.min(Math.max(0, c), 255));

    return s.charAt((i - i % 16) / 16) + s.charAt(i % 16);
  }

  static convertToHex(rgb: number[]): string {
    return this.hex(rgb[0]) + this.hex(rgb[1]) + this.hex(rgb[2]);
  }

  static generateGradientColor(colorStart: string, colorEnd: string, colorCount: number): string[] {
    const start = this.hexToRgb(colorStart);
    const end = this.hexToRgb(colorEnd);
    const len = colorCount;
    let alpha = 0.0;
    const rt = [];

    for (let i = 0; i < len; i++) {
      const c = [];

      alpha += (1.0 / len);
      c[0] = start[0] * alpha + (1 - alpha) * end[0];
      c[1] = start[1] * alpha + (1 - alpha) * end[1];
      c[2] = start[2] * alpha + (1 - alpha) * end[2];
      rt.push(this.convertToHex(c));
    }
    return rt;
  }

  static isDefined(o: unknown): boolean {
    return o !== undefined && o !== null;
  }

  static leftPadZero(n: number): string | number {
    if (n < 10) {
      return '0' + n;
    }
    return n;
  }

  static getNextPos(curr: number, dest: number, speed: number): number {
    if (speed > 0 && curr + speed >= dest) {
      return dest;
    }

    if (speed < 0 && curr + speed <= dest) {
      return dest;
    }
    return curr + speed;
  }

  static shuffleArray<T>(a: T[]): T[] {
    let j = 0;
    let temp: T;

    for (let i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      temp = a[i];
      a[i] = a[j];
      a[j] = temp;
    }
    return a;
  }

  static prepareCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.scale(dpr, dpr);
    }
  }
}

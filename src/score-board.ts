import BaseComponent, { BaseOptions } from './base-component';
import Utility from './utility';
import { COLOR } from './color';

export interface ScoreBoardOptions extends BaseOptions {
  rowHeight?: number;
  space?: number;
  font?: string;
  speed?: number;
  order?: 'asc' | 'desc';
}

export interface ScoreRow {
  id: string;
  score: number;
  bgColor: string;
  text: {
    value: string | number;
    color: string;
    xOffset: number;
    yOffset: number;
  };
  x: number;
  y: number;
  destX: number;
  destY: number;
  speedX: number;
  speedY: number;
  moveType: 'move' | 'remove';
}

export interface ScoreParams {
  id: string;
  score?: number;
  bgColor?: string;
  text?: {
    value?: string | number;
    color?: string;
    xOffset?: number;
    yOffset?: number;
  };
}

export default class ScoreBoard extends BaseComponent {
  private _rows: ScoreRow[] = [];
  private _rowHeight!: number;
  private _space!: number;
  private _font!: string;
  private _speed!: number;
  private _order!: 'asc' | 'desc';

  constructor(canvas: string, options: ScoreBoardOptions = {}) {
    const viewWidth = options.viewWidth || 200;
    const viewHeight = options.viewHeight || 200;

    super(canvas, options, viewWidth, viewHeight);
  }

  setOptions(options: ScoreBoardOptions = {}) {
    this._rowHeight = options.rowHeight || 20;
    this._space = options.space || 0;
    this._font = options.font || '10px Arial';
    this._speed = options.speed || 5;
    this._order = options.order !== undefined ? options.order : 'asc';
  }

  sort() {
    if (this._order === 'asc') {
      this._rows.sort((a, b) => a.score - b.score);
    } else {
      this._rows.sort((a, b) => b.score - a.score);
    }
  }

  isAnimating(): boolean {
    for (let i = 0; i < this._rows.length; i++) {
      const row = this._rows[i];

      if (row.moveType === 'move') {
        const destY = i * (this._rowHeight + this._space);

        if (row.y !== destY) {
          return true;
        }
      } else if (row.moveType === 'remove') {
        return true;
      }
    }
    return false;
  }

  drawObject() {
    let animating = false;

    for (let i = 0; i < this._rows.length; i++) {
      const row = this._rows[i];

      this._shape.fillRect(row.x, row.y, this._viewWidth, this._rowHeight, row.bgColor);
      this._shape.fillText(String(row.text.value), row.x + row.text.xOffset, row.y + row.text.yOffset,
        this._font, 'left', row.text.color);

      if (row.moveType === 'move') {
        const destY = i * (this._rowHeight + this._space);

        if (row.y !== destY) {
          const speedY = destY > row.y ? this._speed : -this._speed;

          this._rows[i].y = Utility.getNextPos(row.y, destY, speedY);
          animating = true;
        }
      } else if (row.moveType === 'remove') {
        if (row.destX < 0 && row.x === row.destX) {
          this._rows[i].speedX = this._speed * 2;
          this._rows[i].destX = this._viewWidth + 10;
        }
        const oldX = row.x;

        this._rows[i].x = Utility.getNextPos(row.x, this._rows[i].destX, this._rows[i].speedX);
        if (this._rows[i].x !== oldX) {
          animating = true;
        }
      }
    }

    // Delete the row.
    for (let i = this._rows.length - 1; i >= 0; i--) {
      const row = this._rows[i];

      if (row.moveType === 'remove' && row.destX > 0 && row.x === row.destX) {
        this._rows.splice(i, 1);
        animating = true;
      }
    }

    if (animating) {
      this._dirty = true;
    }
  }

  update(params: ScoreParams) {
    const id = params.id;
    const text = params.text || {};

    let isSort = false;

    for (let i = 0; i < this._rows.length; i++) {
      if (this._rows[i].id === id) {
        if (params.score !== undefined && this._rows[i].score !== params.score) {
          isSort = true;
          this._rows[i].score = params.score;
        }
        this._rows[i].moveType = 'move';
        this._rows[i].bgColor = params.bgColor || this._rows[i].bgColor;
        this._rows[i].text.value = text.value !== undefined ? text.value : this._rows[i].text.value;
        this._rows[i].text.color = text.color || this._rows[i].text.color;
        break;
      }
    }

    if (isSort) {
      this.sort();
    }
    this._dirty = true;
  }

  remove(id: string) {
    let isFound = false;

    for (let i = 0; i < this._rows.length; i++) {
      if (this._rows[i].id === id && this._rows[i].moveType !== 'remove') {
        this._rows[i].moveType = 'remove';
        this._rows[i].speedX = -this._speed;
        this._rows[i].destX = -40;
        isFound = true;
        break;
      }
    }

    if (isFound) {
      this.sort();
    }
    this._dirty = true;
  }

  add(params: ScoreParams) {
    for (let i = 0; i < this._rows.length; i++) {
      if (this._rows[i].id === params.id) {
        return;
      }
    }

    const text = params.text || {};
    const row: ScoreRow = {
      id: params.id,
      score: params.score || 0,
      bgColor: params.bgColor || (this.theme ? this.theme.blue : COLOR.blue),
      text: {
        value: text.value !== undefined ? text.value : '',
        color: text.color || (this.theme ? this.theme.white : COLOR.white),
        xOffset: text.xOffset || 0,
        yOffset: text.yOffset || 0
      },
      x: 0,
      y: this._viewHeight, // Start from bottom
      destX: 0,
      destY: 0,
      speedX: 0,
      speedY: 0,
      moveType: 'move'
    };

    this._rows.push(row);
    this.sort();
    this._dirty = true;
  }

  get rows(): ScoreRow[] {
    return this._rows;
  }
}

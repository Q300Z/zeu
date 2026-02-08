import BaseComponent, { BaseOptions } from './base-component';
import Utility from './utility';
import { COLOR } from './color';

export interface GraphEdgeOptions {
  width?: number;
  color?: string;
  dash?: number[];
}

export interface GraphNeighbor {
  id: string;
  edge?: GraphEdgeOptions;
}

export interface GraphNode {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  text?: {
    value?: string;
    color?: string;
    font?: string;
    xOffset?: number;
    yOffset?: number;
  };
  neighbors?: GraphNeighbor[];
}

export interface GraphSignal {
  x: number;
  y: number;
  destX: number;
  destY: number;
  speedX: number;
  speedY: number;
  color: string;
  size: number;
}

export interface NetworkGraphOptions extends BaseOptions {
  nodes?: GraphNode[];
}

export interface SignalParams {
  from: string;
  to: string;
  color?: string;
  duration?: number;
  size?: number;
}

export default class NetworkGraph extends BaseComponent {
  private _nodes: GraphNode[] = [];
  private _signalQueues: GraphSignal[] = [];

  constructor(canvas: string, options: NetworkGraphOptions = {}) {
    const viewWidth = options.viewWidth || 200;
    const viewHeight = options.viewHeight || 200;

    super(canvas, options, viewWidth, viewHeight);
  }

  setOptions(options: NetworkGraphOptions = {}) {
    this._nodes = options.nodes || [];
  }

  drawObject() {

    // 1. Draw static background (nodes and edges)

    this.drawOffscreen();

    // 2. Draw moving signals

    const toDelete: number[] = [];

    let animating = false;

    for (let i = 0; i < this._signalQueues.length; i++) {

      const signal = this._signalQueues[i];

      const oldX = signal.x;

      const oldY = signal.y;

      this._signalQueues[i].x = Utility.getNextPos(signal.x, signal.destX, signal.speedX);

      this._signalQueues[i].y = Utility.getNextPos(signal.y, signal.destY, signal.speedY);

      if (this._signalQueues[i].x === signal.destX && this._signalQueues[i].y === signal.destY) {

        toDelete.push(i);

      } else {

        this._shape.fillCircle(signal.x, signal.y, signal.size, signal.color);

      }

      if (this._signalQueues[i].x !== oldX || this._signalQueues[i].y !== oldY) {

        animating = true;

      }

    }

    // Delete from the signal queue

    for (let i = toDelete.length - 1; i >= 0; i--) {

      this._signalQueues.splice(toDelete[i], 1);

      animating = true;

    }

    if (animating) {

      this._dirty = true;

    }

  }

  drawStatic() {

    // Draw edges

    this._nodes.forEach((node) => {

      const neighbors = node.neighbors || [];

      neighbors.forEach((neighbor) => {

        const destNode = this.getNodeById(neighbor.id);

        if (destNode) {

          const edge = neighbor.edge || {};

          const edgeWidth = edge.width || 1;

          const edgeColor = edge.color || (this.theme ? this.theme.grey : COLOR.grey);

          const edgeDash = edge.dash || [];

          this._offscreenCtx.beginPath();

          if (edgeDash.length !== 0) {

            this._offscreenCtx.setLineDash(edgeDash);

          } else {

            this._offscreenCtx.setLineDash([]);

          }

          this._offscreenCtx.lineWidth = edgeWidth;

          this._offscreenCtx.strokeStyle = edgeColor;

          this._offscreenCtx.moveTo(node.x, node.y);

          this._offscreenCtx.lineTo(destNode.x, destNode.y);

          this._offscreenCtx.stroke();

          this._offscreenCtx.closePath();

        }

      });

    });

    // Draw nodes

    this._nodes.forEach((node) => {

      const text = node.text || {};

      const textValue = text.value || '';

      const textColor = text.color || (this.theme ? this.theme.black : COLOR.black);

      const textFont = text.font || '12px Arial';

      const xTextOffset = text.xOffset || 0;

      const yTextOffset = text.yOffset || 0;

      // Node circle to offscreen

      this._offscreenCtx.beginPath();

      this._offscreenCtx.fillStyle = node.color;

      this._offscreenCtx.arc(node.x, node.y, node.size, 0, 2 * Math.PI);

      this._offscreenCtx.fill();

      this._offscreenCtx.closePath();

      // Text to offscreen

      this._offscreenCtx.beginPath();

      this._offscreenCtx.font = textFont;

      this._offscreenCtx.textAlign = 'center';

      this._offscreenCtx.fillStyle = textColor;

      this._offscreenCtx.fillText(textValue, node.x + xTextOffset, node.y + yTextOffset);

      this._offscreenCtx.closePath();

    });

  }

  getNodeById(nodeId: string): GraphNode | undefined {

    return this._nodes.find(n => n.id === nodeId);

  }

  addNodes(nodes: GraphNode[] = []) {

    this._nodes.push(...nodes);

    this._staticRendered = false;

    this._dirty = true;

  }

  addNeighbor(from: string, neighbor: GraphNeighbor = { id: '' }) {

    for (let i = 0; i < this._nodes.length; i++) {

      if (this._nodes[i].id === from) {

        this._nodes[i].neighbors = this._nodes[i].neighbors || [];

          this._nodes[i].neighbors!.push(neighbor);

          break;

      }

    }

    this._staticRendered = false;

    this._dirty = true;

  }

  isAnimating(): boolean {
    return this._signalQueues.length > 0;
  }

  signal(params: SignalParams) {
    const color = params.color || (this.theme ? this.theme.black : COLOR.black);
    const duration = params.duration || 2000;
    const size = params.size || 3;

    const srcNode = this.getNodeById(params.from);
    const destNode = this.getNodeById(params.to);

    if (srcNode && destNode) {
      const sX = Math.abs(destNode.x - srcNode.x) / (duration / 60);
      const sY = Math.abs(destNode.y - srcNode.y) / (duration / 60);
      const speedX = destNode.x > srcNode.x ? sX : -sX;
      const speedY = destNode.y > srcNode.y ? sY : -sY;

      this._signalQueues.push({
        x: srcNode.x,
        y: srcNode.y,
        destX: destNode.x,
        destY: destNode.y,
        speedX: speedX,
        speedY: speedY,
        color: color,
        size: size
      });
      this._dirty = true;
    }
  }

  get nodes(): GraphNode[] {
    return this._nodes;
  }
}

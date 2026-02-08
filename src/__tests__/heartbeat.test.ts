import { describe, it, expect, vi, beforeEach } from 'vitest';
import Heartbeat from '../heartbeat';

describe('Heartbeat', () => {
  let canvas: HTMLCanvasElement;

  beforeEach(() => {
    // Global mock for all canvas elements (including offscreen)
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      beginPath: vi.fn(),
      closePath: vi.fn(),
      fillRect: vi.fn(),
      fillText: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      scale: vi.fn(),
      clearRect: vi.fn(),
      quadraticCurveTo: vi.fn(),
      setLineDash: vi.fn(),
      drawImage: vi.fn(),
      setTransform: vi.fn(),
    } as any);

    vi.spyOn(HTMLCanvasElement.prototype, 'getBoundingClientRect').mockReturnValue({
      width: 200,
      height: 100,
      top: 0,
      left: 0,
      bottom: 100,
      right: 200,
      x: 0,
      y: 0,
      toJSON: () => {}
    });

    // Create a mock canvas for the component
    canvas = document.createElement('canvas');
    canvas.id = 'test-canvas';
    document.body.appendChild(canvas);
  });

  it('should initialize correctly', () => {
    const hb = new Heartbeat('test-canvas', { speed: 5 });
    expect(hb).toBeDefined();
    expect(hb.viewWidth).toBe(200);
  });

  it('should add beats to queue', () => {
    const hb = new Heartbeat('test-canvas');
    hb.beat({ color: '#ff0000', space: 10 });
    // @ts-ignore
    expect(hb._queue.length).toBeGreaterThan(0);
    // @ts-ignore
    expect(hb._queue[hb._queue.length - 1].color).toBe('#ff0000');
  });

  it('should render pulse using quadraticCurveTo', () => {
    const hb = new Heartbeat('test-canvas');
    const ctx = hb.context;
    
    hb.beat(); // Adds a pulse (time is null)
    hb.drawFrame();
    
    expect(ctx.quadraticCurveTo).toHaveBeenCalled();
  });

  it('should not throw error on destroy', () => {
    const hb = new Heartbeat('test-canvas');
    expect(() => hb.destroy()).not.toThrow();
  });
});

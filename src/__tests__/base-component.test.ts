import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import BaseComponent from '../base-component';
import { COLOR } from '../color';

// Concrete class for testing BaseComponent
class TestComponent extends BaseComponent {
  constructor(id: string) {
    super(id, {}, 100, 100);
  }
  // Expose protected properties for testing
  get x() { return this._x; }
  get y() { return this._y; }
  get width() { return this._width; }
  get height() { return this._height; }
  get dirty() { return this._dirty; }
  set dirty(val: boolean) { this._dirty = val; }
}

describe('BaseComponent', () => {
  let canvas: HTMLCanvasElement;

  beforeEach(() => {
    vi.useFakeTimers();
    canvas = document.createElement('canvas');
    canvas.id = 'base-canvas';
    document.body.appendChild(canvas);

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
      strokeRect: vi.fn(),
      setLineDash: vi.fn(),
      drawImage: vi.fn(),
      setTransform: vi.fn(),
    } as any);

    vi.spyOn(HTMLCanvasElement.prototype, 'getBoundingClientRect').mockReturnValue({
      width: 100,
      height: 100,
      top: 0,
      left: 0,
      bottom: 100,
      right: 100,
      x: 0,
      y: 0,
      toJSON: () => {}
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = '';
  });

  it('should initialize with default values', () => {
    const comp = new TestComponent('base-canvas');
    expect(comp.x).toBe(0);
    expect(comp.y).toBe(0);
    expect(comp.isDisplay()).toBe(true);
  });

  it('should throw error if canvas is not found', () => {
    expect(() => new TestComponent('non-existent')).toThrow("Canvas element with id 'non-existent' not found");
  });

  it('should throw error if context cannot be acquired', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
    expect(() => new TestComponent('base-canvas')).toThrow('Could not get 2d context from canvas');
  });

  it('should handle moveTo animation', () => {
    const comp = new TestComponent('base-canvas');
    // Move to 60, 60 in 60 frames (approx 1s at 60fps)
    comp.moveTo(60, 60, 1000);
    
    expect(comp.eventQueue.length).toBe(1);

    // Simulate some frames
    comp.drawFrame();
    expect(comp.x).toBeGreaterThan(0);
    expect(comp.dirty).toBe(true);

    // Jump to end of animation
    for(let i = 0; i < 60; i++) comp.drawFrame();
    
    expect(comp.x).toBe(60);
    expect(comp.y).toBe(60);
    expect(comp.eventQueue.length).toBe(0);
  });

  it('should handle scaling', () => {
    const comp = new TestComponent('base-canvas');
    comp.scaleTo(2, 2);
    expect(comp.width).toBe(200);
    expect(comp.height).toBe(200);
    expect(comp.dirty).toBe(true);
  });

  it('should handle alert system', () => {
    const comp = new TestComponent('base-canvas');
    expect(comp.isAlert()).toBe(false);

    comp.alertOn({ text: 'DANGER', bgColor: COLOR.red });
    expect(comp.isAlert()).toBe(true);
    expect(comp.dirty).toBe(true);

    // Draw frame while alerting
    comp.dirty = false;
    comp.drawFrame();
    // ctx.save and restore should have been called for alert rendering
    const ctx = comp.context;
    expect(ctx.save).toHaveBeenCalled();
    
    comp.alertOff();
    expect(comp.isAlert()).toBe(false);
  });

  it('should visibility toggle', () => {
    const comp = new TestComponent('base-canvas');
    comp.hide();
    expect(comp.isDisplay()).toBe(false);
    
    // Should skip drawing when hidden
    const spy = vi.spyOn(comp, 'clear');
    comp.drawFrame();
    expect(spy).not.toHaveBeenCalled();

    comp.show();
    expect(comp.isDisplay()).toBe(true);
  });

  it('should handle animation queue registration', () => {
    const comp = new TestComponent('base-canvas');
    expect(comp.isAnimationOn).toBe(true);
    
    comp.removeFromAnimationQueue();
    expect(comp.isAnimationOn).toBe(false);
    
    comp.addToAnimationQueue();
    expect(comp.isAnimationOn).toBe(true);
  });

  it('should handle sequential movements in event queue', () => {
    const comp = new TestComponent('base-canvas');
    comp.moveTo(10, 0, 600); // 10 frames at 60fps (1 unit per frame)
    comp.moveTo(20, 0, 600); 
    
    expect(comp.eventQueue.length).toBe(2);

    // Run 5 frames
    for(let i = 0; i < 5; i++) comp.drawFrame();
    expect(comp.x).toBe(5);
    expect(comp.eventQueue.length).toBe(2);

    // Run 5 more frames -> reach 10
    for(let i = 0; i < 5; i++) comp.drawFrame();
    expect(comp.x).toBe(10);
    
    // The shift happens at the BEGINNING of the NEXT drawFrame
    comp.drawFrame();
    expect(comp.eventQueue.length).toBe(1); // One event consumed

    // Start second move (next frame)
    comp.drawFrame();
    expect(comp.x).toBeGreaterThan(10);
  });

  it('should maintain balanced canvas save/restore state', () => {
    const comp = new TestComponent('base-canvas');
    const ctx = comp.context;
    
    comp.drawFrame();
    
    expect(ctx.save).toHaveBeenCalled();
    expect(ctx.restore).toHaveBeenCalled();
    expect(ctx.save.mock.calls.length).toBe(ctx.restore.mock.calls.length);
  });
});

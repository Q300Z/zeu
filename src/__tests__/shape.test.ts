import { describe, it, expect, vi, beforeEach } from 'vitest';
import Shape from '../shape';

describe('Shape', () => {
  let ctx: any;
  let shape: Shape;

  beforeEach(() => {
    ctx = {
      beginPath: vi.fn(),
      closePath: vi.fn(),
      fillRect: vi.fn(),
      fillText: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
    };
    shape = new Shape(ctx);
  });

  it('should draw fillRect', () => {
    shape.fillRect(0, 0, 10, 10, 'red');
    expect(ctx.beginPath).toHaveBeenCalled();
    expect(ctx.fillStyle).toBe('red');
    expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, 10, 10);
  });

  it('should draw fillCircle', () => {
    shape.fillCircle(50, 50, 20, 'blue');
    expect(ctx.beginPath).toHaveBeenCalled();
    expect(ctx.arc).toHaveBeenCalledWith(50, 50, 20, 0, 2 * Math.PI);
    expect(ctx.fill).toHaveBeenCalled();
  });

  it('should draw line', () => {
    shape.line(0, 0, 100, 100, 2, 'black');
    expect(ctx.moveTo).toHaveBeenCalledWith(0, 0);
    expect(ctx.lineTo).toHaveBeenCalledWith(100, 100);
    expect(ctx.stroke).toHaveBeenCalled();
  });

  it('should draw fillTriangle', () => {
    shape.fillTriangle(0, 0, 10, 0, 5, 10, 'green');
    expect(ctx.lineTo).toHaveBeenCalledTimes(2);
    expect(ctx.fill).toHaveBeenCalled();
  });

  it('should draw fillText', () => {
    shape.fillText('Hello', 10, 10, '12px Arial', 'center', 'black');
    expect(ctx.fillText).toHaveBeenCalledWith('Hello', 10, 10);
    expect(ctx.textAlign).toBe('center');
  });
});

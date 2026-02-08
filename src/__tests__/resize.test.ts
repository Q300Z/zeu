import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { setupCanvas } from './test-helper';
import BarMeter from '../bar-meter';
import DigitalClock from '../digital-clock';

describe('Resizing Logic (scaleByHeight)', () => {
  beforeEach(() => {
    setupCanvas('resize-canvas', 200, 200);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('BarMeter should update actual dimensions and reset cache on resize', () => {
    // Initial viewHeight is 200 (defined in BarMeter super call)
    const meter = new BarMeter('resize-canvas', { viewWidth: 100 });
    
    // Initial scale should be 1 if canvas height is 200
    // @ts-ignore
    expect(meter._scaleY).toBe(1);
    
    meter.drawFrame();
    // @ts-ignore
    expect(meter._staticRendered).toBe(true); // After first draw/init

    // Resize to double height
    meter.scaleByHeight(400);
    
    // @ts-ignore
    expect(meter._scaleY).toBe(2);
    // @ts-ignore
    expect(meter._width).toBe(200); // 100 * 2
    // @ts-ignore
    expect(meter._height).toBe(400); // 200 * 2
    
    // Cache should be invalidated
    // @ts-ignore
    expect(meter._staticRendered).toBe(false);
    
    // Offscreen canvas should be resized accordingly
    // @ts-ignore
    const dpr = window.devicePixelRatio || 1;
    // @ts-ignore
    expect(meter._offscreenCanvas.width).toBe(200 * dpr);
    // @ts-ignore
    expect(meter._offscreenCanvas.height).toBe(400 * dpr);
  });

  it('DigitalClock should maintain logical consistency after resize', () => {
    const clock = new DigitalClock('resize-canvas');
    const ctx = clock.context;
    
    clock.scaleByHeight(50); // Shrink to half (initial is 100)
    
    // @ts-ignore
    expect(clock._scaleY).toBe(0.5);
    
    // Draw should now use the 0.5 scale
    clock.drawTime();
    
    // Verify that translate was called during drawTime
    expect(ctx.translate).toHaveBeenCalled();
    // Verify that offscreen canvas of the clock was also updated
    // @ts-ignore
    expect(clock._offscreenCanvas.height).toBe(50 * (window.devicePixelRatio || 1));
  });
});

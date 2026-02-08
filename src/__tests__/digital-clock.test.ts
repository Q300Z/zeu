import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import DigitalClock from '../digital-clock';
import { setupCanvas } from './test-helper';

describe('DigitalClock', () => {
  beforeEach(() => {
    setupCanvas('clock-canvas');
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = '';
  });

  it('should initialize and start ticking', () => {
    const clock = new DigitalClock('clock-canvas');
    // @ts-ignore
    expect(clock._timer).toBeDefined();
  });

  it('should draw segments for numbers', () => {
    const clock = new DigitalClock('clock-canvas');
    // We already have a global spy on HTMLCanvasElement.prototype.getContext
    // which returns the mockCtx from setupCanvas.
    
    // Manual draw
    clock.drawTime();
    
    // Get the context associated with the component
    const ctx = clock.context;
    expect(ctx.fillRect).toHaveBeenCalled();
  });

  it('should cleanup on destroy', () => {
    const clock = new DigitalClock('clock-canvas');
    clock.destroy();
    // @ts-ignore
    expect(clock._timer).toBeNull();
  });
});

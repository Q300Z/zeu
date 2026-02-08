import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import VolumeMeter from '../volume-meter';
import { setupCanvas } from './test-helper';

describe('VolumeMeter', () => {
  beforeEach(() => {
    setupCanvas('vol-canvas');
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should clamp values to min/max', () => {
    const meter = new VolumeMeter('vol-canvas', { 
      min: { value: 0 }, 
      max: { value: 100 } 
    });

    meter.value = 150;
    expect(meter.value).toBe(150); // actualValue keeps the raw value
    // @ts-ignore
    expect(meter._internalValue).toBe(100); // clamped internal value

    meter.value = -50;
    // @ts-ignore
    expect(meter._internalValue).toBe(0);
  });

  it('should animate towards the new value', () => {
    const meter = new VolumeMeter('vol-canvas', { value: 0 });
    meter.value = 100;
    
    // @ts-ignore
    const initialBarY = meter._barY;
    meter.drawFrame();
    // @ts-ignore
    expect(meter._barY).not.toBe(initialBarY);
  });
});

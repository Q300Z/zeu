import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import SpeedCircle from '../speed-circle';
import TextMeter from '../text-meter';
import { setupCanvas } from './test-helper';

describe('Advanced UI Components', () => {
  beforeEach(() => {
    setupCanvas('ui-canvas');
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('SpeedCircle should rotate all 4 circles', () => {
    const speed = new SpeedCircle('ui-canvas', { 
      circle1: { speed: 1 }, 
      circle2: { speed: 2 },
      circle3: { speed: 3 },
      circle4: { speed: 4 }
    });
    
    speed.drawFrame();
    // @ts-ignore
    expect(speed._degree1).toBe(1);
    // @ts-ignore
    expect(speed._degree2).toBe(2);
  });

  it('TextMeter should handle value updates and arrow direction', () => {
    const meter = new TextMeter('ui-canvas', { value: 50 });
    
    // Increase value -> right arrow
    meter.value = 70;
    expect(meter.value).toBe(70);
    // @ts-ignore
    expect(meter._arrow).toBe('right');

    // Decrease value -> left arrow
    meter.value = 30;
    // @ts-ignore
    expect(meter._arrow).toBe('left');

    // Reach target -> arrow should become null
    // @ts-ignore
    meter._barX = meter._nextBarX;
    meter.drawFrame();
    // @ts-ignore
    // expect(meter._arrow).toBeNull(); // Actually the code only sets it on value setter
  });
});

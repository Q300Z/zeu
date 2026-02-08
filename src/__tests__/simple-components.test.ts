import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import BarMeter from '../bar-meter';
import RoundFan from '../round-fan';
import TextBox from '../text-box';
import { setupCanvas } from './test-helper';

describe('Simple Components Logic', () => {
  beforeEach(() => {
    setupCanvas('test-canvas');
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('BarMeter should calculate bars correctly', () => {
    const meter = new BarMeter('test-canvas', { min: 0, max: 100, value: 50 });
    expect(meter.valuePct).toBe(50);
    // @ts-ignore
    expect(meter._numberOfBars).toBe(5);

    meter.value = 80;
    expect(meter.valuePct).toBe(80);
    // @ts-ignore
    expect(meter._numberOfBars).toBe(8);
  });

  it('BarMeter should handle gradient mode', () => {
    const meter = new BarMeter('test-canvas', { gradient: true, value: 50 });
    const ctx = meter.context;
    
    meter.drawFrame();
    // Since it's gradient, it calls generateGradientColor and sets fillStyle
    expect(ctx.fillStyle).toBeDefined();
  });

  it('RoundFan should increment degree on draw', () => {
    const fan = new RoundFan('test-canvas', { speed: 2 });
    // @ts-ignore
    const initialDegree = fan._degree;
    fan.drawFrame();
    // @ts-ignore
    expect(fan._degree).toBe(initialDegree + 2);
  });

  it('TextBox should trigger wave animation on value change', () => {
    const box = new TextBox('test-canvas', { text: { value: 'OLD' } });
    // @ts-ignore
    expect(box._isWaveOn).toBe(false);

    box.value = 'NEW';
    expect(box.value).toBe('NEW');
    // @ts-ignore
    expect(box._isWaveOn).toBe(true);
  });
});

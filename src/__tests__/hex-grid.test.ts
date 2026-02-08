import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import HexGrid from '../hex-grid';
import { setupCanvas } from './test-helper';

describe('HexGrid', () => {
  beforeEach(() => {
    setupCanvas('hex-canvas');
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should save and update hex nodes', () => {
    const grid = new HexGrid('hex-canvas');
    grid.saveHex({ id: 'h1', x: 0, y: 0, bgColor: '#ff0000' });
    
    // @ts-ignore
    expect(grid._nodes.length).toBe(1);
    // @ts-ignore
    expect(grid._nodes[0].bgColor).toBe('#ff0000');

    // Update same hex
    grid.saveHex({ id: 'h1', x: 0, y: 0, bgColor: '#0000ff' });
    // @ts-ignore
    expect(grid._nodes.length).toBe(1);
    // @ts-ignore
    expect(grid._nodes[0].bgColor).toBe('#0000ff');
  });

  it('should handle blink states', () => {
    const grid = new HexGrid('hex-canvas');
    grid.saveHex({ id: 'h1', x: 0, y: 0 });
    
    grid.blinkOn({ id: 'h1', interval: 500 });
    // @ts-ignore
    expect(grid._nodes[0].blink.on).toBe(true);

    grid.blinkOff('h1');
    // @ts-ignore
    expect(grid._nodes[0].blink.on).toBe(false);
  });

  it('should cycle through blink phases based on time', () => {
    vi.useFakeTimers();
    const grid = new HexGrid('hex-canvas');
    const spy = vi.spyOn(grid, 'drawHex');
    
    grid.saveHex({ id: 'h1', x: 0, y: 0 });
    grid.blinkOn({ id: 'h1', interval: 1000, bgColor: '#ff0000' });

    // Phase 1: Blink ON
    vi.setSystemTime(Date.now() + 500);
    grid.drawFrame(); // Might reset lastCall if it's the very first call
    grid.drawFrame(); // Second call will be within [0, interval]
    
    // Check if any drawHex call used the blink color
    const hasBlinkCallOn = spy.mock.calls.some(call => call[3] === '#ff0000');
    expect(hasBlinkCallOn).toBe(true);

    spy.mockClear();

    // Phase 2: 1000-2000ms -> Blink OFF (only standard draw)
    vi.setSystemTime(Date.now() + 1000);
    grid.drawFrame();
    // drawHex should NOT have been called with #ff0000
    const calls = spy.mock.calls;
    const hasBlinkCall = calls.some(call => call[3] === '#ff0000');
    expect(hasBlinkCall).toBe(false);

    vi.useRealTimers();
  });
});

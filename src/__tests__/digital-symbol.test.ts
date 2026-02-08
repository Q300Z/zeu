import { describe, it, expect, beforeEach } from 'vitest';
import DigitalSymbol from '../digital-symbol';
import { setupCanvas } from './test-helper';

describe('DigitalSymbol', () => {
  let ds: DigitalSymbol;
  let mockCtx: any;

  beforeEach(() => {
    const setup = setupCanvas('ds-canvas');
    mockCtx = setup.mockCtx;
    ds = new DigitalSymbol(mockCtx, 8, 50, 100, '#grey', '#red');
  });

  it('should draw all numbers from 0 to 9 to cover all switch cases', () => {
    for (let i = 0; i <= 9; i++) {
      ds.drawNumber(i);
      expect(mockCtx.fillRect).toHaveBeenCalled();
    }
  });

  it('should draw colon', () => {
    ds.drawColon();
    expect(mockCtx.fillRect).toHaveBeenCalled();
  });
});

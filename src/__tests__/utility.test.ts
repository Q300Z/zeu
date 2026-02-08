import { describe, it, expect } from 'vitest';
import Utility from '../utility';

describe('Utility', () => {
  it('should convert hex to rgb correctly', () => {
    const rgb = Utility.hexToRgb('#ff0000');
    expect(rgb).toEqual([255, 0, 0]);
  });

  it('should generate gradient colors', () => {
    const colors = Utility.generateGradientColor('#ffffff', '#000000', 3);
    expect(colors.length).toBe(3);
    expect(colors[0]).toBe('555555'); // Premier pas du dégradé (255 * 0.33)
  });

  it('should calculate next position correctly', () => {
    const pos = Utility.getNextPos(0, 100, 10);
    expect(pos).toBe(10);
    
    const finalPos = Utility.getNextPos(95, 100, 10);
    expect(finalPos).toBe(100);
  });

  it('should pad zeros correctly', () => {
    expect(Utility.leftPadZero(5)).toBe('05');
    expect(Utility.leftPadZero(12)).toBe(12);
  });

  it('should shuffle array and keep same elements', () => {
    const input = [1, 2, 3, 4, 5];
    const shuffled = Utility.shuffleArray([...input]);
    expect(shuffled.length).toBe(5);
    expect(shuffled.sort()).toEqual(input.sort());
  });

  it('should add hours correctly', () => {
    const date = new Date('2026-02-08T10:00:00');
    // Mocking current date for addHour
    vi.useFakeTimers();
    vi.setSystemTime(date);
    
    const future = Utility.addHour(2);
    expect(future.getHours()).toBe(12);
    
    vi.useRealTimers();
  });

  it('should calculate angles correctly', () => {
    // 90 degrees = PI / 2
    expect(Utility.getAngleByDegree(90)).toBeCloseTo(Math.PI / 2);
    
    // getNextAngleByDegree
    expect(Utility.getNextAngleByDegree(350, 5)).toBe(355);
    expect(Utility.getNextAngleByDegree(360, 5)).toBe(0);
    expect(Utility.getNextAngleByDegree(370, 5)).toBe(0);

    // getAngleByDate
    const date = new Date();
    date.setSeconds(3); // 3s at speed 1 = 0.5 * PI (90 degrees approx)
    date.setMilliseconds(0);
    const angle = Utility.getAngleByDate(1, date);
    expect(angle).toBeCloseTo(Math.PI / 2);
  });

  it('should convert hex to rgba with opacity', () => {
    const rgba = Utility.hexToRgba('#ff0000', 50);
    expect(rgba).toBe('rgba(255,0,0,0.5)');
  });

  it('should prepare canvas for HiDPI', () => {
    const canvas = document.createElement('canvas');
    const ctx = { scale: vi.fn() } as any;
    
    // Mock devicePixelRatio
    const originalDPR = window.devicePixelRatio;
    Object.defineProperty(window, 'devicePixelRatio', { value: 2, configurable: true });
    
    // Mock getBoundingClientRect
    vi.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({
      width: 100,
      height: 100
    } as any);

    Utility.prepareCanvas(canvas, ctx);
    
    expect(canvas.width).toBe(200);
    expect(canvas.height).toBe(200);
    expect(ctx.scale).toHaveBeenCalledWith(2, 2);

    Object.defineProperty(window, 'devicePixelRatio', { value: originalDPR, configurable: true });
  });
});

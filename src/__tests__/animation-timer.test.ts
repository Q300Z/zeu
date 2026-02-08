import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import AnimationTimer from '../animation-timer';
import { GLOBAL } from '../global';

describe('AnimationTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Mock requestAnimationFrame to just call the callback
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      // In tests, we don't want it to run indefinitely on its own
      return 0;
    });
    // Clear the animation array
    GLOBAL.requestAnimationFrameArray = [];
    AnimationTimer.setFps(60);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should call drawFrame for registered components', () => {
    const mockComponent = {
      drawFrame: vi.fn(),
    };
    
    GLOBAL.requestAnimationFrameArray.push({
      func: mockComponent.drawFrame,
      self: mockComponent
    });

    // We need to simulate time passing because of FPS control
    // Default is 60fps, so interval is ~16.6ms
    vi.setSystemTime(Date.now() + 20);
    
    AnimationTimer.render();

    expect(mockComponent.drawFrame).toHaveBeenCalled();
  });

  it('should respect FPS limit', () => {
    const mockComponent = {
      drawFrame: vi.fn(),
    };
    
    GLOBAL.requestAnimationFrameArray.push({
      func: mockComponent.drawFrame,
      self: mockComponent
    });

    AnimationTimer.setFps(10); // 100ms interval
    
    // Call render immediately - might call once depending on lastFrame init
    AnimationTimer.render();
    const initialCalls = mockComponent.drawFrame.mock.calls.length;

    // Advance by 50ms - should NOT call again
    vi.advanceTimersByTime(50);
    vi.setSystemTime(Date.now() + 50);
    AnimationTimer.render();
    expect(mockComponent.drawFrame).toHaveBeenCalledTimes(initialCalls);

    // Advance by another 60ms (total 110ms) - should call
    vi.advanceTimersByTime(60);
    vi.setSystemTime(Date.now() + 60);
    AnimationTimer.render();
    expect(mockComponent.drawFrame).toHaveBeenCalledTimes(initialCalls + 1);
  });

  it('should update FPS interval when setFps is called', () => {
    // @ts-ignore - Accessing private for verification
    expect(AnimationTimer._fps).toBe(60);
    
    AnimationTimer.setFps(30);
    
    // @ts-ignore
    expect(AnimationTimer._fps).toBe(30);
    // @ts-ignore
    expect(AnimationTimer._fpsInterval).toBe(1000 / 30);
  });
});

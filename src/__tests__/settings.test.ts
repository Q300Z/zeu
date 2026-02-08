import { describe, it, expect, vi } from 'vitest';
import Settings from '../settings';
import AnimationTimer from '../animation-timer';

describe('Settings', () => {
  it('should update AnimationTimer when FPS changes', () => {
    const spy = vi.spyOn(AnimationTimer, 'setFps');
    Settings.fps = 30;
    
    expect(Settings.fps).toBe(30);
    expect(spy).toHaveBeenCalledWith(30);
  });
});

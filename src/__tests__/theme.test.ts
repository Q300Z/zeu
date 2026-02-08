import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ThemeManager, DefaultTheme, ColorTheme } from '../theme';
import BaseComponent from '../base-component';
import { setupCanvas } from './test-helper';

describe('Theme System', () => {
  beforeEach(() => {
    setupCanvas('theme-canvas');
    // Reset to default theme
    ThemeManager.getInstance().theme = { ...DefaultTheme };
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should provide default theme to new components', () => {
    const comp = new BaseComponent('theme-canvas', {}, 100, 100);
    expect(comp.theme.red).toBe(DefaultTheme.red);
  });

  it('should reflect theme changes in existing components', () => {
    const comp = new BaseComponent('theme-canvas', {}, 100, 100);
    
    // Change theme globally
    const customRed = '#123456';
    ThemeManager.getInstance().theme.red = customRed;
    
    // Check if component sees the change
    expect(comp.theme.red).toBe(customRed);
  });

  it('should handle full theme replacement', () => {
    const comp = new BaseComponent('theme-canvas', {}, 100, 100);
    
    const newTheme: ColorTheme = {
      ...DefaultTheme,
      black: '#333333'
    };
    
    // If we replace the whole object, the component might still point to the old one
    ThemeManager.getInstance().theme = newTheme;
    
    // This will likely fail if comp.theme was assigned by reference in constructor
    // but the reference in ThemeManager was replaced.
    // However, if comp.theme is a getter, it will work.
    expect(comp.theme.black).toBe('#333333');
  });
});

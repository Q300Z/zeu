import { ThemeManager, ColorTheme } from './theme';

export const COLOR = new Proxy({} as ColorTheme, {
  get: (_target, prop: keyof ColorTheme) => {
    return ThemeManager.getInstance().theme[prop];
  }
});

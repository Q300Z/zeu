export interface ColorTheme {
  lightGreen: string;
  lightWhite: string;
  lightGrey: string;
  lightBlack: string;
  black: string;
  white: string;
  red: string;
  blue: string;
  yellow: string;
  cyan: string;
  grey: string;
  green: string;
  orange: string;
  transparent: string;
}

export const DefaultTheme: ColorTheme = {
  lightGreen: '#00d7af',
  lightWhite: '#f8f8ff',
  lightGrey: '#e0e0e0',
  lightBlack: '#343a42',
  black: '#000000',
  white: '#ffffff',
  red: '#dc3547',
  blue: '#007bfb',
  yellow: '#ffc108',
  cyan: '#17a2b9',
  grey: '#6c757e',
  green: '#28a748',
  orange: '#ffa500',
  transparent: 'rgba(255, 255, 255, 0)'
};

export class ThemeManager {
  private static _instance: ThemeManager;
  private _theme: ColorTheme;
  private _listeners: (() => void)[] = [];

  private constructor() {
    this._theme = DefaultTheme;
  }

  public static getInstance(): ThemeManager {
    if (!ThemeManager._instance) {
      ThemeManager._instance = new ThemeManager();
    }
    return ThemeManager._instance;
  }

  get theme(): ColorTheme {
    return this._theme;
  }

  set theme(newTheme: ColorTheme) {
    this._theme = newTheme;
    this.notify();
  }

  public subscribe(listener: () => void) {
    this._listeners.push(listener);
  }

  public unsubscribe(listener: () => void) {
    this._listeners = this._listeners.filter(l => l !== listener);
  }

  get listenerCount(): number {
    return this._listeners.length;
  }

  private notify() {
    this._listeners.forEach(listener => listener());
  }
}

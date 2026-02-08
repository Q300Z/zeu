import AnimationTimer from './animation-timer';

class Settings {
  public _fps: number;

  constructor() {
    this._fps = 60;
  }

  set fps(fps: number) {
    this._fps = fps;
    AnimationTimer.setFps(fps);
  }

  get fps(): number {
    return this._fps;
  }
}

export default new Settings();

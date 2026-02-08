import { GLOBAL } from './global';

// Augment window interface
declare global {
  interface Window {
    requestAnimFrame: (callback: FrameRequestCallback) => number;
    webkitRequestAnimationFrame: (callback: FrameRequestCallback) => number;
    mozRequestAnimationFrame: (callback: FrameRequestCallback) => number;
    oRequestAnimationFrame: (callback: FrameRequestCallback) => number;
    msRequestAnimationFrame: (callback: FrameRequestCallback) => number;
  }
}

class AnimationTimer {
  private _fps: number;
  private _fpsInterval: number;
  private _lastFrame: number;

  constructor() {
    // Bind the render function.
    this.render = this.render.bind(this);

    // Animation parameters.
    this._fps = 60;
    this._fpsInterval = 1000 / this._fps;
    this._lastFrame = Date.now();

    // Cross browser.
    if (!window.requestAnimationFrame) {
      window.requestAnimFrame = () => {
        return window.webkitRequestAnimationFrame(this.render) ||
                window.mozRequestAnimationFrame(this.render) ||
                window.oRequestAnimationFrame(this.render) ||
                window.msRequestAnimationFrame(this.render);
      };
    }
  }

  render() {
    // FPS control
    const now = Date.now();
    const elapsed = now - this._lastFrame;

    if (elapsed > this._fpsInterval) {
      this._lastFrame = now - (elapsed % this._fpsInterval);

      // Draw
      for (let i = 0; i < GLOBAL.requestAnimationFrameArray.length; i++) {
        const drawFrameObj = GLOBAL.requestAnimationFrameArray[i];

        drawFrameObj.func.call(drawFrameObj.self);
      }
    }

    window.requestAnimationFrame(this.render);
  }

  setFps(fps: number) {
    this._fps = fps;
    this._fpsInterval = 1000 / this._fps;
  }
}

export default new AnimationTimer();

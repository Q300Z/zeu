export interface DrawFrameObject {
  func: () => void;
  self: unknown; // Ideally this should be BaseComponent type
}

export interface GlobalState {
  requestAnimationFrameArray: DrawFrameObject[];
}

const GLOBAL: GlobalState = {
  requestAnimationFrameArray: []
};

export { GLOBAL };

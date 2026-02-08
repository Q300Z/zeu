import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { setupCanvas } from './test-helper';
import { ThemeManager } from '../theme';
import { GLOBAL } from '../global';

// Import all components
import BarMeter from '../bar-meter';
import DigitalClock from '../digital-clock';
import Heartbeat from '../heartbeat';
import MessageQueue from '../message-queue';
import SpeedCircle from '../speed-circle';
import TextMeter from '../text-meter';
import RoundFan from '../round-fan';
import TextBox from '../text-box';
import NetworkGraph from '../network-graph';
import HexGrid from '../hex-grid';
import ScoreBoard from '../score-board';
import VolumeMeter from '../volume-meter';

const components = [
  { name: 'BarMeter', Class: BarMeter },
  { name: 'DigitalClock', Class: DigitalClock },
  { name: 'Heartbeat', Class: Heartbeat },
  { name: 'MessageQueue', Class: MessageQueue },
  { name: 'SpeedCircle', Class: SpeedCircle },
  { name: 'TextMeter', Class: TextMeter },
  { name: 'RoundFan', Class: RoundFan },
  { name: 'TextBox', Class: TextBox },
  { name: 'NetworkGraph', Class: NetworkGraph },
  { name: 'HexGrid', Class: HexGrid },
  { name: 'ScoreBoard', Class: ScoreBoard },
  { name: 'VolumeMeter', Class: VolumeMeter }
];

describe('Memory Cleanup (destroy)', () => {
  beforeEach(() => {
    setupCanvas('cleanup-canvas');
    GLOBAL.requestAnimationFrameArray = [];
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  components.forEach(({ name, Class }) => {
    it(`should cleanup ${name} correctly`, () => {
      const initialListeners = ThemeManager.getInstance().listenerCount;
      const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
      
      // We don't necessarily need fake timers here if we just want to spy on the call
      const instance = new (Class as any)('cleanup-canvas');
      
      // 1. Verify AnimationTimer registration
      expect(GLOBAL.requestAnimationFrameArray.length).toBe(1);
      
      // 2. Verify Theme subscription
      expect(ThemeManager.getInstance().listenerCount).toBe(initialListeners + 1);
      
      // 3. Destroy
      instance.destroy();
      
      // Verify removal from AnimationTimer
      expect(GLOBAL.requestAnimationFrameArray.length).toBe(0);
      
      // Verify unsubscription from ThemeManager
      expect(ThemeManager.getInstance().listenerCount).toBe(initialListeners);
      
      // Verify clearInterval if it was a component with timer (DigitalClock, Heartbeat)
      if (name === 'DigitalClock' || name === 'Heartbeat') {
        expect((instance as any)._timer).toBeNull();
      }
      
      clearIntervalSpy.mockRestore();
    });
  });
});

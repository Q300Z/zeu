import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import MessageQueue from '../message-queue';
import { setupCanvas } from './test-helper';

describe('MessageQueue', () => {
  beforeEach(() => {
    setupCanvas('msg-canvas');
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should push and pop messages', () => {
    const queue = new MessageQueue('msg-canvas');
    queue.push({ color: '#ff0000' });
    expect(queue.queueSize).toBe(1);

    queue.pop();
    expect(queue.queueSize).toBe(0);
  });

  it('should respect max capacity', () => {
    const queue = new MessageQueue('msg-canvas', { maxQueueCapacity: 2 });
    queue.push({ color: '1' });
    queue.push({ color: '2' });
    queue.push({ color: '3' });

    expect(queue.queueSize).toBe(2);
  });

  it('should animate messages moving up', () => {
    const queue = new MessageQueue('msg-canvas', { speed: 10, barHeight: 20, space: 5 });
    queue.push({ color: '#ff0000' });
    
    // @ts-ignore
    const initialY = queue._queue[0].y;
    // Expected target Y for index 0 is space (5)
    expect(initialY).toBeGreaterThan(5);

    queue.drawFrame();
    // @ts-ignore
    expect(queue._queue[0].y).toBe(initialY - 10);

    // Run enough frames to reach target
    for(let i = 0; i < 30; i++) queue.drawFrame();
    // @ts-ignore
    expect(queue._queue[0].y).toBeLessThanOrEqual(5);
  });
});

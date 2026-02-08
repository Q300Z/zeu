import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import ScoreBoard from '../score-board';
import { setupCanvas } from './test-helper';

describe('ScoreBoard', () => {
  beforeEach(() => {
    setupCanvas('score-canvas');
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should add rows and sort them', () => {
    const board = new ScoreBoard('score-canvas', { order: 'desc' });
    board.add({ id: 'p1', score: 10 });
    board.add({ id: 'p2', score: 50 });
    board.add({ id: 'p3', score: 30 });

    expect(board.rows.length).toBe(3);
    expect(board.rows[0].id).toBe('p2'); // Highest score first
    expect(board.rows[2].id).toBe('p1'); // Lowest score last
  });

  it('should update existing rows', () => {
    const board = new ScoreBoard('score-canvas');
    board.add({ id: 'p1', score: 10 });
    board.update({ id: 'p1', score: 100 });

    expect(board.rows[0].score).toBe(100);
  });

  it('should handle removal animation state and actual deletion', () => {
    const board = new ScoreBoard('score-canvas', { speed: 100 }); // High speed for fast test
    board.add({ id: 'p1', score: 10 });
    board.remove('p1');

    expect(board.rows[0].moveType).toBe('remove');
    
    // Simulate frames to finish removal animation
    // Row moves to destX (-40), then to viewWidth + 10
    for(let i = 0; i < 10; i++) board.drawFrame();
    
    expect(board.rows.length).toBe(0);
  });
});

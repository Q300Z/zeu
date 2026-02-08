import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import NetworkGraph from '../network-graph';
import { setupCanvas } from './test-helper';

describe('NetworkGraph', () => {
  beforeEach(() => {
    setupCanvas('graph-canvas');
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should add nodes and retrieve them', () => {
    const graph = new NetworkGraph('graph-canvas');
    graph.addNodes([
      { id: 'a', x: 10, y: 10, size: 5, color: '#ff0000' },
      { id: 'b', x: 50, y: 50, size: 5, color: '#00ff00' }
    ]);

    expect(graph.nodes.length).toBe(2);
    expect(graph.getNodeById('a')).toBeDefined();
    expect(graph.getNodeById('c')).toBeUndefined();
  });

  it('should add neighbors correctly', () => {
    const graph = new NetworkGraph('graph-canvas');
    graph.addNodes([{ id: 'a', x: 10, y: 10, size: 5, color: '#ff0000' }]);
    
    graph.addNeighbor('a', { id: 'b', edge: { width: 2 } });
    
    const nodeA = graph.getNodeById('a');
    expect(nodeA?.neighbors?.length).toBe(1);
    expect(nodeA?.neighbors?.[0].id).toBe('b');
  });

  it('should manage signals in queue', () => {
    const graph = new NetworkGraph('graph-canvas');
    graph.addNodes([
      { id: 'a', x: 0, y: 0, size: 5, color: '#ff0000' },
      { id: 'b', x: 10, y: 0, size: 5, color: '#00ff00' }
    ]);

    // Speed will be 10 / (60/60) = 6 per frame approx if duration is 60ms
    graph.signal({ from: 'a', to: 'b', duration: 60 });
    
    // @ts-ignore
    expect(graph._signalQueues.length).toBe(1);

    graph.drawFrame(); // x becomes speed
    graph.drawFrame(); // x becomes 10 (dest)
    graph.drawFrame(); // should be removed

    // @ts-ignore
    expect(graph._signalQueues.length).toBe(0);
  });

  it('should handle signals between non-existent nodes gracefully', () => {
    const graph = new NetworkGraph('graph-canvas');
    // Should not throw or add anything
    expect(() => graph.signal({ from: 'x', to: 'y' })).not.toThrow();
    // @ts-ignore
    expect(graph._signalQueues.length).toBe(0);
  });
});

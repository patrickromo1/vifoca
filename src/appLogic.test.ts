import { describe, expect, it } from 'vitest';

import {
  DEMO_PIN,
  isValidPin,
  parseLibrary,
  serializeLibrary,
  type VideoItem,
} from './appLogic';

describe('library persistence', () => {
  it('serializes and restores videos', () => {
    const videos: VideoItem[] = [
      { id: 'video-1', name: 'Birds.mp4', uri: 'file:///birds.mp4' },
    ];

    expect(parseLibrary(serializeLibrary(videos))).toEqual(videos);
  });

  it('serializes and restores an empty library', () => {
    expect(parseLibrary(serializeLibrary([]))).toEqual([]);
  });

  it('throws for malformed persisted JSON', () => {
    expect(() => parseLibrary('{not-json')).toThrow();
  });
});

describe('PIN validation', () => {
  it('accepts the demo PIN', () => {
    expect(isValidPin(DEMO_PIN)).toBe(true);
  });

  it.each(['', '246', '24680', 'abcd'])('rejects %j', (value) => {
    expect(isValidPin(value)).toBe(false);
  });
});

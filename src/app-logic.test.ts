import { describe, expect, it } from 'vitest';

import {
  parseLibrary,
  serializeLibrary,
  type VideoItem,
} from './app-logic';

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

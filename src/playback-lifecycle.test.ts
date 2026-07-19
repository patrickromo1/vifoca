import { describe, expect, it } from 'vitest';

import { isLeavingForeground, isReturningToForeground } from './playback-lifecycle';

describe('playback lifecycle', () => {
  it.each(['inactive', 'background'])('captures playback when moving from active to %s', (nextAppState) => {
    expect(isLeavingForeground('active', nextAppState)).toBe(true);
  });

  it('does not capture playback for state changes outside the foreground', () => {
    expect(isLeavingForeground('inactive', 'background')).toBe(false);
  });

  it.each(['inactive', 'background'])('restores playback when returning from %s to active', (previousAppState) => {
    expect(isReturningToForeground(previousAppState, 'active')).toBe(true);
  });

  it('does not restore playback if the app stays active', () => {
    expect(isReturningToForeground('active', 'active')).toBe(false);
  });
});

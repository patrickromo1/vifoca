export function isLeavingForeground(previousAppState: string, nextAppState: string): boolean {
  return previousAppState === 'active' && nextAppState !== 'active';
}

export function isReturningToForeground(previousAppState: string, nextAppState: string): boolean {
  return previousAppState !== 'active' && nextAppState === 'active';
}

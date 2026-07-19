export type VideoItem = { id: string; name: string; uri: string };

export const DEMO_PIN = '2468';

export function serializeLibrary(videos: VideoItem[]): string {
  return JSON.stringify(videos);
}

export function parseLibrary(value: string): VideoItem[] {
  return JSON.parse(value) as VideoItem[];
}

export function isValidPin(value: string): boolean {
  return value === DEMO_PIN;
}

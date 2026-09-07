export type VideoItem = { id: string; name: string; uri: string };

export function serializeLibrary(videos: VideoItem[]): string {
  return JSON.stringify(videos);
}

export function parseLibrary(value: string): VideoItem[] {
  return JSON.parse(value) as VideoItem[];
}

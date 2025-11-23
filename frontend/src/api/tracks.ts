// src/api/tracks.ts
import apiFetch from "./client";
import type { Track, TrackCreate } from "./types";

export function getTracks() {
  return apiFetch<Track[]>("/tracks/");
}

export function createTrack(data: TrackCreate) {
  return apiFetch<Track>("/tracks/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export type WaveLayer = {
  baseline: number;
  amplitude: number;
  phase: number;
  speed: number;
};

export const waveViewBox: { width: number; height: number };
export const waveLayers: WaveLayer[];
export function wavePoint(layer: WaveLayer, x: number, time: number): { y: number; slope: number };
export function createWavePaths(layer: WaveLayer, time: number): { crest: string; body: string };

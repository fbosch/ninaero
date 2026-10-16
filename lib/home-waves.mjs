const tau = Math.PI * 2;

export const waveViewBox = { width: 1600, height: 900 };

export const waveLayers = [
  { baseline: 0.69, amplitude: 0.035, phase: 0, speed: 0.43 },
  { baseline: 0.705, amplitude: 0.05, phase: 2.1, speed: 0.36 },
  { baseline: 0.72, amplitude: 0.04, phase: 4.2, speed: 0.49 },
];

export function wavePoint(layer, x, time) {
  const travel = tau * x * 0.72 - time * layer.speed + layer.phase;
  const swell = tau * x * 1.15 + time * 0.16 + layer.phase * 0.6;
  const amplitude = 0.65 + 0.35 * Math.sin(time * 0.22 + layer.phase);

  return {
    y: layer.baseline + layer.amplitude * (Math.sin(travel) * amplitude + 0.22 * Math.sin(swell)),
    slope:
      layer.amplitude *
      (tau * 0.72 * Math.cos(travel) * amplitude + 0.22 * tau * 1.15 * Math.cos(swell)),
  };
}

export function createWavePaths(layer, time) {
  const { width, height } = waveViewBox;
  const start = -0.05;
  const end = 1.05;
  const segments = 12;
  const step = (end - start) / segments;
  const point = (x, y) => `${(x * width).toFixed(2)} ${(y * height).toFixed(2)}`;
  let previous = wavePoint(layer, start, time);
  let crest = `M ${point(start, previous.y)}`;

  // Hermite tangents keep adjoining cubic segments smooth as the profile deforms.
  for (let index = 1; index <= segments; index++) {
    const x = start + step * index;
    const current = wavePoint(layer, x, time);
    crest += ` C ${point(x - (step * 2) / 3, previous.y + (previous.slope * step) / 3)} ${point(x - step / 3, current.y - (current.slope * step) / 3)} ${point(x, current.y)}`;
    previous = current;
  }

  return {
    crest,
    body: `${crest} L ${point(end, 1.05)} L ${point(start, 1.05)} Z`,
  };
}

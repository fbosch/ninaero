export const bubbleGap = 8;
export const maxBubbles = 24;
export const maxBubbleRadius = 96;
const ambientSpeed = 18;

export function createBubbles(width, height, random = Math.random) {
  if (width < 80 || height < 80) return [];
  const count = Math.min(8, Math.max(2, Math.round(width / 280)));
  const scale = Math.min(1, Math.max(0.5, width / 900), width / 300, height / 300);
  const radii = Array.from(
    { length: count },
    (_, i) => (32 + ((i + random()) / count) * 56) * scale,
  ).sort((a, b) => b - a);
  const bubbles = [];
  for (const radius of radii) {
    let best = null;
    let bestClearance = -Infinity;
    for (let attempt = 0; attempt < 64; attempt++) {
      const x = radius + random() * (width - radius * 2);
      const y = radius + random() * (height - radius * 2);
      const clearance = Math.min(
        ...bubbles.map((b) => Math.hypot(x - b.x, y - b.y) - radius - b.radius),
      );
      if (clearance >= bubbleGap && clearance > bestClearance) {
        best = { x, y };
        bestClearance = clearance;
      }
    }
    if (!best) continue;
    const angle = random() * Math.PI * 2;
    const speed = ambientSpeed * (0.5 + random() * 0.5);
    bubbles.push({
      ...best,
      radius,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
    });
  }
  return bubbles;
}
function availableRadius(bubbles, width, height, x, y, exclude) {
  return Math.min(
    x,
    y,
    width - x,
    height - y,
    ...bubbles
      .filter((b) => b !== exclude)
      .map((b) => Math.hypot(x - b.x, y - b.y) - b.radius - bubbleGap),
  );
}

export function spawnBubble(bubbles, width, height, x, y) {
  if (bubbles.length >= maxBubbles || availableRadius(bubbles, width, height, x, y) < 8)
    return null;
  const bubble = { x, y, radius: 8, vx: 0, vy: 0, held: true };
  bubbles.push(bubble);
  return bubble;
}

export function growBubble(bubble, bubbles, width, height, elapsed) {
  const room = availableRadius(bubbles, width, height, bubble.x, bubble.y, bubble);
  bubble.radius = Math.max(
    bubble.radius,
    Math.min(maxBubbleRadius, room, bubble.radius + Math.max(0, elapsed) * 44),
  );
}

export const maxThrowSpeed = 320;
const restitution = 0.08;

export function releaseBubble(bubble, velocity = { vx: 0, vy: -14 }) {
  bubble.held = false;
  const speed = Math.hypot(velocity.vx, velocity.vy);
  const scale = speed > maxThrowSpeed ? maxThrowSpeed / speed : 1;
  bubble.vx = velocity.vx * scale;
  bubble.vy = velocity.vy * scale;
}

function contactTime(dx, dy, vx, vy, radius) {
  const closing = dx * vx + dy * vy;
  const speedSquared = vx * vx + vy * vy;
  if (closing >= -1e-9 || speedSquared === 0) return Infinity;
  const distance = Math.max(0, dx * dx + dy * dy - radius * radius);
  const discriminant = closing * closing - speedSquared * distance;
  if (discriminant < 0) return Infinity;
  return distance / (-closing + Math.sqrt(discriminant));
}

export function dragBubble(bubble, bubbles, width, height, x, y, elapsed) {
  const dt = Math.min(Math.max(elapsed, 0), 0.05);
  if (!dt) return { dx: 0, dy: 0 };
  const targetX = Math.max(bubble.radius, Math.min(width - bubble.radius, x));
  const targetY = Math.max(bubble.radius, Math.min(height - bubble.radius, y));
  const frequency = 20 / (1 + (bubble.radius / 32) ** 1.6);
  const decay = Math.exp(-frequency * dt);
  const errorX = bubble.x - targetX;
  const errorY = bubble.y - targetY;
  const springX = (bubble.dragVX ?? 0) + frequency * errorX;
  const springY = (bubble.dragVY ?? 0) + frequency * errorY;
  // Exact critically damped response for a stationary pointer target during this step.
  let dx = targetX + (errorX + springX * dt) * decay - bubble.x;
  let dy = targetY + (errorY + springY * dt) * decay - bubble.y;
  let vx = ((bubble.dragVX ?? 0) - frequency * springX * dt) * decay;
  let vy = ((bubble.dragVY ?? 0) - frequency * springY * dt) * decay;
  const speedLimit = 520 / (1 + bubble.radius / 64);
  const travelScale = Math.min(1, (speedLimit * dt) / (Math.hypot(dx, dy) || 1));
  dx *= travelScale;
  dy *= travelScale;
  const velocityScale = Math.min(1, speedLimit / (Math.hypot(vx, vy) || 1));
  vx *= velocityScale;
  vy *= velocityScale;
  const boundedX = Math.max(bubble.radius, Math.min(width - bubble.radius, bubble.x + dx));
  const boundedY = Math.max(bubble.radius, Math.min(height - bubble.radius, bubble.y + dy));
  if (boundedX !== bubble.x + dx) vx = 0;
  if (boundedY !== bubble.y + dy) vy = 0;
  dx = boundedX - bubble.x;
  dy = boundedY - bubble.y;

  let fraction = 1;
  for (const other of bubbles) {
    if (other === bubble) continue;
    fraction = Math.min(
      fraction,
      contactTime(other.x - bubble.x, other.y - bubble.y, -dx, -dy, bubble.radius + other.radius),
    );
  }
  // Stop just short of contact and discard blocked spring velocity rather than storing a launch impulse.
  if (fraction < 1) {
    fraction = Math.max(0, fraction - 1e-6);
    vx = 0;
    vy = 0;
  }
  bubble.dragVX = vx;
  bubble.dragVY = vy;
  bubble.x += dx * fraction;
  bubble.y += dy * fraction;
  return { dx: dx * fraction, dy: dy * fraction };
}

export function resizeBubbles(bubbles, width, height) {
  if (width <= 0 || height <= 0) return [];
  const inside = (bubble) =>
    bubble.x >= bubble.radius &&
    bubble.x <= width - bubble.radius &&
    bubble.y >= bubble.radius &&
    bubble.y <= height - bubble.radius;
  const placed = bubbles.filter(inside);
  const displaced = bubbles.filter((bubble) => !inside(bubble)).sort((a, b) => b.radius - a.radius);
  const popped = [];
  for (const bubble of displaced) {
    const radius = bubble.radius;
    if (radius * 2 > width || radius * 2 > height) {
      popped.push(bubble);
      continue;
    }
    const fits = (x, y) =>
      x >= radius &&
      x <= width - radius &&
      y >= radius &&
      y <= height - radius &&
      placed.every((other) => Math.hypot(x - other.x, y - other.y) >= radius + other.radius + 1);
    let best = null;
    let cost = Infinity;
    const consider = (x, y) => {
      const distance = (x - bubble.x) ** 2 + (y - bubble.y) ** 2;
      if (distance < cost && fits(x, y)) {
        best = { x, y };
        cost = distance;
      }
    };
    consider(
      Math.max(radius, Math.min(width - radius, bubble.x)),
      Math.max(radius, Math.min(height - radius, bubble.y)),
    );
    if (!best) {
      for (const other of placed) {
        for (let i = 0; i < 32; i++) {
          const angle = (i * Math.PI) / 16;
          const separation = radius + other.radius + 1.01;
          consider(other.x + Math.cos(angle) * separation, other.y + Math.sin(angle) * separation);
        }
      }
      const step = Math.max(16, radius);
      for (let y = radius; y <= height - radius; y += step) {
        for (let x = radius; x <= width - radius; x += step) consider(x, y);
      }
    }
    if (best) {
      Object.assign(bubble, best);
      placed.push(bubble);
    } else {
      popped.push(bubble);
    }
  }
  const removed = new Set(popped);
  bubbles.splice(0, bubbles.length, ...bubbles.filter((bubble) => !removed.has(bubble)));
  return popped;
}

export function updateBubbleWarp(bubble, vx, vy, elapsed) {
  const speed = Math.hypot(vx, vy);
  const amount = Math.min(0.18, (speed / 220) * 0.18);
  // A double-angle vector interpolates ellipse orientation without 180-degree flips.
  const targetX = speed ? (amount * (vx * vx - vy * vy)) / (speed * speed) : 0;
  const targetY = speed ? (amount * 2 * vx * vy) / (speed * speed) : 0;
  let remaining = Math.min(Math.max(elapsed, 0), 0.05);
  while (remaining > 1e-9) {
    const dt = Math.min(remaining, 1 / 120);
    remaining -= dt;
    bubble.warpVX =
      (bubble.warpVX ?? 0) +
      (70 * (targetX - (bubble.warpX ?? 0)) - 12 * (bubble.warpVX ?? 0)) * dt;
    bubble.warpVY =
      (bubble.warpVY ?? 0) +
      (70 * (targetY - (bubble.warpY ?? 0)) - 12 * (bubble.warpVY ?? 0)) * dt;
    bubble.warpX = (bubble.warpX ?? 0) + bubble.warpVX * dt;
    bubble.warpY = (bubble.warpY ?? 0) + bubble.warpVY * dt;
  }
}

export function bubbleShape(bubble) {
  const x = bubble.warpX ?? 0;
  const y = bubble.warpY ?? 0;
  return {
    angle: Math.atan2(y, x) / 2,
    scaleX: 1,
    // Keep the entire ellipse inside the collision circle, including spring overshoot.
    scaleY: 1 - Math.min(0.2, Math.hypot(x, y)),
  };
}

function compressBubble(bubble, nx, ny, speed) {
  const impulse = Math.min(0.9, speed / 150);
  bubble.warpVX = (bubble.warpVX ?? 0) - (nx * nx - ny * ny) * impulse;
  bubble.warpVY = (bubble.warpVY ?? 0) - 2 * nx * ny * impulse;
}

function advanceBubbles(bubbles, width, height, elapsed) {
  let remaining = elapsed;
  // Bound pathological simultaneous contacts without advancing through an unresolved collision.
  for (let iteration = 0; remaining > 1e-9 && iteration < 128; iteration++) {
    let soonest = remaining;
    let contact = null;
    for (let i = 0; i < bubbles.length; i++) {
      const a = bubbles[i];
      if (!a.held) {
        const xTime = a.vx
          ? Math.max(0, ((a.vx < 0 ? a.radius : width - a.radius) - a.x) / a.vx)
          : Infinity;
        if (xTime <= soonest) {
          soonest = xTime;
          contact = { a, velocity: "vx" };
        }
        const yTime = a.vy
          ? Math.max(0, ((a.vy < 0 ? a.radius : height - a.radius) - a.y) / a.vy)
          : Infinity;
        if (yTime <= soonest) {
          soonest = yTime;
          contact = { a, velocity: "vy" };
        }
      }
      for (let j = i + 1; j < bubbles.length; j++) {
        const b = bubbles[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const vx = (b.held ? 0 : b.vx) - (a.held ? 0 : a.vx);
        const vy = (b.held ? 0 : b.vy) - (a.held ? 0 : a.vy);
        const radius = a.radius + b.radius;
        // Conservative swept bounds reject distant pairs before solving the contact quadratic.
        if (
          Math.abs(dx) > radius + Math.abs(vx) * soonest + 1e-9 ||
          Math.abs(dy) > radius + Math.abs(vy) * soonest + 1e-9
        )
          continue;
        const time = contactTime(dx, dy, vx, vy, radius);
        if (time <= soonest) {
          soonest = time;
          contact = { a, b };
        }
      }
    }
    for (const bubble of bubbles) {
      if (bubble.held) continue;
      bubble.x = Math.max(
        bubble.radius,
        Math.min(width - bubble.radius, bubble.x + bubble.vx * soonest),
      );
      bubble.y = Math.max(
        bubble.radius,
        Math.min(height - bubble.radius, bubble.y + bubble.vy * soonest),
      );
    }
    remaining -= soonest;
    if (!contact) break;
    const { a, b, velocity } = contact;
    if (velocity) {
      compressBubble(
        a,
        velocity === "vx" ? 1 : 0,
        velocity === "vy" ? 1 : 0,
        Math.abs(a[velocity]),
      );
      a[velocity] *= -restitution;
      continue;
    }
    const distance = Math.hypot(b.x - a.x, b.y - a.y);
    const nx = distance ? (b.x - a.x) / distance : 1;
    const ny = distance ? (b.y - a.y) / distance : 0;
    const closingSpeed = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
    compressBubble(a, nx, ny, closingSpeed);
    compressBubble(b, nx, ny, closingSpeed);
    const inverseMassA = a.held ? 0 : 1 / a.radius ** 2;
    const inverseMassB = b.held ? 0 : 1 / b.radius ** 2;
    const impulse = ((1 + restitution) * closingSpeed) / (inverseMassA + inverseMassB);
    a.vx -= impulse * inverseMassA * nx;
    a.vy -= impulse * inverseMassA * ny;
    b.vx += impulse * inverseMassB * nx;
    b.vy += impulse * inverseMassB * ny;
  }
}

function sampleCurrent(x, y, width, height, a, b, strength) {
  if (width <= 0 || height <= 0) return { vx: 0, vy: 0 };
  const u = (Math.PI * x) / width;
  const v = (Math.PI * y) / height;
  const sinU = Math.sin(u);
  const cosU = Math.cos(u);
  const sinV = Math.sin(v);
  const cosV = Math.cos(v);
  // Derivatives of one shared streamfunction: circulation without a vertical bias or a sink.
  return {
    vx:
      (strength / height) *
      (sinU * cosV + a * Math.sin(2 * u) * cosV + 2 * b * sinU * Math.cos(2 * v)),
    vy:
      (-strength / width) *
      (cosU * sinV + 2 * a * Math.cos(2 * u) * sinV + b * cosU * Math.sin(2 * v)),
  };
}

export function bubbleCurrent(x, y, width, height, time) {
  return sampleCurrent(
    x,
    y,
    width,
    height,
    0.32 * Math.sin(time * 0.11),
    0.28 * Math.cos(time * 0.09),
    ambientSpeed * Math.min(width, height),
  );
}

function coverageField(bubbles, width, height) {
  const cells = Array.from({ length: 12 }, (_, i) => ({
    x: (((i % 4) + 0.5) * width) / 4,
    y: ((Math.floor(i / 4) + 0.5) * height) / 3,
    density: 0,
  }));
  for (const bubble of bubbles) {
    const sx = Math.max(bubble.radius, width / 5);
    const sy = Math.max(bubble.radius, height / 4);
    const weight = bubble.radius ** 2 / (sx * sy);
    for (const cell of cells) {
      const distance = ((cell.x - bubble.x) / sx) ** 2 + ((cell.y - bubble.y) / sy) ** 2;
      cell.density += weight * Math.exp(-distance / 2);
    }
  }
  const mean = cells.reduce((sum, cell) => sum + cell.density, 0) / cells.length;
  return { cells, mean, gain: mean ? 30 / (mean * cells.length) : 0 };
}

function coverageDrift(bubble, field, width, height) {
  const { cells, mean, gain } = field;
  if (!mean) return { vx: 0, vy: 0 };
  let vx = 0;
  let vy = 0;
  for (const cell of cells) {
    const dx = (cell.x - bubble.x) / width;
    const dy = (cell.y - bubble.y) / height;
    const weight = (mean - cell.density) * Math.exp(-2 * (dx * dx + dy * dy));
    vx += dx * weight;
    vy += dy * weight;
  }
  const limit = Math.max(1, Math.hypot(vx * gain, vy * gain) / 4);
  return { vx: (vx * gain) / limit, vy: (vy * gain) / limit };
}

function edgePressure(gap, cushion) {
  return Math.max(0, 1 - gap / cushion) ** 2;
}

export function stepBubbles(bubbles, width, height, elapsed, time = 0) {
  let remaining = Math.min(Math.max(elapsed, 0), 0.05);
  if (remaining <= 1e-9 || bubbles.length === 0) return;
  const field = coverageField(bubbles, width, height);
  const strength = ambientSpeed * Math.min(width, height);
  while (remaining > 1e-9) {
    const dt = Math.min(remaining, 1 / 120);
    remaining -= dt;
    time += dt;
    const flowA = 0.32 * Math.sin(time * 0.11);
    const flowB = 0.28 * Math.cos(time * 0.09);
    for (const bubble of bubbles) {
      if (bubble.held) continue;
      bubble.age = (bubble.age ?? 0) + dt;
      const current = sampleCurrent(bubble.x, bubble.y, width, height, flowA, flowB, strength);
      const coverage = coverageDrift(bubble, field, width, height);
      const cushion = Math.min(70, bubble.radius + 24);
      const airX =
        current.vx +
        coverage.vx +
        30 *
          (edgePressure(bubble.x - bubble.radius, cushion) -
            edgePressure(width - bubble.radius - bubble.x, cushion));
      const airY =
        current.vy +
        coverage.vy +
        30 *
          (edgePressure(bubble.y - bubble.radius, cushion) -
            edgePressure(height - bubble.radius - bubble.y, cushion));
      const drag = 1 - Math.exp(-Math.min(1.5, 32 / Math.max(1, bubble.radius)) * dt);
      bubble.vx += (airX - bubble.vx) * drag;
      bubble.vy += (airY - bubble.vy) * drag;
    }
    for (let i = 0; i < bubbles.length; i++) {
      for (let j = i + 1; j < bubbles.length; j++) {
        const a = bubbles[i];
        const b = bubbles[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const cushion = Math.min(40, (a.radius + b.radius) * 0.4);
        const reach = a.radius + b.radius + cushion;
        if (Math.abs(dx) > reach || Math.abs(dy) > reach) continue;
        const distance = Math.hypot(dx, dy);
        const gap = distance - a.radius - b.radius;
        if (gap >= cushion || distance === 0) continue;
        const inverseA = a.held ? 0 : 1 / a.radius ** 2;
        const inverseB = b.held ? 0 : 1 / b.radius ** 2;
        const sum = inverseA + inverseB;
        if (!sum) continue;
        const pressure = 50 * Math.max(0, 1 - gap / cushion) ** 2 * dt;
        a.vx -= ((dx / distance) * pressure * inverseA) / sum;
        a.vy -= ((dy / distance) * pressure * inverseA) / sum;
        b.vx += ((dx / distance) * pressure * inverseB) / sum;
        b.vy += ((dy / distance) * pressure * inverseB) / sum;
      }
    }
    advanceBubbles(bubbles, width, height, dt);
    for (const bubble of bubbles) {
      if (!bubble.held) updateBubbleWarp(bubble, bubble.vx, bubble.vy, dt);
    }
  }
}

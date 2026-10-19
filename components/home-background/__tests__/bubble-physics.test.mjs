import assert from "node:assert/strict";
import test from "node:test";

import {
  bubbleGap,
  bubbleCurrent,
  bubbleShape,
  bubblesNeedFullFrameRate,
  updateBubbleWarp,
  createBubbles,
  dragBubble,
  maxThrowSpeed,
  growBubble,
  maxBubbles,
  maxBubbleRadius,
  releaseBubble,
  resizeBubbles,
  spawnBubble,
  stepBubbles,
} from "../bubble-physics.mjs";
import { ambientMotionRate } from "../home-motion.mjs";

function seeded(seed) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 2 ** 32;
  };
}

function assertSeparated(bubbles, width, height) {
  for (const [i, a] of bubbles.entries()) {
    assert.ok(a.x >= a.radius && a.x <= width - a.radius);
    assert.ok(a.y >= a.radius && a.y <= height - a.radius);
    for (const b of bubbles.slice(i + 1)) {
      assert.ok(Math.hypot(a.x - b.x, a.y - b.y) >= a.radius + b.radius - 1e-8);
    }
  }
}

test("random placement varies sizes and positions while keeping bubbles separated", () => {
  for (const [width, height, expectedCount] of [
    [320, 480, 2],
    [390, 844, 2],
    [840, 800, 3],
    [1200, 800, 4],
    [1440, 900, 5],
    [1920, 1080, 7],
    [2560, 1080, 8],
    [80, 80, null],
  ]) {
    for (let seed = 1; seed <= 30; seed++) {
      const bubbles = createBubbles(width, height, seeded(seed));
      assert.ok(bubbles.length > 0);
      assertSeparated(bubbles, width, height);
      if (expectedCount !== null) {
        assert.equal(bubbles.length, expectedCount);
        assert.equal(new Set(bubbles.map((b) => b.radius)).size, bubbles.length);
      }
      for (const bubble of bubbles) {
        const speed = Math.hypot(bubble.vx, bubble.vy);
        assert.ok(speed >= 6 && speed <= 12);
      }
    }
  }
  assert.notDeepEqual(createBubbles(1000, 800, seeded(1)), createBubbles(1000, 800, seeded(2)));
  assert.deepEqual(createBubbles(0, 0), []);
});

test("bubbles remain separated and inside bounds through sustained collisions", () => {
  for (const [width, height] of [
    [390, 844],
    [1440, 900],
    [320, 320],
  ]) {
    for (let seed = 1; seed <= 10; seed++) {
      const bubbles = createBubbles(width, height, seeded(seed));
      const initial = bubbles.map(({ x, y }) => [x, y]);
      for (let frame = 0; frame < 3600; frame++) {
        stepBubbles(bubbles, width, height, 1 / 60);
        assertSeparated(bubbles, width, height);
      }
      assert.notDeepEqual(
        bubbles.map(({ x, y }) => [x, y]),
        initial,
      );
    }
  }
});

test("head-on contact dissipates most rebound energy without overlap", () => {
  const bubbles = [
    { x: 100, y: 100, radius: 30, vx: 20, vy: 0 },
    { x: 160.1, y: 100, radius: 30, vx: -20, vy: 0 },
  ];
  stepBubbles(bubbles, 400, 300, 1 / 60);
  assert.ok(bubbles[0].vx < 0 && bubbles[0].vx > -4);
  assert.ok(bubbles[1].vx > 0 && bubbles[1].vx < 4);
  assertSeparated(bubbles, 400, 300);
});

test("wall contact reflects velocity and long frames do not cause a jump", () => {
  const bubbles = [{ x: 30.1, y: 100, radius: 30, vx: -20, vy: 0 }];
  stepBubbles(bubbles, 400, 300, 60);
  assert.ok(bubbles[0].vx > 0 && bubbles[0].vx < 6);
  assert.ok(Math.abs(bubbles[0].x - 30.1) <= 1);
  assertSeparated(bubbles, 400, 300);
  const snapshot = structuredClone(bubbles);
  stepBubbles(bubbles, 400, 300, 0);
  assert.deepEqual(bubbles, snapshot);
});

test("resize preserves sizes, identities and momentum while repositioning only displaced bubbles", () => {
  const bubbles = createBubbles(1200, 800, seeded(7));
  const identities = [...bubbles];
  const before = structuredClone(bubbles);
  const popped = resizeBubbles(bubbles, 600, 800);
  assert.equal(popped.length, 0);
  bubbles.forEach((bubble, i) => {
    assert.equal(bubble, identities[i]);
    assert.equal(bubble.radius, before[i].radius);
    assert.equal(bubble.vx, before[i].vx);
    assert.equal(bubble.vy, before[i].vy);
    if (before[i].x <= 600 - before[i].radius) {
      assert.equal(bubble.x, before[i].x);
      assert.equal(bubble.y, before[i].y);
    }
  });
  assertSeparated(bubbles, 600, 800);
  const smaller = structuredClone(bubbles);
  resizeBubbles(bubbles, 1400, 900);
  assert.deepEqual(bubbles, smaller);
  resizeBubbles(bubbles, 0, 0);
  assert.deepEqual(bubbles, smaller);
  for (let i = 0; i < 600; i++) {
    stepBubbles(bubbles, 1400, 900, 1 / 60);
    assertSeparated(bubbles, 1400, 900);
  }
});

test("resize pops bubbles that cannot fit instead of shrinking or respawning them", () => {
  const bubbles = [
    { x: 50, y: 50, radius: 40, vx: 1, vy: 2 },
    { x: 150, y: 50, radius: 40, vx: 3, vy: 4 },
    { x: 300, y: 150, radius: 60, vx: 5, vy: 6 },
  ];
  const original = [...bubbles];
  const popped = resizeBubbles(bubbles, 100, 100);
  assert.deepEqual(bubbles, [original[0]]);
  assert.deepEqual(popped, [original[2], original[1]]);
  assert.deepEqual(
    original.map((b) => b.radius),
    [40, 40, 60],
  );
  assertSeparated(bubbles, 100, 100);
  resizeBubbles(bubbles, 1400, 900);
  assert.deepEqual(bubbles, [original[0]]);
});

test("spawning respects occupied space, edges and the population limit", () => {
  const bubbles = [];
  assert.equal(spawnBubble(bubbles, 1000, 1000, 2, 2), null);
  const first = spawnBubble(bubbles, 1000, 1000, 100, 100);
  assert.ok(first.held);
  assert.equal(spawnBubble(bubbles, 1000, 1000, 100, 100), null);
  for (let i = 1; i < maxBubbles; i++) {
    assert.ok(spawnBubble(bubbles, 1000, 1000, 100 + (i % 6) * 100, 100 + Math.floor(i / 6) * 100));
  }
  assert.equal(spawnBubble(bubbles, 1000, 1000, 900, 900), null);
  assert.equal(bubbles.length, maxBubbles);
  assertSeparated(bubbles, 1000, 1000);
});

test("held growth stops at neighbors, walls and the maximum radius", () => {
  const bubbles = [];
  const bubble = spawnBubble(bubbles, 500, 500, 200, 200);
  growBubble(bubble, bubbles, 500, 500, 0.5);
  assert.equal(bubble.radius, 30);
  growBubble(bubble, bubbles, 500, 500, 100);
  assert.equal(bubble.radius, maxBubbleRadius);

  const neighbor = spawnBubble(bubbles, 500, 500, 350, 200);
  growBubble(neighbor, bubbles, 500, 500, 100);
  assert.equal(neighbor.radius, 150 - maxBubbleRadius - bubbleGap);
  assertSeparated(bubbles, 500, 500);

  const edge = spawnBubble(bubbles, 500, 500, 20, 20);
  growBubble(edge, bubbles, 500, 500, 100);
  assert.equal(edge.radius, 20);
  releaseBubble(edge, { vx: 18, vy: 0 });
  assert.equal(edge.held, false);
  assert.equal(edge.vx, 18);
  assert.equal(edge.vy, 0);
});

test("moving bubbles bounce off a held bubble without displacing it", () => {
  const held = { x: 100, y: 100, radius: 30, vx: 0, vy: 0, held: true };
  const moving = { x: 160.1, y: 100, radius: 30, vx: -20, vy: 0 };
  const bubbles = [held, moving];
  stepBubbles(bubbles, 400, 300, 1 / 60);
  assert.equal(held.x, 100);
  assert.equal(held.vx, 0);
  assert.ok(moving.vx > 0 && moving.vx < 4);
  assertSeparated(bubbles, 400, 300);
});

test("fast throws collide continuously and do not freeze unrelated bubbles", () => {
  const a = { x: 100, y: 100, radius: 8, vx: 480, vy: 0 };
  const b = { x: 130, y: 100, radius: 8, vx: -480, vy: 0 };
  const c = { x: 200, y: 250, radius: 20, vx: 40, vy: 0 };
  const bubbles = [a, b, c];
  stepBubbles(bubbles, 600, 400, 0.05);
  assert.ok(a.vx < 0 && b.vx > 0);
  assert.ok(a.x < b.x);
  assert.ok(c.x > 201.8, "unrelated bubble advances through the contact");
  assertSeparated(bubbles, 600, 400);
});

test("unequal collisions preserve size-weighted momentum while larger bubbles yield less", () => {
  const a = { x: 100, y: 150, radius: 40, vx: 100, vy: 0 };
  const b = { x: 160, y: 150, radius: 20, vx: 0, vy: 0 };
  const before = a.radius ** 3 * a.vx;
  stepBubbles([a, b], 800, 600, 0.001);
  const after = a.radius ** 3 * a.vx + b.radius ** 3 * b.vx;
  assert.ok(Math.abs(after - before) / before < 0.001);
  assert.ok(b.vx > a.vx && a.vx > 85);
  assertSeparated([a, b], 800, 600);
});

test("throws retain direction, are speed limited and gradually lose momentum", () => {
  const bubble = { x: 500, y: 500, radius: 30, vx: 0, vy: 0, held: true };
  releaseBubble(bubble, { vx: 3000, vy: -4000 });
  assert.ok(Math.abs(Math.hypot(bubble.vx, bubble.vy) - maxThrowSpeed) < 1e-8);
  assert.equal(bubble.vx / bubble.vy, -0.75);
  for (let i = 0; i < 60; i++) stepBubbles([bubble], 2000, 2000, 1 / 60);
  const speed = Math.hypot(bubble.vx, bubble.vy);
  assert.ok(speed > 50 && speed < maxThrowSpeed / 2);
  assert.ok(bubble.x > 500 && bubble.y < 500);
});

test("shared currents drift smoothly and stay consistent across frame rates", () => {
  const start = { x: 500, y: 500, radius: 35, vx: 0, vy: 0 };
  const slow = [{ ...start }];
  const fast = [{ ...start }];
  for (let i = 0; i < 90; i++) stepBubbles(slow, 2000, 2000, 1 / 30, i / 30);
  for (let i = 0; i < 360; i++) stepBubbles(fast, 2000, 2000, 1 / 120, i / 120);
  assert.ok(Math.hypot(slow[0].x - start.x, slow[0].y - start.y) > 2);
  assert.ok(Math.hypot(slow[0].x - fast[0].x, slow[0].y - fast[0].y) < 0.01);
});

test("dragging stops at held obstacles and edges without storing blocked momentum", () => {
  const held = { x: 100, y: 100, radius: 20, vx: 0, vy: 0, held: true };
  const obstacle = { x: 200, y: 100, radius: 20, vx: 0, vy: 0, held: true };
  const bubbles = [held, obstacle];
  for (let i = 0; i < 120; i++) {
    dragBubble(held, bubbles, 600, 400, 500, 100, 1 / 60);
    assertSeparated(bubbles, 600, 400);
  }
  assert.ok(held.x > 159 && held.x <= 160);
  assert.equal(held.y, 100);
  assert.equal(held.dragVX, 0);
  for (let i = 0; i < 240; i++) {
    dragBubble(held, bubbles, 600, 400, -100, -100, 1 / 60);
    assertSeparated(bubbles, 600, 400);
  }
  assert.ok(Math.abs(held.x - 20) < 0.01);
  assert.ok(Math.abs(held.y - 20) < 0.01);
});

test("larger bubbles resist dragging more and neither size snaps to the pointer", () => {
  const small = { x: 200, y: 200, radius: 16, vx: 0, vy: 0, held: true };
  const large = { ...small, radius: 80 };
  for (let i = 0; i < 12; i++) {
    dragBubble(small, [small], 1000, 800, 500, 200, 1 / 60);
    dragBubble(large, [large], 1000, 800, 500, 200, 1 / 60);
  }
  assert.ok(small.x > 200 && small.x < 500);
  assert.ok(large.x > 200 && large.x < 500);
  assert.ok(large.x - 200 < (small.x - 200) * 0.6);
  assert.equal(small.radius, 16);
  assert.equal(large.radius, 80);
});

test("large dragged bubbles push small neighbors aside with much less resistance", () => {
  function push(radius, neighborRadius, withNeighbor) {
    const held = { x: 150, y: 200, radius, vx: 0, vy: 0, held: true };
    const neighbor = {
      x: 151 + radius + neighborRadius,
      y: 200,
      radius: neighborRadius,
      vx: 0,
      vy: 0,
    };
    const start = neighbor.x;
    const bubbles = withNeighbor ? [held, neighbor] : [held];
    for (let i = 0; i < 30; i++) {
      dragBubble(held, bubbles, 1000, 600, 500, 200, 1 / 60);
      assertSeparated(bubbles, 1000, 600);
      assert.ok(Math.hypot(neighbor.vx, neighbor.vy) <= maxThrowSpeed + 1e-8);
    }
    assert.equal(held.radius, radius);
    assert.equal(neighbor.radius, neighborRadius);
    return { progress: held.x - 150, pushed: neighbor.x - start };
  }
  const large = push(60, 20, true);
  const small = push(20, 60, true);
  const largeFraction = large.progress / push(60, 20, false).progress;
  const smallFraction = small.progress / push(20, 60, false).progress;
  assert.ok(largeFraction > 0.8);
  assert.ok(smallFraction < 0.2);
  assert.ok(large.pushed > small.pushed * 4);
});

test("a dragged bubble can push a chain but cannot force it through a wall", () => {
  const held = { x: 200, y: 200, radius: 60, vx: 0, vy: 0, held: true };
  const bubbles = [
    held,
    { x: 300, y: 200, radius: 20, vx: 0, vy: 0 },
    { x: 340, y: 200, radius: 20, vx: 0, vy: 0 },
  ];
  for (let i = 0; i < 240; i++) {
    dragBubble(held, bubbles, 500, 400, 450, 200, 1 / 60);
    assertSeparated(bubbles, 500, 400);
  }
  assert.ok(Math.abs(held.x - 360) < 0.01);
  assert.ok(Math.abs(bubbles[1].x - 440) < 0.01);
  assert.ok(Math.abs(bubbles[2].x - 480) < 0.01);
  assert.ok(bubbles.every((bubble) => Math.hypot(bubble.vx, bubble.vy) < 0.01));
  assert.equal(held.dragVX, 0);
});

test("drag pushing and free movement remain separated through glancing contacts", () => {
  const held = { x: 100, y: 250, radius: 60, vx: 0, vy: 0, held: true };
  const bubbles = [
    held,
    ...Array.from({ length: 9 }, (_, i) => ({
      x: 280 + (i % 3) * 110,
      y: 100 + Math.floor(i / 3) * 130,
      radius: 16 + i,
      vx: 0,
      vy: 0,
    })),
  ];
  for (let i = 0; i < 600; i++) {
    dragBubble(
      held,
      bubbles,
      800,
      500,
      400 + Math.cos(i * 0.03) * 280,
      250 + Math.sin(i * 0.03) * 150,
      1 / 60,
    );
    assertSeparated(bubbles, 800, 500);
    stepBubbles(bubbles, 800, 500, 1 / 60, i / 60);
    assertSeparated(bubbles, 800, 500);
  }
});

test("drag resistance is frame-rate independent and eases to a stationary target", () => {
  const start = { x: 200, y: 200, radius: 60, vx: 0, vy: 0, held: true };
  const slow = { ...start };
  const fast = { ...start };
  for (let i = 0; i < 30; i++) dragBubble(slow, [slow], 1000, 800, 250, 230, 1 / 30);
  for (let i = 0; i < 120; i++) dragBubble(fast, [fast], 1000, 800, 250, 230, 1 / 120);
  assert.ok(Math.hypot(slow.x - fast.x, slow.y - fast.y) < 0.001);
  assert.ok(slow.x < 250 && slow.y < 230);
  for (let i = 0; i < 180; i++) dragBubble(slow, [slow], 1000, 800, 250, 230, 1 / 60);
  assert.ok(Math.hypot(slow.x - 250, slow.y - 230) < 0.001);
  assert.ok(Math.hypot(slow.dragVX, slow.dragVY) < 0.01);
  const snapshot = structuredClone(slow);
  assert.deepEqual(dragBubble(slow, [slow], 1000, 800, 900, 700, 0), { dx: 0, dy: 0 });
  assert.deepEqual(slow, snapshot);
});

test("nearby bubbles and edges soften the approach before actual contact", () => {
  const a = { x: 200, y: 200, radius: 30, vx: 8, vy: 0 };
  const b = { x: 275, y: 200, radius: 30, vx: -8, vy: 0 };
  for (let i = 0; i < 30; i++) stepBubbles([a, b], 800, 600, 1 / 60);
  assert.ok(b.x - a.x > 60, "separation starts before surface contact");
  assert.ok(a.vx - b.vx < 8, "closing speed is reduced rather than sharply reflected");
  const edge = { x: 45, y: 200, radius: 30, vx: -4, vy: 0 };
  for (let i = 0; i < 60; i++) stepBubbles([edge], 800, 600, 1 / 60);
  assert.ok(edge.x > 40 && edge.vx > 0, "edge cushion turns gentle drift before a wall impact");
});

test("dense throws stay separated during repeated multi-bubble contacts", () => {
  for (let seed = 1; seed <= 4; seed++) {
    const random = seeded(seed);
    const bubbles = Array.from({ length: 24 }, (_, i) => ({
      x: 30 + (i % 6) * 45,
      y: 30 + Math.floor(i / 6) * 55,
      radius: 8 + random() * 10,
      vx: (random() - 0.5) * maxThrowSpeed * 2,
      vy: (random() - 0.5) * maxThrowSpeed * 2,
    }));
    for (let frame = 0; frame < 1200; frame++) {
      stepBubbles(bubbles, 320, 300, 1 / 60);
      assertSeparated(bubbles, 320, 300);
    }
  }
});

test("momentum stretches the bubble along its travel direction and relaxes when stopped", () => {
  const horizontal = { x: 300, y: 300, radius: 40, vx: 200, vy: 0 };
  const vertical = { ...horizontal, vx: 0, vy: 200 };
  for (let i = 0; i < 60; i++) {
    updateBubbleWarp(horizontal, 200, 0, 1 / 60);
    updateBubbleWarp(vertical, 0, 200, 1 / 60);
  }
  const xShape = bubbleShape(horizontal);
  const yShape = bubbleShape(vertical);
  assert.ok(Math.abs(xShape.angle) < 0.01);
  assert.ok(Math.abs(Math.abs(yShape.angle) - Math.PI / 2) < 0.01);
  assert.ok(xShape.scaleY < 0.86 && xShape.scaleY >= 0.8);
  assert.equal(xShape.scaleX, 1);
  const unchanged = structuredClone(horizontal);
  updateBubbleWarp(horizontal, 0, 0, 0);
  assert.deepEqual(horizontal, unchanged);
  for (let i = 0; i < 180; i++) updateBubbleWarp(horizontal, 0, 0, 1 / 60);
  assert.ok(bubbleShape(horizontal).scaleY > 0.999);
});

test("contact compresses across the impact direction without exceeding the collision circle", () => {
  const a = { x: 100, y: 100, radius: 30, vx: 200, vy: 0 };
  const b = { x: 160, y: 100, radius: 30, vx: -200, vy: 0 };
  stepBubbles([a, b], 600, 400, 1 / 60);
  assert.ok(a.warpX < 0 && b.warpX < 0, "impact compresses horizontally");
  for (let i = 0; i < 120; i++) {
    stepBubbles([a, b], 600, 400, 1 / 60);
    for (const bubble of [a, b]) {
      const shape = bubbleShape(bubble);
      assert.ok(shape.scaleX <= 1 && shape.scaleY <= 1 && shape.scaleY >= 0.8);
    }
    assertSeparated([a, b], 600, 400);
  }
});

test("circulating currents have no net vertical bias or boundary leakage", () => {
  for (const time of [0, 20, 60, 120]) {
    let verticalSum = 0;
    for (let y = 40; y < 800; y += 80) {
      for (let x = 40; x < 1200; x += 80) {
        verticalSum += bubbleCurrent(x, y, 1200, 800, time).vy;
      }
      assert.ok(Math.abs(bubbleCurrent(0, y, 1200, 800, time).vx) < 1e-8);
      assert.ok(Math.abs(bubbleCurrent(1200, y, 1200, 800, time).vx) < 1e-8);
    }
    assert.ok(Math.abs(verticalSum) < 1e-8);
    for (let x = 40; x < 1200; x += 80) {
      assert.ok(Math.abs(bubbleCurrent(x, 0, 1200, 800, time).vy) < 1e-8);
      assert.ok(Math.abs(bubbleCurrent(x, 800, 1200, 800, time).vy) < 1e-8);
    }
  }
  assert.notDeepEqual(
    bubbleCurrent(300, 300, 1200, 800, 0),
    bubbleCurrent(300, 300, 1200, 800, 20),
  );
});

test("paced scenes maintain coverage over the same ambient time window", () => {
  for (let seed = 1; seed <= 3; seed++) {
    const bubbles = createBubbles(1200, 800, seeded(seed));
    let top = 0;
    let bottom = 0;
    let samples = 0;
    // Keep the observed circulation window constant when ambient playback slows down.
    for (let frame = 0; frame < 3600 / ambientMotionRate; frame++) {
      stepBubbles(bubbles, 1200, 800, 0.05, frame * 0.05);
      assertSeparated(bubbles, 1200, 800);
      if (frame <= 600 / ambientMotionRate) continue;
      for (const bubble of bubbles) {
        top += Number(bubble.y < 200);
        bottom += Number(bubble.y > 600);
        samples++;
      }
    }
    assert.ok(top / samples > 0.15 && top / samples < 0.4);
    assert.ok(bottom / samples > 0.15 && bottom / samples < 0.4);
  }
});

test("only held, thrown, or wobbling bubbles need display-rate frames", () => {
  const width = 1440;
  const height = 1800;
  const bubbles = createBubbles(width, height, seeded(7));
  let time = 0;
  const step = (seconds) => {
    for (let elapsed = 0; elapsed < seconds; elapsed += 1 / 120) {
      stepBubbles(bubbles, width, height, 1 / 120, time);
      time += 1 / 120;
    }
  };

  step(3);
  for (let check = 0; check < 60; check++) {
    step(0.5);
    assert.equal(bubblesNeedFullFrameRate(bubbles), false, `ambient drift at ${time}s`);
  }

  bubbles[0].held = true;
  assert.equal(bubblesNeedFullFrameRate(bubbles), true);
  releaseBubble(bubbles[0], { vx: 300, vy: 0 });
  assert.equal(bubblesNeedFullFrameRate(bubbles), true);
  step(10);
  assert.equal(bubblesNeedFullFrameRate(bubbles), false);
});

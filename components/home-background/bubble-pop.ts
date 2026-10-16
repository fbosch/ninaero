import type { Bubble } from "./bubble-physics.mjs";

type PopClasses = { pop: string; popRing: string; popDroplet: string };

export function clearBubblePops(layer: HTMLElement) {
  for (const animation of layer.getAnimations({ subtree: true })) animation.cancel();
  layer.replaceChildren();
}

export function showBubblePop(layer: HTMLElement, bubble: Bubble, classes: PopClasses) {
  if (layer.children.length >= 4) {
    const oldest = layer.firstElementChild;
    oldest?.getAnimations({ subtree: true }).forEach((animation) => animation.cancel());
    oldest?.remove();
  }

  const pop = document.createElement("div");
  pop.className = classes.pop;
  pop.style.transform = `translate(${bubble.x}px, ${bubble.y}px)`;
  const ring = document.createElement("span");
  ring.className = classes.popRing;
  ring.style.width = `${bubble.radius * 2}px`;
  ring.style.height = `${bubble.radius * 2}px`;
  ring.style.left = `${-bubble.radius}px`;
  ring.style.top = `${-bubble.radius}px`;
  pop.append(ring);
  layer.append(pop);

  ring.animate(
    [
      { transform: "scale(1)", opacity: 0.9 },
      { transform: "scale(1.12)", opacity: 0 },
    ],
    { duration: 180, easing: "ease-out", fill: "forwards" },
  );
  for (let i = 0; i < 8; i++) {
    const angle = ((i + Math.random() * 0.35) / 8) * Math.PI * 2;
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);
    const distance = bubble.radius + 18 + Math.random() * 18;
    const droplet = document.createElement("span");
    droplet.className = classes.popDroplet;
    const size = 3 + Math.random() * 3;
    droplet.style.width = `${size}px`;
    droplet.style.height = `${size}px`;
    pop.append(droplet);
    droplet.animate(
      [
        { transform: `translate(${dx * bubble.radius}px, ${dy * bubble.radius}px) scale(1)` },
        {
          transform: `translate(${dx * distance + bubble.vx * 0.08}px, ${dy * distance + bubble.vy * 0.08 + 8}px) scale(0.2)`,
        },
      ],
      { duration: 320, easing: "cubic-bezier(0.16, 0.7, 0.3, 1)", fill: "forwards" },
    );
  }
  const fade = pop.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 320, easing: "ease-out" });
  fade.onfinish = () => {
    pop.getAnimations({ subtree: true }).forEach((animation) => animation.cancel());
    pop.remove();
  };
}

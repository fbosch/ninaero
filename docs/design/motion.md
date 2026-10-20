# Interaction, motion, and accessibility

Part of the [Ninaero design direction](../../DESIGN.md).

## Interaction and accessibility

Ninaero's motion is bubbly and playful. Opening layers expand with a small overshoot and settle into place. Use a single soft bounce rather than repeated wobbling, rotation, or continuous floating. Keep text entry, keyboard focus, and selection steady.

Begin feedback immediately. Larger layers may take 220 to 280ms to settle; dismissals should finish in 120 to 160ms. Animate transform and opacity instead of layout. Repeated actions must retarget from the current visual state without restarting a canned sequence. Reduced motion removes movement and decorative fades while preserving state changes and focus.

- Respond to presses immediately. Do not delay an action or state update until a decorative animation finishes.
- Keep motion brief and tied to the action. Respect reduced-motion preferences and retain clear static states.
- Give keyboard focus a visible outline. Glow alone is not a focus indicator.
- Distinguish selected, invalid, loading, and disabled states without relying on color, glow, or motion alone.
- Keep existing keyboard behavior, focus management, and semantic state indications when restyling components.
- Test text and control contrast against the actual backgrounds, including any texture or translucency.

These are design requirements. They have not yet been verified in a themed interactive prototype.

### Animation and audio alignment

Treat component motion and its audio cue as one response. Sound supplements visible feedback; the interaction must remain clear when muted.

- Start the cue with the visible state change, not merely a request to change state or an animation-complete callback. For Dialog and AlertDialog, play `rise` when the popup begins opening. Canceled opens and hidden, mounted popups stay silent.
- Match the cue to the motion's landmarks. For an opening bounce, align the rising pitch's arrival with the first overshoot and let the decay finish as the panel settles. Equal total durations alone do not establish alignment.
- Keep paired timing values in a shared definition where practical. Distinguish fixed-duration CSS easing from a physics-based spring. For cubic Bézier easing, convert the curve parameter to elapsed time through its x-coordinate; the parameter itself is not elapsed progress. Recheck the cue whenever the duration or easing changes.
- Handle interrupted transitions, rapid reopening, and unmounting without delayed or duplicate cues. Never delay an interaction for audio or queue a stale cue while the audio engine loads.
- Honor provider mute and volume settings and `sound={false}`. Under reduced motion, update the visual state immediately and keep enabled audio feedback immediate too; do not wait for a transition that no longer runs.
- Review motion and audio together in a browser, including keyboard activation, controlled opens, interruptions, and reduced motion. Tests can check cue timing and playback behavior, but listening alongside the animation establishes perceptual alignment.

#### Calculate the motion landmarks

For CSS `cubic-bezier(x1, y1, x2, y2)`, let `u` be the curve parameter and `T` the transition duration. Use seconds for all timing calculations.

```text
Bx(u) = 3(1-u)^2 u x1 + 3(1-u)u^2 x2 + u^3
By(u) = 3(1-u)^2 u y1 + 3(1-u)u^2 y2 + u^3

elapsed_time = T * Bx(u)
animated_value = start_value + (end_value - start_value) * By(u)
```

To find the first overshoot, solve the derivative below. Choose the first root inside `0 < u < 1` where `By'(u)` changes from positive to negative and `By(u) > 1`.

```text
By'(u) = a*u^2 + b*u + c

a = 3(1 - 3*y2 + 3*y1)
b = 6(y2 - 2*y1)
c = 3*y1

u = (-b +/- sqrt(b^2 - 4*a*c)) / (2*a)
t_peak = T * Bx(u_peak)
```

If `a = 0`, solve the linear equation instead. A curve without a qualifying root has no overshoot to synchronize with. For another landmark, such as the first arrival at the resting position, solve `By(u) = 1` and convert that root through `Bx`. Do not use `T * u`.

These equations apply to an uninterrupted CSS transition. A physics-based spring needs its own solver's position and velocity: locate the first overshoot where velocity changes sign, and define settling with explicit position and velocity tolerances. Interrupted transitions also need their actual remaining motion rather than the original full-duration calculation.

#### Calculate the audio timing

Let `s` be the cue's scheduled start offset from the visible motion's start, `L` the measured extra audio latency relative to that visible start, `at` the layer's offset within the cue, and `g` its pitch-glide duration. Foley's pitch glide starts at the layer's onset and reaches its target after `g`; that is separate from the gain peak.

```text
audible_pitch_arrival = s + L + at + g
s = t_peak - L - at - g

# To start the cue with the motion, set s = 0 and solve for the glide:
g = t_peak - L - at
```

A negative `s` would require playing before the visible motion starts. Shorten the glide or choose another landmark instead of delaying the interaction. If the required `g` is not positive, the landmark is too early for the measured latency. Do not assume zero device latency establishes sample-accurate synchronization.

For a Foley tone layer, let `attack` and `decay` be its base envelope durations and `A` and `D` the effective theme multipliers. Align the dry gain-envelope endpoint with the motion's settling time:

```text
gain_peak = s + L + at + attack*A
envelope_end = s + L + at + attack*A + decay*D
D = (t_settle - s - L - at - attack*A) / decay
```

Require a positive base decay and a valid multiplier. Check every layer: Foley noise uses `decay * (0.7*D + 0.3)` rather than `decay*D`. The cue's dry envelope ends at the latest layer endpoint. Reverb can ring beyond it; oscillator cleanup time is not an audible timing target. Keep these equations consistent with the installed audio engine.

#### Dialog calculation

The dialog's `cubic-bezier(0.22, 2.2, 0.35, 1)` and 260ms duration give:

```text
By'(u) = 13.8*u^2 - 20.4*u + 6.6
u_peak = 11/23 = 0.47826087
Bx(u_peak) = 0.32062464
t_peak = 0.260 * 0.32062464 = 0.08336241 seconds
```

The first overshoot therefore occurs around 83.36ms, not 124ms. For the dry `rise` tone, an immediate cue with no additional latency, no layer offset, a 4ms attack, and a 200ms base decay gives these design targets:

```text
g = 0.08336241 seconds
D = (0.260 - 0.004) / 0.200 = 1.28
```

This aligns pitch arrival with the overshoot and the dry envelope endpoint with the 260ms settle. It does not align the loudness peak with the overshoot. Treat these as calculation targets, then verify the audible result alongside the animation.

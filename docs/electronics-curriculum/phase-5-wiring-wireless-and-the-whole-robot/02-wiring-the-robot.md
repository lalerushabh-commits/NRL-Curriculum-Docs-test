---
title: "Module 5.2: Wiring the Robot"
sidebar_position: 2
slug: /phase-5-wiring-wireless-and-the-whole-robot/wiring-the-robot
---

The difference between a robot that survives a competition day and one that doesn't is usually visible from a metre away.

With the harness in hand and every port known, wiring the robot is assembly, not electronics. The craft is in the **layout** — and it follows five rules:

1. **Plan before you plug.** Dry-run the layout: battery reachable for swaps, main switch reachable in a hurry, every cable arriving at its port without stretching or doubling back.
2. **Power and signal travel apart.** Route the thick power cables (battery, driver, motors) along one path and the thin signal cables along another. Motor power switching at high speed is electrically noisy, and signal wires bundled against it pick up that noise as sensor glitches.
3. **Stay clear of everything that moves or heats.** Wheels, gears, arm pivots, and motor bodies all destroy cables. Route around, tie back, and check the full range of every mechanism *by hand, unpowered* before first power-on.
4. **Strain-relieve and leave service loops.** Anchor cables near each connector so a snag pulls on the tie, not the pins — but leave gentle slack. A drum-tight harness fails at the connectors from pure vibration.
5. **Tie it down, and label if it helps.** Zip ties every few centimetres, snug but not crushing. On a symmetric robot, a flag of tape marking LEFT/RIGHT on the motor cables pays for itself all season.

:::note[Photo coming soon]
Well-wired robot chassis: separated power/signal runs, zip ties, service loops, labelled cables. What good looks like. You can trace every cable with your eyes — which means you can troubleshoot it in a hurry.
:::

## The wiring QC checklist

Before the second-person power-on check ([Module 2.4](/phase-2-your-hardware/safety-first)), run your own inspection:

- Every connector: look, seat, tug ([Module 5.1](/phase-5-wiring-wireless-and-the-whole-robot/conclusion-and-next-steps)).
- Battery held by its strap — a shifting pack yanks its own power cable.
- Full mechanism sweep by hand — nothing rubs, nothing pinches at any position.
- No cable within reach of a wheel or gear, even under vibration.
- Antenna clear and positioned ([Module 5.3](/phase-5-wiring-wireless-and-the-whole-robot/conclusion-and-next-steps)).
- Phone photo of the finished layout for the team album.

:::keyidea[Neat is fast]
Tidy wiring is not for style points. In the pit, with three minutes before a match, the team that can *see* its wiring finds the loose connector; the team with spaghetti does not. Every rule in this module is really about speed when it matters.
:::

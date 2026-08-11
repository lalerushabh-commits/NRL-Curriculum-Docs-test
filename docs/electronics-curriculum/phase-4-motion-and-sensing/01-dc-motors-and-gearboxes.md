---
title: "Module 4.1: DC Motors & Gearboxes"
sidebar_position: 1
slug: /phase-4-motion-and-sensing/dc-motors-and-gearboxes
---

The robot's muscles: simple, strong, and honest — they always tell you how hard they're working, if you know how to listen.

Your drive wheels are turned by **12 V brushed DC geared motors** (the "Johnson" motors in your kit, geared to 300 RPM). Two ideas explain everything about them:

- **How they spin:** current through coils creates a magnetic push against fixed magnets; a rotating switch called a **commutator** keeps flipping the current so the push continues. More voltage → faster spin; more load → more current drawn.
- **The gearbox trade:** the bare motor spins very fast with little strength. The gearbox trades speed for **torque** (turning force) — dropping to 300 RPM while multiplying the twist that reaches the wheel. Speed and torque are two ends of one see-saw; your Mechanical teammates live on that see-saw.

![The geared motor: cylindrical motor body behind, gearbox and output shaft in front. Two power wires ending in a 2-pin JST-VH connector, no electronics inside — the direction it spins is simply the direction current flows through it.](/img/electronics/phase4-geared-motor.png)

*The geared motor: cylindrical motor body behind, gearbox and output shaft in front. Two power wires ending in a 2-pin JST-VH connector, no electronics inside — the direction it spins is simply the direction current flows through it.*

## The two currents that matter

| State | What's happening | Current |
| --- | --- | --- |
| Free run | Spinning with no load | Small — a fraction of an amp |
| Working | Driving the robot | Moderate — rises with effort, watch it on telemetry |
| **Stall** | Shaft forced to a stop while powered | **Maximum** — several amps of pure heat. Seconds of stall cook motors and drain packs. |

:::warning[Stall is the enemy]
A stalled motor converts every watt into heat, right inside the windings. If the robot is pushing against a wall and not moving, **ease off**. Drivers who hold full throttle against an immovable object are slow-roasting their own motors — and the current telemetry shows it happening in real time.
:::

:::tip[The touch test]
After a practice run, rest a finger on each motor body. Comfortably warm is honest work. Too hot to hold means stalling, binding, or a mechanical problem — tell your Mechanical teammates what you found and which motor it was.
:::

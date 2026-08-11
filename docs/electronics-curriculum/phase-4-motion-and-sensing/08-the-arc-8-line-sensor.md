---
title: "Module 4.8: The ARC-8 Line Sensor"
sidebar_position: 8
slug: /phase-4-motion-and-sensing/the-arc-8-line-sensor
---

Eight infrared eyes staring at the floor — the hardware behind every line-following robot.

The **ARC-8** is a bar of **eight infrared reflectance sensors**. Each one shines invisible IR light at the floor and measures how much bounces back: a **white** surface reflects strongly, a **black** line barely at all. Eight readings in a row tell the robot not just *that* the line is there, but *where under the bar* it is — which is exactly what a line-following program steers by.

The ARC-8 connects to the Hub through its dedicated **Y-shaped harness cable**: a 6-pin JST plug at the sensor's end that splits into **two 4-pin JST plugs**, one into each of the Hub's two **Extra Digital IO Ports** ([Module 2.1](/phase-2-your-hardware/the-command-hub-up-close)). The ports supply the sensor's **3.3 V** power and carry its readings to the brain. Two pins of one 4-pin plug are intentionally unused — that is by design, not a fault.

![What the robot sees: eight channels stare at the mat; the channels over the black line read high while the rest read low — and the pattern's position is the line's position.](/img/electronics/phase4-arc8-line-reading.png)

*What the robot sees: eight channels stare at the mat; the channels over the black line read high while the rest read low — and the pattern's position is the line's position.*

:::note[Photo coming soon]
ARC-8 array underside showing the 8 sensor pairs; mounted at the front of a robot over a black line on white mat. The ARC-8 mounted low at the robot's front edge — close enough to see sharply, high enough not to scrape.
:::

:::warning[3.3 volts. Only. Ever.]
The ARC-8 must be powered from **3.3 V** — which is exactly what its port provides. Never improvise its wiring onto a 5 V supply: on 5 V its outputs slam past what the Hub's inputs tolerate, white and black become indistinguishable, and you risk damaging the board. If the ARC-8 ever reads "all maxed out," check its wiring and supply **first**.
:::

## Getting good readings — your three jobs

- **Height:** mount the bar a few millimetres off the floor, level across its width — too high and the picture blurs, too low and it scrapes on mat seams.
- **Light:** strong sunlight and some hall lighting contain IR that pollutes readings. If a robot that behaved indoors goes strange near a window, shade the sensor and look again.
- **Cleanliness:** dust on the sensor face dims every reading. A gentle wipe before matches is a real, professional maintenance step.

:::note[Why programmers "calibrate"]
No two channels, mats, or venues read identically, so before each event programmers sweep the robot across the line while software records each channel's own white and black values. That is **calibration**. Your part of the bargain: once calibrated, don't change the sensor's height or angle — a re-mounted sensor needs a re-calibration.
:::

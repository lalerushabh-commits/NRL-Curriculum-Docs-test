---
title: "Module 5.5: Troubleshooting — The Debug Guide"
sidebar_position: 5
slug: /phase-5-wiring-wireless-and-the-whole-robot/troubleshooting
---

Robots fail. Calm, methodical people fix them fast — using eyes, lights, telemetry, the battery checker, and smart swaps.

## The golden rules

1. **Power first.** Whatever the symptom, check the power story before anything else: main switch, battery seating, the pack on the **battery checker**, voltage on telemetry. Half of all faults die here.
2. **Change one thing at a time.** Swap one cable, re-seat one connector, then re-test. Change three things and you learn nothing even when it works.
3. **Halve the problem.** Robot dead? Does the Hub power up with the driver's power unplugged (switch OFF first)? Yes → the fault is downstream. Cut the mystery in half with every test.
4. **Swap toward the truth.** Suspected bad motor? Swap it to the *other* driver channel. Fault follows the motor → it's the motor. Fault stays with the channel → wiring. Spares turn guesses into proofs.
5. **Log the fix.** One line in the team log — symptom, cause, fix. A season of lines becomes the team's private repair manual.

## The fault table

| Symptom | Check first | Then | Usual culprit |
| --- | --- | --- | --- |
| Robot completely dead | Main switch; battery XT30 fully clicked | Pack on the battery checker | Unseated XT30 or empty pack |
| Resets when driving hard | Battery voltage telemetry while driving (deep sag?) | XT30 seating; pack on the checker after a rest | Brownout — tired battery ([Module 3.4](/phase-3-power/brownouts-and-power-monitoring)) |
| One motor dead | Its JST-VH power cable seating at driver and motor | Swap that motor to the other channel | Unseated cable; occasionally the motor |
| Servo buzzing and hot | Is it commanded against a hard stop? | Linkage jam by hand (power OFF); servo rail current on telemetry | Unreachable target position ([Module 4.2](/phase-4-motion-and-sensing/servos)) |
| Sensor reads garbage / all max | Supply voltage — the right port, the right volts ([Module 4.5](/phase-4-motion-and-sensing/analog-and-digital-signals), [Module 4.8](/phase-4-motion-and-sensing/the-arc-8-line-sensor)) | Cable seating; correct port type | Wrong supply or wrong port |
| I2C device "not found" | Cable clicked at both ends; correct I2C port | Address clash with onboard IMU/OLED — try the other bus | Seating, wrong port, or address clash ([Module 4.6](/phase-4-motion-and-sensing/buses-i2c-uart-and-spi)) |
| Link stutters at the event only | Antenna placement vs. [Module 5.3](/phase-5-wiring-wireless-and-the-whole-robot/conclusion-and-next-steps) rules; U.FL fully snapped | Controller battery; switch Hexa Link to a quieter channel ([Module 5.3](/phase-5-wiring-wireless-and-the-whole-robot/conclusion-and-next-steps)) | Antenna against metal / band congestion |

:::keyidea[Intermittent = mechanical]
A fault that comes and goes with bumps, turns, or arm movement is almost always a **connection**, not a component: a half-seated connector, a cracked cable, a wire flexing at a pinch point. Components fail honestly — all the way, and they stay failed. Wiggle-test the cables along that mechanism's path.
:::

:::tip[When to call the mentor]
Call immediately for: any smell of burning, a hot or swollen battery, liquid on a board, or visible board damage. Everything else — try the table first. The team's best troubleshooter is made, not born, and every fault you chase builds that skill.
:::

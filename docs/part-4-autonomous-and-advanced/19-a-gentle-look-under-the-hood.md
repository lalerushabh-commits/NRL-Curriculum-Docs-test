---
title: 19. A Gentle Look Under the Hood
sidebar_position: 4
slug: /part-4-autonomous-and-advanced/a-gentle-look-under-the-hood
---

You don't need control theory to use DriveActions — but understanding *why* it behaves the way it does will make you a better roboticist. Three ideas do most of the work.

## Deadband: ignoring the noise near zero

Sensors and joysticks are never perfectly still — they wobble slightly around zero. If a motor obeyed every tiny wobble, it would buzz and jitter. A **deadband** simply treats small values as zero. The motor driver applies one automatically, which is why a barely-touched joystick doesn't creep.

## Ramping: easing into motion

Slamming a motor from 0 to full pulls a big surge of current that can sag the battery and even reset the board (a "brownout"). **Ramping** spreads a speed change over a short time. TankDrive ramps by default; `setRampRate()` tunes how gentle it is. Lower is smoother and kinder to the battery; higher is snappier.

:::note[Why the robot sometimes resets]
A hard 0→full motor command can brown out the ESP32, which looks like the robot suddenly disconnecting ("BOT NOT CONNECTED"). Ramping is the first defense; a healthy battery and good wiring are the rest.
:::

## Closing the loop: correcting toward a target

An **open-loop** command says "spin for 400 ms" and hopes. A **closed-loop** command says "spin *until the heading reads 90°*, then stop." It measures the result and reacts. `DriveActions::turn()` does exactly this: it watches the IMU heading, eases off as it nears the target so it doesn't overshoot, and gives a tiny reverse nudge to cancel leftover momentum. That's the essence of feedback control — and why closed-loop turns land so much more reliably than timed ones.

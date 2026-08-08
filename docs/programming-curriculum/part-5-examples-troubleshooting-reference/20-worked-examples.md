---
title: "Module 5.1: Worked Examples"
sidebar_position: 1
slug: /part-5-examples-troubleshooting-reference/worked-examples
---

Your kit ships with several complete example OpModes you can select from the Controller and read as reference. Here's what each one teaches.

| Example (menu name) | Type | What it demonstrates |
| --- | --- | --- |
| Servo Sweep | TELEOP | Sweeping a servo through a set of angles on a timer; streaming positions to telemetry. |
| Motor Ramp | TELEOP | Smoothly ramping motor speed up, holding, and ramping down — the anti-brownout pattern. |
| OLED Live | TELEOP | A live IMU dashboard on the OLED (acceleration, rotation, heading), refreshed at 5 Hz. |
| AUTO Live | AUTO | A full self-driving routine: calibrate, drive, pause, and a closed-loop IMU turn. |

Read it as three regions you already know: **hardware** declared at file scope, **`init()`** calling `begin()` on everything, and **`loop()`** doing the driving plus two edge-detected toggles. Change the servo angles, swap the buttons, and re-upload — that fast edit-and-run cycle is how you'll learn.

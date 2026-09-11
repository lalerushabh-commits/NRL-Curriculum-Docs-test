---
title: "Module 5.4: Lights, Screens & Telemetry"
sidebar_position: 4
slug: /phase-5-wiring-wireless-and-the-whole-robot/lights-screens-and-telemetry
---

The robot never stops talking about its own health. This module teaches you its language.

## The instrument panel

| Instrument | Where | It tells you |
| --- | --- | --- |
| RGB status LED | Hub | Robot mode and connection state, in colour, across the field |
| 1.3″ OLED | Hub | Team name, pairing status, and live values at the robot |
| 2.4″ TFT screen | Controller | Menus, match state, link status, and streamed **telemetry** from the robot |
| RGB LED | Controller | Connection and alert states at a glance |
| Buzzers | Both | Alerts you can hear with your eyes on the field |

:::note[Photo coming soon]
Controller TFT showing a telemetry screen: battery voltage, currents, link status. A telemetry dashboard: the robot's vital signs, streamed live over Hexa Link. Ask your programmers to keep battery voltage and current readings on it — those numbers are Modules 3.1–4.3 come to life.
:::

## Clean presses — a hardware aside

When you press any button on the Controller, its metal contacts actually **bounce** — connecting and disconnecting several times in a few milliseconds before settling. The brain is fast enough to mistake one press for five. So every HEXA button carries a small **debounce** circuit — a resistor and capacitor that smooth the flurry into one clean press. You get crisp inputs; your programmers get clean signals; nobody has to think about it. That is good hardware design.

## The 60-second health read

Before every practice run, read the panel in order: **(1)** boards power up, screens alive → **(2)** Hub OLED shows paired → **(3)** Controller TFT shows the link healthy → **(4)** telemetry battery voltage ≥ healthy → **(5)** idle current small and steady → **(6)** brief joystick wiggle moves the right wheels the right way. Sixty seconds, no tools, and you have verified most of this book. [Module 5.6](/phase-5-wiring-wireless-and-the-whole-robot/conclusion-and-next-steps) grows this habit into the formal inspection.

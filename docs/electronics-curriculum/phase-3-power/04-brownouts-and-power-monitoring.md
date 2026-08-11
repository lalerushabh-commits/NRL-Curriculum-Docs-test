---
title: "Module 3.4: Brownouts & Power Monitoring"
sidebar_position: 4
slug: /phase-3-power/brownouts-and-power-monitoring
---

Why robots reboot mid-match — and how yours warns you before it happens.

## What a brownout is

Ask several motors to accelerate at once and they gulp current. Every gulp drags the battery voltage down for a moment — that dip is called **sag**. If the voltage sags low enough, the regulators can no longer hold up the 3.3 V rail, and the brain **resets**: screen blanks, link drops, robot freezes for a few seconds, then wakes up confused. That is a **brownout** — and to a driver it looks exactly like "the code crashed."

The usual suspects, in order: a tired or under-charged battery, a loose or half-seated XT30, and motors stalling against an obstacle while the driver keeps pushing.

## How the Hub watches its own power

The Hub carries real measuring instruments, wired into its own analog system. Here is the actual arrangement — worth knowing, because it explains what the telemetry numbers are and where they come from:

- **Two ACS712 current sensors.** One measures the current flowing on the **12 V battery input** (everything the robot draws); the other measures the current on the **servo power rail** (what your servos are drawing). An ACS712 senses current by the tiny magnetic field it creates and outputs a voltage proportional to the flow.
- **Battery voltage sensing.** The battery's ~12 V is far above what the measuring circuit accepts, so a **voltage divider** — two resistors that scale a voltage down by a fixed ratio — shrinks it to a safe, measurable level. The brain multiplies back up to display the true pack voltage.
- **One ADC chip reads them all.** The two current sensors and the voltage divider connect to channels 1, 2, and 3 of the Hub's **MCP3008** analog-to-digital converter ([Module 4.5](/phase-4-motion-and-sensing/analog-and-digital-signals)). The remaining five channels are yours — they are the **Analog Ports A3–A7** on the board's edge.
- **The Controller monitors itself differently:** it uses an **INA219** power-monitor chip that reports its battery's voltage and current digitally over I2C ([Module 4.6](/phase-4-motion-and-sensing/buses-i2c-uart-and-spi)).

Your programmers can stream all of it to the Controller screen as telemetry, which turns you into a pit engineer:

| What you watch | Healthy looks like | Trouble looks like |
| --- | --- | --- |
| Battery voltage at rest | ~12 V or higher, steady | Below ~11 V before you even drive — charge or swap the pack |
| Voltage while driving | Small dips that recover instantly | Deep sag on every acceleration — tired pack or a loose power connector |
| Battery current, robot idle | Small and steady | A large constant draw at rest — something is stalled, jammed, or shorted |
| Servo rail current | Brief rises as servos move | Pinned high with a buzzing servo — a servo is straining against a stop ([Module 4.2](/phase-4-motion-and-sensing/servos)) |

:::warning["The code keeps crashing"]
When a robot resets only during hard driving, suspect power before programming. Check the battery voltage telemetry, the XT30 seating, and the pack on the battery checker — in team robotics, the mysterious mid-match reboot is a brownout until proven otherwise.
:::

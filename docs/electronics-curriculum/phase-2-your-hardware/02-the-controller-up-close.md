---
title: "Module 2.2: The Controller, Up Close"
sidebar_position: 2
slug: /phase-2-your-hardware/the-controller-up-close
---

It looks like a game controller. It is actually a complete embedded computer — with its own battery, screen, and radio.

The **HEXA Controller** is not a simple remote. It carries the same family of brain as the Hub — an **ESP32-S3-WROOM-1U (N8R8)** — plus its own battery system, a colour TFT display, an onboard IMU, and a full set of driver inputs. Treat it with the same respect as the robot itself.

![The Controller, face on: TFT screen top-centre, two joysticks, buttons left and right, toggles on the shoulders.](/img/electronics/phase2-controller-face-on.png)

*The Controller, face on: TFT screen top-centre, two joysticks, buttons left and right, toggles on the shoulders.*

![From the side: shoulder buttons at 90° for trigger-style control, with the power switch, charging jack, and USB-C along the top edge.](/img/electronics/phase2-controller-side.png)

*From the side: shoulder buttons at 90° for trigger-style control, with the power switch, charging jack, and USB-C along the top edge.*

## Driver inputs

- **Two analog joysticks** — each stick gives two smooth analog axes for precise driving.
- **Seven tactile buttons** plus **two toggle switches** for modes, and **two shoulder buttons** mounted at 90° for trigger-style control.

## Feedback to the driver

- **2.4″ colour TFT display** — the driver's dashboard: program menu, match state, and live telemetry streamed from the robot.
- **RGB status LED and buzzer** — connection and alert signals you can catch without looking down.

## Under the shell

Inside are **two 18650 Li-ion cells** with their own battery-management system (BMS), and an **onboard IMU** — the same motion sensor family as the Hub's ([Module 4.7](/phase-4-motion-and-sensing/the-imu)). The Controller charges through its **DC jack** using the **12 V 1 A controller charger**, switches on with a real power switch, and monitors its own battery voltage — so the screen can warn you before a dead controller ends your match. Every battery rule you learn in Phase 3 applies to the Controller too.

:::tip[Charge both, always]
Teams obsess over the robot battery and forget the Controller. Make it one habit: when the robot pack goes on charge after practice, the Controller goes on its own charger beside it — and the lanyard goes on your neck before the Controller leaves the table.
:::

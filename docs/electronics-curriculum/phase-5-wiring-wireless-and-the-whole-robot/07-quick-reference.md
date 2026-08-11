---
title: "Module 5.7: Quick Reference"
sidebar_position: 7
slug: /phase-5-wiring-wireless-and-the-whole-robot/quick-reference
---

The whole book at a glance — for the pit wall.

## Hub ports at a glance

| Port | Connector | Pins | Connects |
| --- | --- | --- | --- |
| Power IN | XT30 | + / − | Battery via main switch harness |
| Power OUT | XT30 | + / − | Motor driver power (XT30 F-F cable) |
| Motor Driver | JST-XH 6-pin | DIR1 · GND · PWM1 · DIR2 · GND · PWM2 | Motor driver signal |
| Servo S1–S4 | 3-pin header | GND · S+ · SIG | Servos (dedicated servo rail) |
| Digital Ports × 3 | JST-XH 3-pin | GND · Dx · 5V | Switches, simple sensors |
| Extra Digital IO 1–2 | JST-XH 4-pin | 3.3V · GND · 2 signals | ARC-8 IR sensor, expansion devices |
| Analog A3–A7 | JST-XH 3-pin | GND · Ax · 5V | Analog sensors → MCP3008 ADC |
| I2C0 × 1 / I2C1 × 1 | JST-XH 4-pin | SDA · SCL · GND · 3.3V | Smart sensors (IMU shares I2C0, OLED shares I2C1) |
| UART | JST-XH 4-pin | RX · TX · GND · 3.3V | HuskyLens, R-Pi, co-processor |

## Battery card

| Item | Value |
| --- | --- |
| Robot pack | 3S Li-ion, 2200 mAh, 10C, BMS with cell balancing; XT30 out, DC jack in |
| Full / nominal / low | ~12.6 V / 11.1 V / ~10 V — swap or charge below the healthy zone |
| Robot pack charger | **15 V 1 A**, via the pack's DC jack — attended, in the charging area |
| Controller charger | **12 V 1 A**, via the Controller's DC jack — label both chargers! |
| Battery checker | Plugs onto the pack's XT30; instant voltage readout — check every pack, every match day |
| Storage | ~half charge for breaks over a week |

## The five reflexes

1. Voltage is the fuel gauge — glance at it constantly.
2. Check every device's voltage before connecting — ports live in different voltage worlds.
3. Look · Seat · Tug on every connector.
4. Power first when anything misbehaves — and the battery checker answers in five seconds.
5. Intermittent means a connection, not a component.

---
title: "Module 2.1: The Command Hub, Up Close"
sidebar_position: 1
slug: /phase-2-your-hardware/the-command-hub-up-close
---

One board runs the whole robot. Here is every port, light, and button on it — and what each one is for.

The **HEXA Command Hub** is the robot's brain. At its centre sits an **ESP32-S3-WROOM-1U (N8R8)** microcontroller module — a small computer with built-in 2.4 GHz radio that uses an **external antenna** ([Module 5.3](/phase-5-wiring-wireless-and-the-whole-robot/hexa-link-and-the-antenna)). Around that module, the Hub provides power regulation, motor and servo control, sensor ports, and self-monitoring.

![Your map of the Hub, top view. Every port in the tables below is here — match each one against the white silkscreen labels printed on your real board, which always have the final word.](/img/electronics/phase2-command-hub-top-view.png)

*Your map of the Hub, top view. Every port in the tables below is here — match each one against the white silkscreen labels printed on your real board, which always have the final word.*

## The power section

| Element | What it does |
| --- | --- |
| **XT30 Power IN** | Where the 12 V battery connects, through the main switch cable. Yellow, keyed, impossible to reverse. |
| **XT30 Power OUT** | A direct 12 V passthrough that feeds the motor driver. |
| **Voltage regulators** | Create clean, steady supplies from the battery: a dedicated **servo power rail**, a **5 V** rail, and a **3.3 V** rail for the brain and sensors. |
| **Current & voltage sensing** | Two onboard current sensors and battery-voltage sensing let the Hub watch its own power health ([Module 3.4](/phase-3-power/brownouts-and-power-monitoring)). |

## The control ports

| Port | Connector | What plugs in |
| --- | --- | --- |
| Motor Driver | 6-pin JST-XH (DIR1 \| GND \| PWM1 \| DIR2 \| GND \| PWM2) | The signal cable to the motor driver — direction + speed for two motors |
| Servo 1–4 (S1–S4) | 3-pin headers (GND \| S+ \| SIG) | Up to four servos, powered from the dedicated servo rail |
| Digital Ports × 3 | 3-pin JST-XH (GND \| Dx \| 5V) | Simple on/off sensors: touch switches, limit switches |
| Extra Digital IO Port 1–2 | 4-pin JST-XH (3.3V \| GND \| two signal pins) | Expansion digital devices — used to connect the ARC-8 IR sensor ([Module 4.8](/phase-4-motion-and-sensing/the-arc-8-line-sensor)) |
| Analog Ports × 5 (A3–A7) | 3-pin JST-XH (GND \| Ax \| 5V) | Sensors that answer with a varying voltage, read by the onboard ADC ([Module 4.5](/phase-4-motion-and-sensing/analog-and-digital-signals)) |
| I2C0 × 1, I2C1 × 1 | 4-pin JST-XH (SDA \| SCL \| GND \| 3.3V) | Smart sensors that share a bus: distance, colour, and more ([Module 4.6](/phase-4-motion-and-sensing/buses-i2c-uart-and-spi)) |
| UART | 4-pin JST-XH (RX \| TX \| GND \| 3.3V) | One smart serial device: a HuskyLens camera, a Raspberry Pi, etc. |

## Onboard peripherals

- **1.3″ OLED display** — the robot's own status screen: team name, pairing state, battery, and live values.
- **6-axis IMU** — a motion sensor that feels tilt and rotation ([Module 4.7](/phase-4-motion-and-sensing/the-imu)).
- **RGB status LED** — one bright, programmable light that shows the robot's mode at a glance.
- **Buzzer** — beeps for alerts you can hear without looking.
- **User button** — used to pair the Hub with the Controller (enabling Hexa Link).
- **Two USB-C ports** — one for programming, one for live data to a computer. They are not interchangeable; the silkscreen tells them apart.
- **Boot & Reset buttons** — used during flashing (the Programming book) and to restart the board.

:::note[Photo coming soon]
Close-up: OLED display showing pairing screen; RGB LED lit. The Hub's OLED and status LED — your first stop when checking robot health.
:::

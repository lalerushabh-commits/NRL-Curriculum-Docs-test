---
title: "Module 4.7: The IMU — The Robot's Inner Ear"
sidebar_position: 7
slug: /phase-4-motion-and-sensing/the-imu
---

Built into both boards is a sensor that feels every tilt and turn — no wiring required.

The Hub carries an onboard **6-axis IMU** (inertial measurement unit) — the same kind of chip that tells your phone which way is up. Six axes means two sensors in one package:

- **Accelerometer (3 axes):** feels acceleration — including gravity, which is how it knows *tilt*. Robot climbing a ramp? The IMU feels the slope.
- **Gyroscope (3 axes):** feels rotation speed around each axis — which, tracked over time, gives the robot its **heading**: which way it is facing.

The exact chip is the **LSM6DSOXTR**, a precision 6-axis IMU whose accelerometer can measure up to ±16 g and whose gyroscope tracks rotation up to 2000° per second — far beyond anything your robot will ever do, which is exactly what you want from an instrument. Two facts about it matter to you as the hardware person:

- **It is an I2C device**, internally connected to the **I2C0 bus** — on the Command Hub *and* on the Controller, which carries the same IMU. That is why [Module 4.6](/phase-4-motion-and-sensing/buses-i2c-uart-and-spi) warned about address clashes on I2C0.
- **It measures the board's motion**, not the robot's intentions — so how the Hub is mounted matters.

Heading is the star. It is what lets an autonomous robot make a true 90° turn and drive genuinely straight — the Programming book builds whole chapters on it.

:::tip[Mount flat, mount firm]
Bolt the Hub flat and square on the chassis, through proper mounts — not on foam tape, not at a jaunty angle. A tilted Hub gives tilted readings; a vibrating Hub gives noisy ones. If autonomous turns drift, mention the Hub's mounting before anyone blames the code — and let programmers run their IMU calibration with the robot **perfectly still**.
:::

:::note[Photo coming soon]
Hands tilting the Hub while the OLED / telemetry shows roll, pitch, yaw values changing. Try it: with a mentor's demo program running, tilt the Hub and watch roll, pitch, and yaw respond live. Thirty seconds of play beats a page of definitions.
:::

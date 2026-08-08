---
title: "Module 3.5: The Motion Sensor (IMU) & Heading"
sidebar_position: 5
slug: /part-3-programming-the-robot/motion-sensor-imu-heading
---

import ApiTable from '@site/src/components/ApiTable';

The robot carries an **IMU** (Inertial Measurement Unit) — a chip that senses acceleration and rotation. Its most useful output for us is **heading**: which way the robot is pointing, in degrees. Heading is what makes precise autonomous turns possible ([Module 4.3](/part-4-autonomous-and-advanced/precise-motion-with-driveactions)).

## Two ways to use it

For **autonomous turns**, you usually don't touch the IMU class directly at all — the framework already tracks heading for you, and you read it through `NRLComms`:

```cpp
float hdg = NRLComms::getHeading();       // current heading in degrees
NRLComms::zeroHeading();                  // call this "0 degrees, starting now"
bool ready = NRLComms::isHeadingReady();  // has calibration finished?
```

For **reading raw motion** (acceleration, rotation rate, temperature) yourself — say to build a tilt-controlled program or a live dashboard — declare your own `HexaIMU`:

```cpp
static HexaIMU imu{ hexaImuConfig() }; // uses the onboard IMU by default

// in init(): imu.begin();
// in loop():
imu.tick(millis());
imu.read();
// float az = imu.getAccelZ();
// float gz = imu.getGyroZ();
```

## The methods you'll use

<ApiTable rows={[
  {member: 'begin()', description: 'Starts the IMU. Safe to call in init().'},
  {member: 'tick(millis())', description: "Call every loop() — drives the non-blocking heading calibration and integration."},
  {member: 'read()', description: 'Grabs a fresh snapshot; call before the get... methods.'},
  {member: 'getAccelX/Y/Z()', description: 'Acceleration in m/s² (Z ≈ 9.81 when flat).'},
  {member: 'getGyroX/Y/Z()', description: 'Rotation rate in rad/s.'},
  {member: 'getHeading() / isHeadingReady()', description: 'Integrated heading in degrees, and whether calibration is done.'},
  {member: 'zeroHeading()', description: 'Resets the heading angle to 0 (keeps the calibration).'},
]} />

:::warning[Never calibrate by blocking in init()]
The IMU needs about half a second of the robot held **still** to learn its zero point. Do **not** try to do this with a `delay()` inside `init()` — `init()` runs in a time-sensitive part of the framework, and blocking it can make your OpMode abort right after INIT.

Instead, call `imu.tick(millis())` every pass of `loop()`. Calibration spreads itself painlessly across the first ~50 passes. Just keep the robot still for the first half-second after START.
:::

:::note[Heading drift]
An IMU-only heading slowly drifts over time (there's no compass to correct it). That's fine for the short, sharp turns in a match. Zero it right before a turn for best accuracy.
:::

---
title: 7. Motors
sidebar_position: 1
slug: /part-3-programming-the-robot/motors
---

import ApiTable from '@site/src/components/ApiTable';

A DC motor is what spins your wheels. The `HexaDCMotor` class controls one motor's **direction** and **speed** through a driver on the board.

## Declaring a motor

```cpp
static HexaDCMotor leftMotor{{ .dirPin = MOTOR_L_DIR, .pwmPin = MOTOR_L_PWM }};
```

The double braces hold the motor's configuration. Each motor needs two pins — a **direction** pin and a **speed (PWM)** pin — and you name them with the `BoardPins.h` constants. An optional `.flipped = true` reverses the motor in software, which is handy when a motor is mounted backwards on the frame.

## The methods

<ApiTable rows={[
  {member: 'begin()', description: 'Initializes the motor. Call once in init().'},
  {member: 'setSpeed(int speed)', description: 'Sets speed from -255 (full reverse) to +255 (full forward). 0 = coast. Values outside the range are clamped.'},
  {member: 'getSpeed()', description: 'Returns the last speed you commanded.'},
  {member: 'stop()', description: 'Stops the motor (same as setSpeed(0)).'},
  {member: 'setFlipped(bool)', description: 'Reverses direction in software, effective immediately.'},
]} />

:::note[Why -255 to 255?]
The speed is an 8-bit value: 255 distinct steps in each direction. Negative means reverse, positive means forward, and the magnitude is how hard it drives. A tiny deadband near zero is applied automatically so noise doesn't make the motor stutter.
:::

## A complete motor OpMode

This program ramps both motors smoothly up to speed and back down — a good pattern that avoids the current spike (and wheel slip) of slamming from 0 to full.

```cpp
#include "NRL.h"

static HexaDCMotor leftMotor{{ .dirPin = MOTOR_L_DIR, .pwmPin = MOTOR_L_PWM }};
static HexaDCMotor rightMotor{{ .dirPin = MOTOR_R_DIR, .pwmPin = MOTOR_R_PWM, .flipped = true }};

class MotorRamp : public NRLOpMode {
  int _speed = 0;

public:
  void init() override {
    leftMotor.begin();
    rightMotor.begin();
  }

  void loop() override {
    if (_speed < 220) _speed += 5; // creep up 5 units each pass
    leftMotor.setSpeed(_speed);
    rightMotor.setSpeed(_speed);
    telemetry.addData("speed", (float)_speed);
  }

  void stop() override {
    leftMotor.setSpeed(0);
    rightMotor.setSpeed(0);
  }
};

REGISTER_OPMODE(MotorRamp, "Motor Ramp", TELEOP);
```

:::warning[Common motor mistakes]
**Forgetting `begin()`** in `init()` — the motor will silently do nothing.

**Forgetting to stop** in `stop()` — the robot keeps rolling after the match ends.
:::

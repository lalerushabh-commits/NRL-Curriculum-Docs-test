---
title: "Module 3.3: Servos"
sidebar_position: 3
slug: /part-3-programming-the-robot/servos
---

import ApiTable from '@site/src/components/ApiTable';

A servo motor moves to a specific **angle** and holds it — perfect for arms, grippers, and claws. The `HexaServo` class drives one servo, in degrees from 0 to 180.

## Declaring a servo

```cpp
static HexaServo arm{{ .signalPin = SERVO_1, .startAngle = 90.0f, .settleMs = 0 }};
```

<ApiTable rows={[
  {member: '.signalPin', description: 'Which servo port: SERVO_1 ... SERVO_4.'},
  {member: '.startAngle', description: "Where the servo moves to when begin() runs. Default 90° (center)."},
  {member: '.settleMs', description: '0 (default) = hold the angle forever. A positive value auto-releases the servo after that many idle milliseconds.'},
  {member: '.offsetDeg', description: 'A calibration nudge if the servo horn is slightly misaligned.'},
  {member: '.minAngle / .maxAngle', description: 'Software travel limits, if you need to protect a mechanism.'},
]} />

## The methods

<ApiTable rows={[
  {member: 'begin()', description: 'Initializes the servo and moves it to startAngle. Call in init().'},
  {member: 'setPosition(float deg)', description: 'Moves to an absolute angle, 0-180°.'},
  {member: 'moveBy(float deg)', description: 'Moves relative to the current angle.'},
  {member: 'getPosition()', description: 'Returns the current angle.'},
  {member: 'setRampRate(float degPerSec)', description: 'Limits how fast the servo swings. Call before the first setPosition().'},
  {member: 'detach() / attach()', description: 'Release / re-engage the servo (a detached servo goes limp).'},
]} />

:::note[settleMs = 0 means "hold"]
With `.settleMs = 0`, the servo keeps its signal and firmly holds its commanded angle — which is what you usually want for an arm. This relies on a clean servo power supply; if a servo buzzes at rest on a weak battery, that's a power issue (see [Module 5.2](/part-5-examples-troubleshooting-reference/common-mistakes-and-troubleshooting)), not a code bug.
:::

## A complete servo OpMode

This sweeps an arm servo between two poses on a button, using edge detection so one press = one toggle (the pattern is explained fully in [Module 3.4](/part-3-programming-the-robot/the-gamepad)).

```cpp
#include "NRL.h"

static HexaServo arm{{ .signalPin = SERVO_1, .startAngle = 90.0f, .settleMs = 0 }};

class ArmToggle : public NRLOpMode {
public:
  void init() override {
    arm.begin();
  }

  void loop() override {
    arm.setPosition(90);
    telemetry.addData("arm", arm.getPosition());
  }

  void stop() override {
    arm.detach(); // let the servo relax
  }
};

REGISTER_OPMODE(ArmToggle, "Arm Toggle", TELEOP);
```

:::warning[Servo watch-outs]
**Angles are 0-180.** Asking for 200° just clamps to 180.

**Call `begin()` in `init()`,** or the servo won't move.
:::

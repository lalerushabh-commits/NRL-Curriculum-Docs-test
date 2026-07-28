---
title: 18. Precise Motion with DriveActions
sidebar_position: 3
slug: /part-4-autonomous-and-advanced/precise-motion-with-driveactions
---

import ApiTable from '@site/src/components/ApiTable';

Turning "about 90 degrees" by spinning the motors for a guessed number of milliseconds is unreliable — battery level, floor friction, and wear all change the result. **`DriveActions`** solves this by using the IMU: it turns until the robot has *actually* rotated the requested angle. This is called **closed-loop** control (the sensor closes the loop between command and result).

## Declaring DriveActions

It builds on your TankDrive, so it comes after it:

```cpp
static HexaDCMotor leftMotor{{ .dirPin = MOTOR_L_DIR, .pwmPin = MOTOR_L_PWM }};
static HexaDCMotor rightMotor{{ .dirPin = MOTOR_R_DIR, .pwmPin = MOTOR_R_PWM, .flipped = true }};
static TankDrive drive(leftMotor, rightMotor);
static DriveActions driveActions(drive);
```

## The motion primitives

Each of these returns an Action you hand to `runAction()`:

<ApiTable rows={[
  {member: 'driveActions.turn(90)', description: "Turn 90° right, relative to now (negative = left). Closed-loop on the IMU."},
  {member: 'driveActions.turnTo(180)', description: 'Turn to an absolute heading of 180° in the current frame.'},
  {member: 'driveActions.driveInches(24)', description: 'Drive ~24 inches forward (negative = reverse), fusing the IMU and a timed model.'},
  {member: 'driveActions.driveForMs(1500)', description: 'Drive forward for 1.5 s — pure open-loop time.'},
  {member: 'driveActions.waitForHeadingReady()', description: 'Wait for IMU calibration to finish before moving.'},
  {member: 'driveActions.stopAll()', description: 'Stop the drive.'},
]} />

## Chaining a whole routine

For a multi-step auto, the fluent **builder** reads like a sentence — each step runs after the previous one finishes:

```cpp
runAction(driveActions.auto_()
  .waitForHeadingReady() // let the gyro finish calibrating (hold still)
  .driveInches(24)       // forward 24 inches
  .turn(90)               // precise 90-degree right turn
  .driveInches(12)       // forward 12 inches
  .turn(-90)              // precise 90-degree left turn
  .stopAll()               // done
  .build());
```

:::note[Turns are precise; straight lines are estimated]
This robot has no wheel encoders, so straight-line distance is **open-loop**: it drives at a speed for a computed time (helped by the IMU). Tune it per robot if distances come up short or long.

**Turns are closed-loop** on the IMU heading and are far more repeatable — always prefer a `turn()` over a timed spin.
:::

:::warning[Keep the robot still at the start of AUTO]
The IMU spends about the first half-second learning its zero point. Put `waitForHeadingReady()` first in your routine and don't nudge the robot during that window, or every later turn inherits a calibration error.
:::

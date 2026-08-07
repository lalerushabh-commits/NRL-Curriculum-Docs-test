---
title: 8. Driving with TankDrive
sidebar_position: 2
slug: /part-3-programming-the-robot/driving-with-tankdrive
---

import ApiTable from '@site/src/components/ApiTable';

Controlling two motors by hand to drive straight and turn is fiddly. `TankDrive` does the math for you: you give it a **forward** amount and a **turn** amount, and it works out the correct speed for each side.

## Declaring the drive

`TankDrive` is built *from* two motors you've already declared, so it comes after them:

```cpp
static HexaDCMotor leftMotor{{ .dirPin = MOTOR_L_DIR, .pwmPin = MOTOR_L_PWM, .flipped = true }};
static HexaDCMotor rightMotor{{ .dirPin = MOTOR_R_DIR, .pwmPin = MOTOR_R_PWM }};
static TankDrive drive(leftMotor, rightMotor);
```

## The methods

<ApiTable rows={[
  {member: 'drive(float forward, float turn)', description: 'The main call. forward and turn each range -1.0 to +1.0. Positive forward drives ahead; positive turn steers right.'},
  {member: 'stop()', description: 'Stops both motors. Call in stop().'},
  {member: 'setScale(float 0..1)', description: 'Overall speed limit — great for a "slow / precision" mode toggle.'},
  {member: 'setRampRate(float)', description: 'How fast the output is allowed to change. Lower = smoother and gentler on the battery.'},
]} />

:::note[You still begin() the motors]
`TankDrive` uses the motors you declared, so you still call `leftMotor.begin()` and `rightMotor.begin()` in `init()`. `TankDrive` itself needs no `begin()`.
:::

## The everyday driving OpMode

This is the pattern you'll start almost every TeleOp with. The left joystick's up/down drives; the right joystick's left/right turns:

```cpp
void loop() override {
  drive.drive(gamepad1.leftY(), gamepad1.rightX());
}
```

Want a precision mode? Scale the whole drive down while a button is held:

```cpp
void loop() override {
  drive.setScale(gamepad1.pressed(BTN_LB) ? 0.35f : 1.0f); // slow while LB held
  drive.drive(gamepad1.leftY(), gamepad1.rightX());
}
```

:::tip[Motor mounted backwards?]
If the robot turns the wrong way or one wheel fights the other, flip one motor with `.flipped = true` in its declaration instead of re-wiring. It's a one-word fix.
:::

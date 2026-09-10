---
title: "Module 5.3: API Quick Reference"
sidebar_position: 3
slug: /part-5-examples-troubleshooting-reference/api-quick-reference
---

import ApiTable from '@site/src/components/ApiTable';

A one-page cheat-sheet for everything covered in Phase 3 and Phase 4. See each module for full explanations and worked examples.

## OpMode skeleton

```cpp
class Name : public NRLOpMode {
  void init()  override { /* begin() hardware — nothing moves yet */ }
  void start() override { /* once, when the match starts — AUTO routines go here */ }
  void loop()  override { /* every pass */ }
  void stop()  override { /* stop motors */ }
};

REGISTER_OPMODE(Name, "Menu Label", TELEOP); // or AUTO
```

`start()` is optional — TeleOp usually doesn't need it. AUTO almost always does.

## Motors — HexaDCMotor

<ApiTable rows={[
  {member: '{{ .dirPin=, .pwmPin=, .flipped= }}', description: 'Declaration config.'},
  {member: 'begin()', description: 'Init (in init()).'},
  {member: 'setSpeed(-255..255)', description: 'Set speed; 0 = coast.'},
  {member: 'getSpeed() / stop()', description: 'Read speed / stop.'},
]} />

## Drive — TankDrive

<ApiTable rows={[
  {member: 'TankDrive(left, right)', description: 'Build from two motors.'},
  {member: 'drive(forward, turn)', description: 'Each -1.0..+1.0.'},
  {member: 'stop()', description: 'Stop both.'},
  {member: 'setScale(0..1) / setRampRate(x)', description: 'Speed cap / smoothing.'},
]} />

## Servo — HexaServo

<ApiTable rows={[
  {member: '{{ .signalPin=, .startAngle=, .settleMs= }}', description: 'Declaration config.'},
  {member: 'begin()', description: 'Init + go to start angle.'},
  {member: 'setPosition(0..180) / moveBy(d)', description: 'Absolute / relative angle.'},
  {member: 'getPosition()', description: 'Read angle.'},
  {member: 'detach() / attach()', description: 'Release / re-engage.'},
]} />

## Gamepad — gamepad1

<ApiTable rows={[
  {member: 'leftY() leftX() rightX() rightY()', description: 'Axes, -1.0..+1.0.'},
  {member: 'pressed(BTN_...)', description: 'Held right now.'},
  {member: 'justPressed(BTN_...) / justReleased(BTN_...)', description: 'Edge events.'},
  {member: 'onPress(BTN_..., cb)', description: 'Bind a callback (in init()).'},
  {member: 'Buttons', description: 'BTN_X A Y · BTN_DPAD_UP/DOWN/LEFT/RIGHT · BTN_LB RB LT RT · (no B button on this board)'},
]} />

## Heading & IMU

<ApiTable rows={[
  {member: 'NRLComms::getHeading()', description: 'Heading in degrees.'},
  {member: 'NRLComms::zeroHeading()', description: 'Call current heading 0.'},
  {member: 'NRLComms::isHeadingReady()', description: 'Calibration done?'},
  {member: 'HexaIMU + tick() / read() / getAccel* / getGyro*', description: 'Raw motion access.'},
]} />

## Telemetry, LED, Power

<ApiTable rows={[
  {member: 'telemetry.addData(key, value)', description: 'Send a number or text to the Controller.'},
  {member: 'userLed.setSolid / setBlink / setPulse / setOff', description: 'Drive the status LED.'},
  {member: 'power.getBatteryVoltage() / isBatteryLow()', description: 'Battery state.'},
  {member: 'power.getMotorCurrent() / getServoCurrent() / getMainCurrent()', description: 'Rail currents.'},
]} />

## Actions & DriveActions

<ApiTable rows={[
  {member: 'runAction(a)', description: 'Add a routine to the queue (start() for AUTO, a button press for TeleOp). Adds — does not cancel what is running.'},
  {member: 'isActionRunning() / cancelActions()', description: 'Is anything queued / drop everything (does NOT stop hardware — stop it yourself).'},
  {member: 'instant, sleep_ms, wait_until, sequential, parallel, repeat', description: 'Action factories.'},
  {member: 'driveActions.turn(deg) / turnTo(h)', description: 'Closed-loop IMU turns.'},
  {member: 'driveActions.driveInches(in) / driveForMs(ms)', description: 'Straight moves.'},
  {member: 'driveActions.auto_()...build()', description: 'Chain a whole routine.'},
]} />

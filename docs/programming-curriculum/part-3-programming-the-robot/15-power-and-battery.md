---
title: "Module 3.9: Power & Battery"
sidebar_position: 9
slug: /part-3-programming-the-robot/power-and-battery
---

import ApiTable from '@site/src/components/ApiTable';

The Robot measures its own **battery voltage** and **current draw** through an onboard analog-to-digital converter. You read all of it through a ready-made object called **`power`** — no declaration, no `begin()`.

## The readings

<ApiTable rows={[
  {member: 'power.getBatteryVoltage()', description: 'Battery pack voltage, in volts.'},
  {member: 'power.isBatteryLow()', description: 'true when the pack is below the low-battery threshold.'},
  {member: 'power.getMainCurrent()', description: 'Total current from the battery, in amps.'},
  {member: 'power.getMotorCurrent()', description: 'Current on the motor rail (all motors together).'},
  {member: 'power.getServoCurrent()', description: 'Current on the servo rail (derived: main - motor).'},
  {member: 'power.readChannelVoltage(ADC_EXT_1)', description: 'Voltage on an external analog port — for your own sensors.'},
]} />

## Example: show battery health on the LED and telemetry

```cpp
void loop() override {
  float v = power.getBatteryVoltage();
  telemetry.addData("battery", v);
  telemetry.addData("motor A", power.getMotorCurrent());
  userLed.setSolid(v < 10.5f ? 255 : 0, v < 10.5f ? 0 : 60, 0);
}
```

:::warning[Trust volts more than amps at first]
The voltage reading is well-calibrated out of the box. The current readings depend on per-board sensor calibration — treat them as a *relative* health signal (rising = working harder) unless your kit has been calibrated against a meter.
:::

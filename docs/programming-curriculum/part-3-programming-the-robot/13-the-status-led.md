---
title: 13. The Status LED
sidebar_position: 7
slug: /part-3-programming-the-robot/the-status-led
---

import ApiTable from '@site/src/components/ApiTable';

The Robot has an onboard **NeoPixel** LED you can drive for your own signals — a green flash when a task finishes, red when the battery is low, and so on.

You control it through a ready-made object called **`userLed`**.

## The methods

<ApiTable rows={[
  {member: 'userLed.setSolid(r, g, b)', description: 'Steady color. Each of r, g, b is 0-255.'},
  {member: 'userLed.setBlink(r, g, b, periodMs)', description: 'Blinks on/off at the given period (default 500 ms).'},
  {member: 'userLed.setPulse(r, g, b, periodMs)', description: 'Smoothly breathes in and out (default 1000 ms).'},
  {member: 'userLed.setOff()', description: 'Turns it off.'},
]} />

:::note[userLed vs. the system LED]
There are two LED "pixels" on the same part. One (`botLed`) is owned by the framework to show pairing/run status — leave it alone. The other, **`userLed`**, is yours. Just call its methods; you don't declare or `begin()` it.
:::

## Example: battery warning light

```cpp
void loop() override {
  if (power.isBatteryLow()) userLed.setBlink(255, 0, 0, 250); // fast red blink
  else userLed.setSolid(0, 60, 0);                             // dim green
}
```

---
title: "Module 3.8: The OLED Display"
sidebar_position: 8
slug: /part-3-programming-the-robot/the-oled-display
---

import ApiTable from '@site/src/components/ApiTable';

The Robot can carry a small **OLED screen** for on-robot readouts. The `HexaOLED` class gives you a simple drawing surface — text, lines, rectangles, and circles. This is optional; most programs send data via telemetry ([Module 3.6](/part-3-programming-the-robot/telemetry)) instead, but an on-robot display is great for pit debugging.

## Declaring and drawing

Declare your own display object, `begin()` it, then draw. The golden rule: **you draw into a buffer, and nothing appears until you call `display()`.**

```cpp
#include "NRL.h"
#include <HexaOLED.h>

// hexaImuConfig() / hexaOledConfig() (from RobotConfig.h via NRL.h) pin each
// device to its correct board bus — no magic pin numbers, no wrong-bus mistakes.
static HexaIMU imu{ hexaImuConfig() };

class OledHello : public NRLOpMode {
  HexaOLED _oled{ hexaOledConfig() };
  bool _oledOk = false;

public:
  void init() override {
    _oledOk = _oled.begin();          // capture success — don't ignore it
    // telemetry.addData("oled ok", _oledOk ? 1.0f : 0.0f);
    imu.begin();
  }

  void loop() override {
    // Drive the heading engine EVERY loop: the first ~50 ticks (~0.5s, hold
    // the robot still) estimate the gyro bias, then each tick integrates
    // gyro-Z into the heading. Without this call getHeading() stays 0.
    imu.tick(millis());

    if (!_oledOk) return;             // nothing to draw if the OLED didn't start

    _oled.clearDisplay();             // wipe the buffer
    _oled.setTextSize(1);
    _oled.setTextColor(HexaOLED::WHITE);
    _oled.setCursor(0, 0);
    _oled.print("HEADING:");
    _oled.setCursor(0, 12);

    if (!imu.isHeadingReady()) {
      _oled.print("calib...");        // hold still until bias calibration finishes
    } else {
      // send heading to telemetry and also print the numeric value to the OLED
      telemetry.addData("heading", imu.getHeading());
      _oled.print(imu.getHeading(), 1); // 1 decimal place
    }

    _oled.display();                  // push buffer to the screen
  }
};

REGISTER_OPMODE(OledHello, "OLED Hello", TELEOP);
```

## The drawing toolbox

<ApiTable rows={[
  {member: 'clearDisplay()', description: 'Blanks the buffer (call first each frame).'},
  {member: 'setCursor(x, y) / setTextSize(n)', description: 'Text position and scale (1 or 2).'},
  {member: 'print(text) / print(number)', description: 'Writes text or a number at the cursor.'},
  {member: 'drawLine / drawRect / fillRect', description: 'Lines and rectangles.'},
  {member: 'drawCircle / fillCircle', description: 'Circles.'},
  {member: 'display()', description: 'Pushes everything you drew to the physical screen.'},
]} />

:::tip[Nothing showing?]
The number-one OLED mistake is forgetting `display()` — you drew a perfect frame into memory and never sent it. Also remember `clearDisplay()` at the top of each frame, or new text piles on top of the old.
:::

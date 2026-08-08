---
title: "Module 4.1: Writing an Autonomous OpMode"
sidebar_position: 1
slug: /part-4-autonomous-and-advanced/writing-an-autonomous-opmode
---

An **Autonomous** (AUTO) OpMode runs with no driver. You register it with `AUTO` instead of `TELEOP`:

```cpp
REGISTER_OPMODE(MyAuto, "My Auto", AUTO);
```

The structure is identical — `init()`, `loop()`, `stop()` — with one behavioral difference: an AUTO OpMode's `loop()` runs until an automatic **time deadline** and then ends on its own (mirroring a real match's timed autonomous period). You don't manage that timer; the framework does.

## The "run it once" pattern

Here's the trap: `loop()` runs many times a second. If you start a driving routine directly in `loop()`, you'll *restart* it dozens of times per second and the robot will twitch in place forever. You need to kick off the routine **exactly once**. Two tools do this:

- A simple `bool _started` flag you set the first time through.
- `isActionRunning()` — true while a queued routine is still going (useful for repeating cycles).

```cpp
class MyAuto : public NRLOpMode {
  bool _started = false;

public:
  void init() override {
    leftMotor.begin();
    rightMotor.begin();
  }

  void loop() override {
    telemetry.addData("heading", NRLComms::getHeading());
    if (!_started) { // fire the routine ONE time
      _started = true;
      runAction(driveActions.turn(90));
    }
  }

  void stop() override {
    drive.stop();
  }
};
```

:::keyidea[runAction queues a routine]
`runAction(...)` hands the framework a routine (an **Action**) to advance one small step on each `loop()` pass, without ever blocking. Your `loop()` stays fast and responsive.

That's why the `_started` flag matters: you want to *queue* the routine once, then let the framework step through it — not re-queue it every pass.
:::

:::warning[!isActionRunning() vs. a one-shot flag]
Guarding with `if (!isActionRunning())` restarts the routine the instant it finishes — perfect for a repeating cycle, wrong for a one-time move (the robot would turn 90°, finish, and immediately turn another 90°, forever). For a single move, use the `_started` flag.
:::

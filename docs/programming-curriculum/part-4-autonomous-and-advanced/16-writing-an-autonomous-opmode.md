---
title: "Module 4.1: Writing an Autonomous OpMode"
sidebar_position: 1
slug: /part-4-autonomous-and-advanced/writing-an-autonomous-opmode
---

An **Autonomous** (AUTO) OpMode runs with no driver. You register it with `AUTO` instead of `TELEOP`:

```cpp
REGISTER_OPMODE(MyAuto, "My Auto", AUTO);
```

An AUTO OpMode's `loop()` runs until an automatic **time deadline** and then ends on its own, mirroring a real match's timed autonomous period. You don't manage that timer; the framework does.

## The four hooks

AUTO uses one more hook than you've seen so far — `start()`. The four hooks are:

- **`init()`** — once, when INIT is pressed. Claim your hardware with `begin()`. The robot is still being lined up on the field, so nothing should move here.
- **`start()`** — once, the moment the match begins. This is where an AUTO routine goes.
- **`loop()`** — many times a second, until the deadline. In AUTO, use it to WATCH sensors, not to drive the routine.
- **`stop()`** — once, on STOP or when the period ends. Motors do NOT stop by themselves, so always stop them here.

The important one is `start()`. A routine has to be kicked off **exactly once**, and `start()` runs exactly once — so the problem solves itself:

```cpp
class MyAuto : public NRLOpMode {
public:
  void init() override {
    leftMotor.begin();
    rightMotor.begin();
  }

  void start() override {          // runs ONCE, when the match starts
    runAction(driveActions.turn(90));
  }

  void loop() override {           // runs many times a second — just watch
    telemetry.addData("heading", NRLComms::getHeading());
  }

  void stop() override {
    drive.stop();
  }
};
```

:::keyidea[start() runs once, loop() runs constantly]
`runAction(...)` hands the framework a routine (an **Action**) to advance one small step on each `loop()` pass, without ever blocking. Your `loop()` stays fast and responsive.

Put that queueing in `start()` and "once" is guaranteed by the framework — no flag to declare, reset, or forget.
:::

:::warning[Never queue a routine in loop()]
`loop()` runs many times a second. Queue a routine there and you throw it away and restart it every few milliseconds — the robot twitches in place and never reaches step two. Queue it in `start()` instead. `isActionRunning()` is for REPEATING work: guarding a one-time move with it restarts the move the instant it finishes, so the robot would turn 90°, finish, and immediately turn another 90°, forever.
:::

## Curious: what if you don't use Actions?

Actions are the recommended way to write a routine, and you can skip this section entirely. But it's worth seeing *once* what they're doing for you, because there's no magic in it.

You can't use `delay()` (it freezes STOP and the wireless link). What you can do is start a **stopwatch** and check it every pass. `millis()` gives you the number of milliseconds since the robot booted:

```cpp
uint32_t startedAt = 0;

void start() override {
  startedAt = millis();               // start the stopwatch
}

void loop() override {
  uint32_t t = millis() - startedAt;  // ms since the match began

  if      (t < 300)  gripper.setPosition(102);   // grip
  else if (t < 2300) drive.drive(0.6f, 0.0f);    // drive forward
  else if (t < 2800) { drive.stop(); arm.setPosition(95); }
  else               drive.stop();               // hold still
}
```

One variable, one subtraction, and an `if`/`else if` chain. It reads down the page like a timeline, and it needs nothing you haven't already met.

Two things make it work:

- **Re-commanding every pass is fine.** `drive.drive()` sets a command the robot *holds*, and setting a servo to the angle it's already at does nothing. So it doesn't matter that `loop()` runs the same line hundreds of times.
- **Use `millis()`, not a count of loop passes.** Counting passes assumes you know how fast `loop()` runs; `millis()` is real time, so it can't drift out of step with it.

### When the timeline gets awkward: a step counter

Look at the times above: `300`, `2300`, `2800`. They're **cumulative** — each is measured from the start of the match, not from the end of the previous step. Decide the drive should last 3 seconds instead of 2, and you have to bump every number below it by 1000.

The fix is to remember *which step you're on* and restart the stopwatch each time you move on. That's all `switch` adds here — one `case` per step:

```cpp
int      step      = 0;   // which step we are on
uint32_t stepStart = 0;   // when this step started

void start() override { step = 0; stepStart = millis(); }
void next()  { step++; stepStart = millis(); }   // go to next step

void loop() override {
  uint32_t t = millis() - stepStart;   // time spent in THIS step

  switch (step) {
    case 0: gripper.setPosition(102);  if (t > 300)  next(); break;
    case 1: drive.drive(0.6f, 0.0f);   if (t > 2000) next(); break;
    case 2: drive.stop();
            arm.setPosition(95);       if (t > 500)  next(); break;
    default: drive.stop();             break;   // finished
  }
}
```

Now each duration stands on its own — change `2000` to `3000` and nothing else moves. `next()` is the only new idea: it bumps the step and restarts the stopwatch in one go. `default:` catches everything after the last step, so the robot holds still instead of running off the end.

:::tip[Why Actions exist]
Compare the three ways of writing the same routine, by what *you* have to manage:

- **One stopwatch, `if`/`else`** — cumulative times: edit one, edit them all.
- **`switch` + step counter** — independent times, but you maintain `step`, `stepStart`, and `next()`.
- **Actions** — nothing. You just list the steps.

```cpp
runAction(sequential({
  instant([]{ gripper.setPosition(102); }),
  sleep_ms(300),
  instant([]{ drive.drive(0.6f, 0.0f); }),
  sleep_ms(2000),                 // change this one freely
  instant([]{ drive.stop(); }),
}));
```

`sleep_ms()` gives you independent durations without the step bookkeeping — it's the `switch` version's benefit with the stopwatch version's simplicity. That's the whole reason the Action system exists, so reach for Actions on real routines and keep these patterns for short autos or for when you want to see exactly what's happening.
:::

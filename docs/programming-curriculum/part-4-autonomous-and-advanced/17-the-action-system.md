---
title: "Module 4.2: The Action System"
sidebar_position: 2
slug: /part-4-autonomous-and-advanced/the-action-system
---

import ApiTable from '@site/src/components/ApiTable';

Real routines have steps: *drive forward, wait, raise the arm, turn.* The obvious way to write "wait" is `delay(1000)` — but on a robot that is a serious mistake. `delay()` **freezes the entire robot**: the wireless link stalls, the emergency STOP stops responding, sensors go unread. NRL forbids it.

:::warning[Never use delay()]
`delay()` blocks everything, including the STOP button and the wireless link. Anywhere you're tempted to "wait," use an **Action** (`sleep_ms`) instead. This is one of the most important rules in the framework.
:::

## Actions: steps that span time without blocking

An **Action** is a unit of work that can take several `loop()` passes to finish, checked a little at a time. You build routines by combining small Action "factories":

<ApiTable rows={[
  {member: "instant([]{ ... })", description: 'Run a bit of code once, immediately (set a motor, move a servo).'},
  {member: 'sleep_ms(500)', description: 'Wait 500 ms — without freezing anything.'},
  {member: "wait_until([]{ return cond; })", description: 'Wait until a condition becomes true (e.g. a sensor reading).'},
  {member: 'sequential({ a, b, c })', description: 'Do a, then b, then c — one after another.'},
  {member: 'parallel({ a, b, c })', description: 'Do a, b, and c at the same time; finish when all are done.'},
  {member: 'repeat(action)', description: 'Loop an action until the AUTO deadline or STOP.'},
]} />

## Building a sequence

Here's a routine that drives forward for two seconds, then stops — written as a sequence of steps. Notice the `[]{ ... }` bits: those are little inline functions (called *lambdas*) holding the code to run at each step.

```cpp
runAction(sequential({
  instant([]{ drive.drive(0.6f, 0.0f); }), // start driving forward
  sleep_ms(2000),                          // wait 2 s (non-blocking)
  instant([]{ drive.stop(); }),            // stop
}));
```

Want the arm to rise *while* the robot keeps driving? Use `parallel`:

```cpp
runAction(parallel({
  sequential({ // step the drive path
    instant([]{ drive.drive(0.6f, 0.0f); }),
    sleep_ms(1500),
    instant([]{ drive.stop(); }),
  }),
  instant([]{ arm.setPosition(120); }), // raise the arm at the same time
}));
```

## runAction vs. runBlocking

<ApiTable rows={[
  {member: 'runAction(a)', description: 'Queues the routine; advances one step per loop() pass. Non-blocking.', detail: 'Use in: loop() (TeleOp button presses, AUTO one-shots)'},
  {member: 'runBlocking(a)', description: 'Runs the routine to completion before returning (still checks STOP and the deadline).', detail: 'Use in: rare — only when you deliberately want to wait it out.'},
]} />

:::tip[Prefer runAction]
In almost every case you want `runAction()` inside `loop()` — it keeps the robot alive and responsive while the routine plays out. Reach for `runBlocking()` only when you truly want the routine to finish before the next line runs.
:::

---
title: "Module 3.6: Telemetry"
sidebar_position: 6
slug: /part-3-programming-the-robot/telemetry
---

**Telemetry** is how your robot sends numbers and text back to the Controller's screen while it runs — your window into what the code is thinking. It is the single most useful debugging tool you have. Every OpMode already has a `telemetry` object built in.

## Sending data

Inside `loop()`, call `telemetry.addData(key, value)` with a short label and either a number or a piece of text:

```cpp
void loop() override {
  telemetry.addData("heading", NRLComms::getHeading());   // a number
  telemetry.addData("speed", drive.getScale());            // a number
  telemetry.addData("status", _open ? "OPEN" : "SHUT");    // text
}
```

Each unique **key** becomes one line on the Controller. Sending the same key again **updates** that line instead of adding a new one, so a value like `heading` shows a single live-updating number.

## The rules

| Limit | Value |
| --- | --- |
| Maximum number of keys | 64 |
| Maximum key length | 11 characters |
| Maximum value length | 15 characters |
| When it sends | Automatically, once per `loop()` pass — you don't call anything extra. |

:::warning[Use telemetry.addData — nothing lower-level]
Always send data through `telemetry.addData(...)`. It batches and de-duplicates efficiently so it never floods the wireless link. Do **not** dig for lower-level send functions — the buffered `telemetry` object is the supported, safe way, and it clears itself automatically when the OpMode stops.
:::

:::tip[Telemetry is your debugger]
There's no console on a robot. When something misbehaves, add a `telemetry.addData(...)` for the value you suspect and watch it live on the Controller. It's faster than guessing.
:::

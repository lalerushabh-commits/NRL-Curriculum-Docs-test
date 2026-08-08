---
title: "Module 5.4: Glossary"
sidebar_position: 4
slug: /part-5-examples-troubleshooting-reference/glossary
---

| Term | Meaning |
| --- | --- |
| OpMode | One robot program — a class extending `NRLOpMode` with init/loop/stop. |
| TeleOp | A driver-controlled OpMode. |
| Autonomous (AUTO) | A self-driving OpMode that ends on a time deadline. |
| Framework | The library that runs your OpMode and hides the low-level hardware, comms, and timing. |
| ESP-NOW | The wireless protocol linking the Robot and Controller — no router needed. |
| Firmware | The compiled program running on a board. |
| Flash / Upload | Sending compiled firmware to a board over USB. |
| Pairing | Linking a specific Robot and Controller so they only talk to each other. |
| IMU | Inertial Measurement Unit — the motion sensor that provides heading. |
| Heading | The direction the robot points, in degrees, from the IMU. |
| Telemetry | Live data sent from the Robot to the Controller's screen. |
| Action | A non-blocking unit of work that can span multiple `loop()` passes. |
| Deadband | A small range near zero treated as zero to ignore sensor/stick noise. |
| Ramping | Easing a motor's speed change over time to avoid current spikes. |
| Open-loop | A command with no feedback (e.g. "spin for 400 ms"). |
| Closed-loop | A command that measures the result and corrects (e.g. "turn until heading = 90°"). |
| Brownout | A board reset caused by the battery voltage sagging under sudden load. |
| LEDC | The ESP32's hardware PWM system used to drive motors and servos. |

---
title: "Module 5.2: Common Mistakes & Troubleshooting"
sidebar_position: 2
slug: /part-5-examples-troubleshooting-reference/common-mistakes-and-troubleshooting
---

Almost every problem beginners hit is on this list. Scan the symptom column.

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Robot keeps moving after STOP | Motors not stopped in `stop()`. | Call `drive.stop()` (and any `motor.stop()`) in `stop()`. |
| Motor/servo does nothing | `begin()` not called in `init()`. | Call `begin()` on every hardware object in `init()`. |
| OpMode aborts right after INIT | Blocking (e.g. `delay()`) in `init()`. | Keep `init()` fast; move sensor bring-up/calibration into `loop()` via `tick()`. |
| Robot freezes / STOP unresponsive | A `delay()` somewhere. | Replace it with `sleep_ms(...)` inside an Action. |
| Gripper flickers on one press | Using `pressed()` for a toggle. | Use `justPressed()` for one action per press. |
| Motors/servos dead after several runs | LEDC channels exhausted over many runs. | Reboot the Robot; it's a known limit the framework resets on OpMode end. |
| Robot won't connect to Controller | Different radio channels or not paired. | Flash both boards from the *same* project; re-pair. |
| Robot resets under load | Motor inrush browning out the board. | Ramp motors (`setRampRate`), use a good battery, add bulk capacitance. |
| Autonomous turn is inaccurate | Robot moved during IMU calibration. | Hold still ~0.5 s after START; put `waitForHeadingReady()` first. |
| OpMode missing from the menu | Missing/typo'd `REGISTER_OPMODE`, or not uploaded. | Fix the register line; re-Upload and watch for SUCCESS. |

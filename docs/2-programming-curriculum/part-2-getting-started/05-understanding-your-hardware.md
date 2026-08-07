---
title: 5. Understanding Your Hardware
sidebar_position: 3
slug: /part-2-getting-started/understanding-your-hardware
---

You do not need to be an electronics expert, but knowing what plugs in where — and the *names* the code uses for each connector — makes writing programs much easier. Every pin has a friendly constant defined in a file called `BoardPins.h`, and you use those names in your code instead of raw numbers.

## The two boards

| Board | Role | What's on it |
| --- | --- | --- |
| **Robot** | Runs your OpMode; drives the robot. | Motor outputs, 4 servo ports, an IMU (motion sensor), an OLED screen, a status LED, a buzzer, a button, and power/current sensing. |
| **Controller** | Human interface; sends input wirelessly. | A color TFT screen, two joysticks, face buttons, shoulder buttons, and its own status LED. |

## Key connectors on the Robot board

These are the names you will type in your programs. Keep this table handy for Part 3.

| Constant (name in code) | Connector | Used for |
| --- | --- | --- |
| `MOTOR_L_DIR`, `MOTOR_L_PWM` | Left drive motor | The two wires that set the left motor's direction and speed. |
| `MOTOR_R_DIR`, `MOTOR_R_PWM` | Right drive motor | Same, for the right motor. |
| `SERVO_1` ... `SERVO_4` | Four servo ports | Signal pin for each servo (arms, grippers, etc.). |
| `I2C_SDA`, `I2C_SCL` | Motion-sensor bus | Connects the onboard IMU (LSM6DSOX). |
| `OLED_SDA`, `OLED_SCL` | Display bus | Connects the small OLED status screen. |
| `LED_STATUS_PIN` | Status LED | The onboard NeoPixel indicator. |
| `BUZZER_PIN` | Buzzer | A passive buzzer for beeps. |
| `BUTTON_PIN` | Button | The tactile button used for pairing. |
| `ADC_EXT_1` ... `ADC_EXT_5` | External analog ports | Read extra analog sensors through the power ADC. |

## Power and current sensing

The Robot board can measure its own **battery voltage** and how much **current** the motors and servos are drawing, through an onboard analog-to-digital converter (an MCP3008 chip). You read these through a ready-made object called `power` — no setup required. We cover it in [Chapter 15](/part-3-programming-the-robot/power-and-battery).

:::note[One current sensor per rail — not per motor]
The board has one current sensor on the motor rail and derives the servo rail from the total. So `power.getMotorCurrent()` is the current for *all* motors together, not any single motor. There is deliberately no per-motor current reading.
:::

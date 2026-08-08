---
title: "Module 2.1: Welcome to NRL"
sidebar_position: 1
slug: /part-2-getting-started/welcome-to-nrl
---

The **NRL platform** is a plug-and-play robotics kit designed for competition teams and classrooms. It is built around **two small computers** called ESP32-S3 microcontrollers:

- **The Robot** — the board bolted to your robot. It drives the motors, moves the servos, reads the sensors, and runs *your* program.
- **The Controller** — a handheld unit with a color screen, joysticks, and buttons. You use it to pick which program to run, to start and stop a match, and to drive the robot.

The two boards talk to each other **wirelessly** over a protocol called **ESP-NOW**. There is no WiFi router involved and nothing to configure on a network — the Controller sends your joystick and button presses to the Robot many times per second, and the Robot sends data back to show on the Controller's screen.

![The handheld Controller: a color screen for menus and live data, two joysticks, and a set of face and shoulder buttons.](/img/curriculum/ch01-controller.png)

*The handheld Controller: a color screen for menus and live data, two joysticks, and a set of face and shoulder buttons.*

:::keyidea[The one idea that matters most: the OpMode]
You never write the low-level code that talks to motors over wires, or that manages the wireless link, or that draws menus. The **framework** (a big library that ships with the kit) already does all of that.

Your job is to write a small class called an **OpMode** — short for *Operation Mode*. An OpMode is one complete robot behavior: "drive around with the joysticks," or "automatically drive forward and turn." You write the game logic; the framework runs it.
:::

If you have heard of **FTC** or **WPILib** (the software used in the FIRST Robotics competitions), NRL is deliberately modeled on the same idea. An NRL OpMode plays the same role as an FTC OpMode: it is the unit of code a student writes and the robot runs.

## The shape of every OpMode

Every program you write will have the same three parts. Don't worry about the exact syntax yet — just notice the shape:

```cpp
class MyProgram : public NRLOpMode {
public:
  void init() override {
    // Runs ONCE, when you press INIT. Get hardware ready here.
  }

  void loop() override {
    // Runs OVER AND OVER, many times a second, during the match.
    // Read the gamepad, drive motors, react. This is where the action is.
  }

  void stop() override {
    // Runs ONCE, when the match ends. Turn the motors off here.
  }
};

REGISTER_OPMODE(MyProgram, "My Program", TELEOP); // makes it show up on the Controller
```

That last line — `REGISTER_OPMODE(...)` — is what makes your program appear in the menu on the Controller so you can select and run it. We will unpack every piece of this in [Module 3.1](/part-3-programming-the-robot/motors).

## Two kinds of OpMode

| Type | What it is | How `loop()` behaves |
| --- | --- | --- |
| **TELEOP** | Teleoperated — a human drives with the Controller. | Runs continuously until you press STOP. |
| **AUTO** | Autonomous — the robot runs by itself, no driver. | Runs, then automatically ends at a time deadline. |

## What you will have built by the end

- A **TeleOp** program that drives your robot with the joysticks and works an arm and gripper on the shoulder buttons.
- An **Autonomous** program that drives forward and makes a precise 90° turn using the robot's motion sensor.
- Programs that read sensors, light up an LED, draw on a small screen, and stream live data back to the Controller.

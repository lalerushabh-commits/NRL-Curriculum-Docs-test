---
title: "Module 1.1: Welcome to NRL Electronics"
sidebar_position: 1
slug: /phase-1-electronics-foundations/welcome-to-nrl-electronics
---

Meet the robot's body: two smart boards, a bundle of cables, and a battery — and the single chain of events that turns a joystick push into a spinning wheel.

This book is your guide to the **hardware** of the NRL robot — the boards, the wires, the motors, the sensors, and the battery that powers it all. It is the companion to the [Programming Curriculum](/part-1-foundations/introduction-to-cpp): that book teaches you to write the robot's brain; this one teaches you to understand and care for its body. You do not need to know any programming to read this book, and you do not need any electronics background. We start from zero.

The **NRL platform** is built around **two small computers** called ESP32-S3 microcontrollers:

- **The HEXA Command Hub** — the board bolted to your robot. It receives commands, drives the motors and servos, reads the sensors, and reports the robot's health.
- **The HEXA Controller** — the handheld unit with a colour screen, two joysticks, and buttons. It is how you select programs, start and stop a match, and drive.

The two boards talk **wirelessly** over a link we call **Hexa Link**. There is no WiFi router and nothing to configure — the Controller sends your joystick and button presses to the Hub many times per second, and the Hub sends live data back to the Controller's screen.

![The HEXA Command Hub — the robot's brain. Every motor, servo, sensor, and the battery connects here.](/img/electronics/phase1-command-hub.png)

*The HEXA Command Hub — the robot's brain. Every motor, servo, sensor, and the battery connects here.*

![The HEXA Controller: a colour screen for menus and live data, two joysticks, and a set of buttons and toggles.](/img/electronics/phase1-controller.png)

*The HEXA Controller: a colour screen for menus and live data, two joysticks, and a set of buttons and toggles.*

:::keyidea[The signal chain]
Everything in this book hangs on one chain of events:

**Joystick → Controller → Hexa Link (wireless) → Command Hub → Motor Driver → Motor → Wheel.**

When your robot misbehaves, the fault is always somewhere on this chain. By the end of this book you will be able to walk the chain link by link and find it.
:::

![The signal chain — the backbone of this book.](/img/electronics/phase1-signal-chain.png)

*The signal chain — the backbone of this book.*

## Your job on the team

The Programming curriculum teaches your teammates to write the robot's behaviour. Your job is everything the code depends on: a healthy battery, solid connections, correctly placed sensors, and a wiring job that survives a whole competition day. Programmers like to say "it's probably a hardware problem." After this book, you will know whether they are right — and how to fix it when they are.

## What you will be able to do by the end

- Power the robot safely — charge, check, connect, and care for the battery like a professional.
- Connect every motor, servo, and sensor to the right port with the right cable, first try.
- Read the robot's lights, screens, and live telemetry to judge its health at a glance.
- Place the antenna and wiring so the wireless link stays rock solid in a noisy competition hall.
- Diagnose the most common electrical faults and pass a pre-match inspection with confidence.

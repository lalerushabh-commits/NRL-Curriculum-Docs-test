---
title: How to Use This Book
sidebar_position: 0
slug: /how-to-use-this-book
---

Welcome. This is the full NRL curriculum — everything you need to design, build, and program a competition robot using the **NRL platform** (the *HEXA Command Hub*), even if you've never touched CAD or written a line of code before.

It's split into three curricula that sit side by side in the sidebar, in the order a new team typically needs them:

- **1. Mechanical Curriculum** — gears, forces, simple machines, CAD in Onshape, mechanism design, manufacturing processes, and hands-on DIY practice.
- **2. Electronics Curriculum** — the hardware of the NRL robot: the Command Hub, the Controller, power, motors, sensors, wiring, and the wireless link between them.
- **3. Programming Curriculum** — installing the software, understanding the hardware, and writing driver-controlled and fully autonomous robot programs.

You don't have to do them in order relative to each other — a mechanical lead, an electronics lead, and a programming lead on the same team might work through their curriculum in parallel. Within each curriculum, though, it's built as a **path**: each phase assumes you've read the ones before it. If you're brand new, read a curriculum front to back. If you already know the basics, skim ahead to where you actually need help.

## 1. Mechanical Curriculum

| Phase | What it covers |
| --- | --- |
| **Phase 1 — Mechanical Fundamentals** | Gears and gear ratio, load/payload/forces, and a review of simple machines — levers and the wheel and axle. |
| **Phase 2 — CAD with Onshape** | Learning Onshape's interface, sketching, 3D features, and assemblies. |
| **Phase 3 — Mechanism Design & Assembly** | Spur vs. helical gears, building them in Onshape, four-bar linkages, and gear meshing assemblies. |
| **Phase 4 — Manufacturing Processes** | FDM 3D printing, laser cutting, CNC machining, injection moulding, and hand tools — how robot parts actually get made. |
| **Phase 5 — DIY (Do It Yourself)** | Dimensioned drawing sheets you model yourself in Onshape, with solution videos to check your work against. |

## 2. Electronics Curriculum

| Phase | What it covers |
| --- | --- |
| **Phase 1 — Foundations** | What electricity is, and how to "read" your robot — just enough theory to understand everything that follows. |
| **Phase 2 — Your Hardware** | A guided tour of the two boards — the Command Hub and the Controller — and the safety rules that protect you and them. |
| **Phase 3 — Power** | The battery, its two chargers, the battery checker, the main switch, and the voltage rails — how energy flows through the robot, and what happens when it doesn't. |
| **Phase 4 — Motion & Sensing** | One short module per building block: motors, servos, the motor driver, signals, buses, the IMU, and the line sensor. |
| **Phase 5 — Wiring, Wireless & the Whole Robot** | Connecting everything with the harness, the wireless link and antenna, reading the robot's lights and screens, troubleshooting, and inspection — plus a reference and glossary. |

## 3. Programming Curriculum

| Phase | What it covers |
| --- | --- |
| **Phase 1 — Foundations** | Plain C++ from scratch — no robot, no NRL framework — everything you need to read every code example in this book. |
| **Phase 2 — Getting Started** | What the robot is, then installing the tools, understanding your hardware, creating a project, pairing, flashing, and your first working program. |
| **Phase 3 — Programming the Robot** | One short module per building block: motors, driving, servos, the gamepad, the IMU, telemetry, the LED, the OLED, and power. |
| **Phase 4 — Autonomous & Advanced** | Robots that drive themselves: the action system, closed-loop turns, and a gentle look at the control ideas underneath. |
| **Phase 5 — Reference** | Worked examples, a troubleshooting guide, an API cheat-sheet, and a glossary. |

## The boxes you will see

:::note
Extra background or a definition. Helpful, but you can keep going without it.
:::

:::tip
A shortcut or good habit that will make your life easier.
:::

:::warning[Watch Out]
A common mistake or a real hazard. Read these — they save you hours of debugging.
:::

:::keyidea
A concept that the rest of the book builds on. Make sure it clicks before moving on.
:::

## What you need

- A Windows, macOS, or Linux computer with a free USB port and internet access (Onshape runs in the browser).
- A free [Onshape](https://www.onshape.com/) account, for the Mechanical Curriculum.
- An **NRL kit**: a Robot board (Command Hub) and a handheld Controller board (both are ESP32-S3 microcontrollers), a battery and chargers, a wiring harness, motors, servos, and sensors, for the Electronics and Programming Curricula.
- Curiosity. No prior CAD or programming experience is required.

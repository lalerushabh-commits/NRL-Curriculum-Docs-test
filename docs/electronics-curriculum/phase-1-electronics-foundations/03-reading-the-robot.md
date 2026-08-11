---
title: "Module 1.3: Reading the Robot"
sidebar_position: 3
slug: /phase-1-electronics-foundations/reading-the-robot
---

Block diagrams, silkscreen labels, and status lights — the three languages your hardware speaks.

Good electronics people are, above all, good **readers**. Before you plug in a single cable, learn to read the three things the robot is always telling you.

## Block diagrams

A **block diagram** shows the robot as boxes and arrows: each box is a subsystem (battery, regulator, motor driver), each arrow is power or a signal flowing between them. It hides the tiny details so you can see the story. Every module of this book opens with the relevant slice of the HEXA block diagram — by the end, you will hold the whole map in your head.

![The whole robot in one picture. Red arrows are power; dashed arrows are signals. We will zoom into every box in this diagram over the coming modules.](/img/electronics/phase1-block-diagram.png)

*The whole robot in one picture. Red arrows are power; dashed arrows are signals. We will zoom into every box in this diagram over the coming modules.*

## Silkscreen — the writing on the board

The white printing on a circuit board is called the **silkscreen**. It names every port (MOTOR DRIVER, SERVO_PORTS, I2C_0, UART, DIGITAL PORTS, ANALOG PORTS), marks pin order and polarity, and often tells you a voltage. Rule of thumb: **the board's own label outranks your memory.** When in doubt, read the silk.

:::note[Photo coming soon]
Close-up of Command Hub port rows with silkscreen labels visible. Every port is named, and every connector is keyed — if you can read this, you can wire the robot.
:::

## Lights and screens — the robot talking back

The Hub and Controller carry status LEDs, an RGB indicator, a buzzer, and screens. Together they answer the four questions you will ask most often: *Is it powered? Is it charged? Is it connected? Is it happy?* [Module 5.4](/phase-5-wiring-wireless-and-the-whole-robot/lights-screens-and-telemetry) gives you the full decoder table; for now, just know that a silent, dark robot is telling you something too.

:::tip[Photograph everything]
Before you unplug anything, take a phone photo. After you finish wiring, take another. When something stops working three weeks later, those photos are the fastest route back to "known good." Great teams keep a shared album of their robot's wiring history.
:::

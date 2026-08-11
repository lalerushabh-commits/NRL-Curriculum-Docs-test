---
title: "Module 1.2: A Five-Minute Electricity Primer"
sidebar_position: 2
slug: /phase-1-electronics-foundations/a-five-minute-electricity-primer
---

Voltage, current, resistance, and power — the four words that explain every wire on your robot.

You do not need to master electrical engineering to use this book. You need four ideas, and every one of them shows up on your robot within the next three modules.

## The water picture

Imagine electricity as water flowing through pipes. This picture is not perfect, but it is good enough to carry you through the whole season:

| Electrical idea | Water picture | Unit | On your robot |
| --- | --- | --- | --- |
| **Voltage (V)** — the push | Water pressure in the pipe | volts (V) | The battery provides about 11.1 V of "push" |
| **Current (I)** — the flow | How much water is flowing | amps (A) | A driving motor might "drink" 1–2 A; a stalled one far more |
| **Resistance (R)** — the squeeze | How narrow the pipe is | ohms (Ω) | Every component resists current a little; that's what limits the flow |
| **Power (P)** — the work | Pressure × flow = work done | watts (W) | Power is what spins wheels — and what makes things warm |

## The two little laws

Two tiny equations connect the four ideas. You will not do heavy math in this book, but knowing what these mean lets you reason about the robot:

- **Ohm's Law: V = I × R.** For a given push (voltage), a narrower pipe (more resistance) means less flow (less current). This is why a healthy motor draws a modest current, but a short circuit — nearly zero resistance — draws a huge, dangerous one.
- **Power: P = V × I.** Push times flow. A motor working hard at 11 V and 2 A is converting about 22 W into motion (and some heat). More load → more current → more power → more heat.

:::keyidea[The load decides the current]
A common fear: "our battery can deliver 22 amps — won't that fry my little sensor?" No. The battery offers a *push* (voltage); each device *draws* only the current its own resistance allows. A sensor sips milliamps from the same battery that a motor gulps amps from.

What **does** damage devices is the wrong **voltage** — too much push. That is why this book repeats one rule again and again: check the voltage a device expects before you connect it.
:::

## Series and parallel — two ways to connect

There are only two basic ways to connect electrical things, and your robot uses both:

- **Series** — end to end, like train cars. Voltages **add up**. Your battery pack is three 3.7 V cells in series: 3.7 + 3.7 + 3.7 = **11.1 V**. That is what "3S" on the battery label means.
- **Parallel** — side by side, like lanes on a highway. Every device gets the **same voltage**, and each draws its own current. All the robot's loads — motors, servos, logic — sit in parallel on the power system.

## Capacity — what "2200 mAh" means

Your battery is labelled **2200 mAh** (milliamp-hours). That is not power — it is a fuel tank. It means the pack can supply roughly 2.2 A for one hour, or 1.1 A for two hours, before it runs empty. Drive harder, and the tank drains faster. [Module 3.2](/phase-3-power/charging-checking-and-battery-care) turns these numbers into practical match planning.

:::note[Your instruments]
Many electronics courses hand you a multimeter on day one. On this team you have something better: the robot **measures itself** — the Command Hub continuously senses its own battery voltage and currents and shows them on its screens and telemetry ([Module 3.4](/phase-3-power/brownouts-and-power-monitoring)) — plus one pocket instrument, the **battery checker** ([Module 3.2](/phase-3-power/charging-checking-and-battery-care)), which reads any pack's voltage the moment you plug it in.
:::

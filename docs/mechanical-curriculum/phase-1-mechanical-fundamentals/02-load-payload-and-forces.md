---
title: "Module 1.2: Load, Payload & Forces"
sidebar_position: 2
slug: /phase-1-mechanical-fundamentals/load-payload-and-forces
---

## What is Force?

Force is a push or pull that can change the motion or shape of an object.

**Formula**: F = m × a **SI Unit**: Newton (N)

**Example**: A 5 kg robot accelerating at 2 m/s² requires 10 N of force.

**Types of force**: Push, Pull, Gravity, Friction, Magnetic, Spring, Air Resistance.

![A push or pull force acting on an object.](/img/mechanical/phase1-force.png)

## What is Load?

Load is anything the robot must move, carry, lift, pull, or push against.

**Formula**: L = m × g **SI Unit**: Newton (N)

- **Dead Load**: Permanent parts.
- **Live Load**: Temporary objects.
- **Static Load**: Weight that does not move (robot sitting on a ramp).
- **Dynamic Load**: Extra force during motion, braking, impacts, or acceleration.

## What is Payload?

Payload is the maximum safe weight a robot can carry or lift.

**Example**: Robot = 12 kg, maximum object = 4 kg, payload = 4 kg.

:::warning[Exceeding payload]
Exceeding payload can overload motors, gears and batteries.
:::

## Centre of Gravity

The center of gravity is the theoretical point where the entire weight of an object or body is considered to act.

Tall, narrow robots are easier to tip. Wide, low robots are more stable. Lower the CoG by placing heavy components low and widening the wheelbase.

![The center of gravity affects how stable a robot is.](/img/mechanical/phase1-centre-of-gravity.png)

## Safety Factor

**Formula**: Safety Factor = Maximum Safe Load ÷ Expected Load.

**Example**: Expected load = 5 kg, designed for 15 kg, Safety Factor = 3.

:::tip
Robots commonly use a safety factor of 2–3.
:::

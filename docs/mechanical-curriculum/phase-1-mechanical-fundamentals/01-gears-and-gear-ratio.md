---
title: "Module 1.1: Gears & Gear Ratio"
sidebar_position: 1
slug: /phase-1-mechanical-fundamentals/gears-and-gear-ratio
---

## What is a Gear?

A gear is a rotating mechanical component with specially shaped teeth cut around its outer edge. When two gears mesh, the teeth lock together and transfer motion and power without slipping. Gears are used in automobiles, bicycles, clocks, robots, industrial machines, and household appliances.

## Parts of a Gear

**Teeth**: Transfer motion, prevent slipping, ensure smooth rotation, determine gear ratio.

More teeth → larger gear, lower speed, higher torque. Fewer teeth → smaller gear, higher speed, lower torque.

## How Do Gears Rotate?

When two gears touch, one rotates clockwise while the other rotates counter-clockwise. Every pair of meshing gears rotates in opposite directions. Adding another gear reverses the direction again.

![Two meshing gears rotating in opposite directions.](/img/mechanical/phase1-gear-rotation.jpg)

## Driver Gear and Driven Gear

**Driver Gear**: Connected directly to the motor, engine, pedals, or hand crank. It supplies the input power.

**Driven Gear**: Receives power from the driver gear and delivers it to the output.

Motor → Driver Gear → Driven Gear → Output

:::note[Real-Life Example]
A robot motor drives a 12-tooth gear that meshes with a 36-tooth gear attached to the wheel. The 12T gear is the driver and the 36T gear is the driven gear.
:::

## Basic Working Principle

When two gears mesh, the teeth contact each other at the **pitch point**. The rotational motion of the driving gear causes its teeth to push against the teeth of the driven gear.

For two gears:

- **Driver gear** → receives power from the motor
- **Driven gear** → receives motion and torque from the driver

The fundamental relationship is:

**N₁ × T₁ = N₂ × T₂**

where:

- N = rotational speed
- T = number of teeth

Therefore:

**N₁ ÷ N₂ = T₂ ÷ T₁**

:::keyidea[The ratio of teeth controls the ratio of speeds]
This means that the speed ratio is controlled by the ratio of the number of teeth.
:::

## What is Gear Ratio?

Gear ratio tells us how many times the driver gear must rotate for the driven gear to rotate once.

**Formula**: Gear Ratio = Number of Teeth on Driven Gear ÷ Number of Teeth on Driver Gear

- Example 1: 10T → 40T = 4:1
- Example 2: 20T → 20T = 1:1
- Example 3: 40T → 10T = 1:4 (speed increase)

Gear ratio is one of the most important concepts when designing a drivetrain or mechanism.

For a simple gear pair:

**Gear Ratio = T(driver) ÷ T(driven)**

Suppose a motor drives a **20-tooth gear**, which meshes with a **60-tooth gear**.

Gear Ratio = 20 ÷ 60 = **3:1** — this is a **3:1 reduction**.

![Working through a 3:1 gear ratio example: a 20-tooth driver meshing with a 60-tooth driven gear.](/img/mechanical/phase1-gear-ratio-example.jpg)

If the motor rotates at 3000 RPM:

N(out) = 3000 × (20 ÷ 60) = **1000 RPM**

So the output speed decreases by three times. Ideally, torque increases by approximately three times: T(out) ≈ 3 × T(in).

:::note[Real gearboxes aren't perfectly ideal]
In a real gearbox, torque will be slightly lower than the ideal ratio predicts, because of friction and other losses.
:::

## Relationship Between Teeth and Speed

- Small driver + large driven = lower speed, higher torque.
- Large driver + small driven = higher speed, lower torque.
- Same size gears = same speed and torque.

## Speed and Torque

Speed is measured in RPM (Revolutions Per Minute). Torque is the turning force. Increasing torque generally decreases speed and vice versa.

![The speed-torque trade-off: gearing down increases torque at the cost of speed.](/img/mechanical/phase1-speed-and-torque.jpg)

## Types of Gears

### Spur Gear

Spur gears have **straight teeth parallel to the shaft axis**. They are used for parallel shafts, simple gearboxes, robotics, and low-to-moderate speed applications.

![A spur gear, with straight teeth parallel to the shaft.](/img/mechanical/phase1-spur-gear-type.jpg)

**Advantages**: Simple manufacturing, high efficiency, easy to design, low cost.

**Limitation**: The teeth engage suddenly across their width, which can produce noise and vibration at higher speeds.

### Helical Gear

Helical gears have teeth cut at an **angle to the shaft axis**. The angled teeth allow gradual tooth engagement, producing smoother operation, lower noise, higher load-carrying capability, and better performance at high speed. However, helical gears produce an **axial thrust force**, so the shaft and bearing arrangement must account for this.

![A helical gear, with teeth cut at an angle to the shaft axis.](/img/mechanical/phase1-helical-gear-type.jpg)

### Bevel Gear

Bevel gears are generally used when the shafts **intersect**, commonly at 90°. They can change the direction of rotational motion. Applications include differential systems, right-angle drives, machinery, and automotive systems.

![A bevel gear pair, used where shafts intersect.](/img/mechanical/phase1-bevel-gear-type.jpg)

### Worm Gear

A worm gear system consists of a **worm** and a **worm wheel**. It is commonly used for large speed reduction.

**Advantages**: High reduction ratio, compact arrangement, ability to change rotational direction by 90°. Depending on geometry and friction conditions, some worm drives can also provide a degree of back-driving resistance.

Applications include lifting mechanisms, actuators, steering systems, and positioning mechanisms.

![A worm gear system: a worm meshing with a worm wheel.](/img/mechanical/phase1-worm-gear-type.jpg)

### Rack and Pinion

A rack and pinion converts **rotary motion into linear motion**. The pinion is a circular gear, while the rack is a straight toothed component. A major application is automotive steering, where rotation of the steering input is converted into linear movement of the steering rack.

![A rack and pinion, converting rotary motion into linear motion.](/img/mechanical/phase1-rack-and-pinion.jpg)

## Idler Gear

An **idler gear** is placed between the driver and driven gears. Its primary purpose is generally to change the direction or spacing of the output without changing the overall gear ratio.

For example: **20T → 40T → 20T**. The middle gear changes the rotational direction relationship but does not necessarily change the overall speed ratio between the first and last gears.

![An idler gear placed between the driver and driven gears.](/img/mechanical/phase1-idler-gear.jpg)

## Gear Backlash

**Backlash is the small amount of clearance between mating gear teeth.**

Some backlash is necessary because perfectly tight teeth would cause increased friction, heat generation, binding, manufacturing problems, and failure due to thermal expansion.

However, excessive backlash can cause positioning errors, impact loading, noise, vibration, and reduced motion accuracy — this is particularly important in **robotics and precision mechanisms**.

![Gear backlash: the small clearance between mating teeth.](/img/mechanical/phase1-gear-backlash.png)

## Applications

- **Bicycle**: Low gears help climb hills; high gears increase speed.
- **Cars**: Different gear ratios for starting, climbing, cruising.
- **Robots**: High torque for lifting; high speed for racing.
- **Clocks**: Different gears rotate at different speeds.

## Advantages

No slipping, accurate motion, high efficiency, long life, precise speed control, can change direction, can increase torque or speed.

## Disadvantages

Require lubrication, can be noisy, need accurate alignment, costlier than belt drives.

---
title: "Module 3.3: Four-Bar Linkage — Concept"
sidebar_position: 3
slug: /phase-3-mechanism-design-and-assembly/four-bar-linkage-concept
---

## Introduction to Linkages

A linkage is a mechanical system made of rigid bars (links) connected by pin joints (revolute joints). It transfers and transforms motion and force from one part of a machine to another.

![A simple linkage made of rigid links connected by pin joints.](/img/mechanical/phase3-linkage-intro.png)

## What is a Link?

A link is a rigid member connecting two joints. The length of the link remains constant while it rotates or moves.

## What is a Joint?

A joint connects two or more links. The most common joint is the pin (revolute) joint, which allows rotational motion.

## Four-Bar Linkage

The four-bar linkage is the simplest closed-chain mechanism consisting of four rigid links connected by four pin joints.

### Components

**Ground Link**: The fixed link that provides the reference frame.

**Crank**: The input link that can rotate continuously when geometry allows.

**Coupler**: Transfers motion between the crank and rocker.

**Rocker**: The output link that oscillates back and forth.

## Working Principle

- The motor rotates the crank.
- The crank drives the coupler.
- The coupler transfers motion to the rocker.
- The rocker oscillates, converting rotary motion into useful output.

## Importance in Robotics

- Converts rotary motor motion into oscillating or sweeping motion.
- Used in grippers, intake mechanisms, sweepers and walking robots.
- Simple, compact and reliable mechanism.

## Grashof's Condition

Let s = shortest link, l = longest link, and p and q be the remaining two links.

**Condition**: s + l ≤ p + q

If the condition is satisfied, at least one link can rotate continuously. Otherwise, all moving links oscillate.

## Advantages

- Simple construction
- Compact design
- Low cost
- Smooth motion
- High reliability
- Low maintenance

## Limitations

- Motion depends on link lengths.
- Limited adjustment after manufacturing.
- Pin joints wear over time.
- Requires careful design.

## Summary

A four-bar linkage consists of a ground link, crank, coupler and rocker. It converts rotary motion into oscillating motion and is widely used in robotics and machines. Grashof's condition helps determine whether continuous rotation is possible.

## Simulator

Explore link lengths and Grashof's condition interactively: [Four-Bar Linkage Simulator](https://mevirtuoso.com/four-bar-linkage-simulator/) (third-party tool, not affiliated with NRL).

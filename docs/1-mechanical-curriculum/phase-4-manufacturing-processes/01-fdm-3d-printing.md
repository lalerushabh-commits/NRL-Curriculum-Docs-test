---
title: "1.1: FDM (Fused Deposition Modeling) 3D Printing"
sidebar_position: 1
slug: /phase-4-manufacturing-processes/fdm-3d-printing
---

Curriculum notes covering the working principle, materials, slicer settings, design rules, workflow, strengths and limitations.

## Introduction

FDM is an additive manufacturing process in which thermoplastic filament is melted and deposited layer by layer to create a three-dimensional object.

## How FDM Works

- Filament is fed into a heated nozzle.
- The nozzle melts the plastic.
- Molten plastic is deposited on the build plate.
- Each layer bonds to the previous one.
- The object grows upward until complete.

![The FDM process: filament is melted and deposited layer by layer.](/img/mechanical/phase4-fdm-process.png)

## Common Materials

**PLA**: Easy to print, biodegradable under industrial composting conditions, ideal for prototypes.

**PETG**: Tough, slightly flexible, excellent for brackets and moderate-load gears.

**ABS**: Strong and heat resistant but prone to warping. Requires a heated bed and enclosed printer.

## Key Slicer Settings

**Layer Height (0.1–0.3 mm)**: Smaller layers improve finish but increase print time.

**Infill (0–100%)**: 20% for light parts, 60–80% for structural parts.

**Supports**: Temporary structures for overhangs.

**Print Speed**: Slower speeds improve strength and layer bonding.

![Key slicer settings that affect print quality and strength.](/img/mechanical/phase4-fdm-slicer-settings.png)

## FDM Design Rules

- Minimum wall thickness: 1.2 mm (3 extrusion widths with a 0.4 mm nozzle).
- Overhangs up to 45° usually print without supports.
- Vertical holes print accurately.
- Horizontal holes may require compensation or chamfers.

## Workflow

Onshape → Export STL → Import into Cura/PrusaSlicer → Configure settings → Slice to generate G-code → Send to the printer.

## Strengths

- Low-cost filament
- Fast prototyping
- Easy to use
- Available in schools and maker spaces
- Excellent for rapid design iterations

## Limitations

- Visible layer lines
- Weaker in the Z-direction
- Thin gears are unsuitable for high torque
- ABS can warp
- Supports may be required for complex overhangs

## Summary

FDM is a low-cost and widely used manufacturing process. Understanding materials, slicer settings, design guidelines and workflow enables students to produce strong and reliable printed parts.

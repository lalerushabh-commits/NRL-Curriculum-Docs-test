---
title: "Module 4.2: Laser Cutting"
sidebar_position: 2
slug: /phase-4-manufacturing-processes/laser-cutting
---

## What is Laser Cutting?

Laser cutting is a manufacturing process that uses a highly focused beam of light (laser) to cut or engrave materials with exceptional precision. The laser melts, burns, or vaporizes material along a programmed path to create clean and accurate cuts. It is widely used in robotics, engineering, product design, architecture, and manufacturing.

## How Laser Cutting Works

1. **Designing the Part** — Create a 2D sketch in CAD software such as Onshape, SolidWorks, Fusion 360, or AutoCAD.
2. **Exporting the Design** — Export the sketch as a DXF or SVG file.
3. **Importing into Laser Software** — Import the file into software such as LightBurn or RDWorks. Set laser power, speed, and cutting/engraving operations.
4. **Machine Setup** — Place the material on the laser bed. Focus the laser and complete safety checks.
5. **Cutting** — The laser follows the programmed path, melting, burning, or vaporizing the material.
6. **Removing the Parts** — Remove finished parts and clean edges if necessary.

![The laser cutting workflow, from design to finished parts.](/img/mechanical/phase4-laser-cutting-process.png)

:::warning[Safety]
Laser cutters involve high-power lasers and fumes from melted/burned material. Always complete machine-specific safety checks and never leave a cut running unattended.
:::

## Laser Cutting is a 2D Manufacturing Process

Laser cutters work with flat sheet materials only. Three-dimensional products are created by assembling multiple laser-cut parts.

## Materials Commonly Used in Robotics

**Plywood (3–6 mm)**: Strong, lightweight, inexpensive, and ideal for robot chassis, frames, and brackets.

**Acrylic**: Smooth, rigid, available in clear or colored sheets, and used for side panels, covers, and decorative parts.

**Cardboard and Foam**: Low-cost materials used for rapid prototyping, concept models, and classroom demonstrations.

## Kerf

Kerf is the width of material removed by the laser beam during cutting. Typical kerf ranges from 0.1–0.3 mm depending on the material and machine settings.

Accounting for kerf is essential for accurate dimensions and properly fitting assemblies.

![Kerf: the width of material removed by the laser beam.](/img/mechanical/phase4-laser-kerf.png)

## Press-Fit (Tab-and-Slot) Joints

Press-fit joints use matching tabs and slots that snap together without glue or screws.

To compensate for kerf:
- Tabs are designed slightly wider.
- Slots are designed slightly narrower.

Applications include robot chassis, boxes, enclosures, and educational kits.

![Press-fit tab-and-slot joints, compensated for kerf.](/img/mechanical/phase4-laser-press-fit-joints.png)

## CAD Workflow

1. Create a 2D sketch in Onshape or another CAD program.
2. Export as DXF or SVG.
3. Import into LightBurn or RDWorks.
4. Set laser power, speed, and material thickness.
5. Preview the toolpath and begin cutting.

## Engraving

By reducing laser power or increasing speed, the laser engraves the surface instead of cutting through it.

Applications: Labels, team logos, measurement scales, alignment marks, decorative graphics.

## Advantages of Laser Cutting

Very fast cutting, excellent precision, clean edges, low material waste, easy design iteration, affordable materials, excellent for rapid prototyping.

## Limitations of Laser Cutting

Limited to 2D sheet materials, requires assembly for 3D structures, wood edges may char, some plastics (e.g., PVC) cannot be laser cut due to harmful fumes, limited cutting thickness depending on machine power.

## Applications in Robotics

Common laser-cut components include: robot chassis, motor mounts, gear plates, structural frames, sensor brackets, battery holders, protective covers, decorative panels, electronics mounting plates.

---
title: "Module 4.3: CNC Machining"
sidebar_position: 3
slug: /phase-4-manufacturing-processes/cnc-machining
---

## What is CNC?

CNC stands for Computer Numerical Control. It is a manufacturing process in which computers control the movement of cutting tools to remove material from a solid workpiece and create precise parts.

Instead of an operator manually guiding the cutting tool, a computer follows programmed instructions along the X, Y, and Z axes. CNC machining is widely used in automotive, aerospace, robotics, electronics, and medical manufacturing because it produces highly accurate and repeatable parts.

## How CNC Machining Works

1. **Designing the Part** — Create a 2D drawing or 3D CAD model using software such as SolidWorks, Fusion 360, Onshape, or Inventor.
2. **CAM Programming** — Import the CAD model into CAM software. Select cutting tools, feed rates, spindle speeds, and machining operations.
3. **Generating G-code** — CAM software automatically generates G-code containing tool movements, cutting speeds, depths, and tool changes.
4. **Machine Setup** — Clamp the workpiece securely. Install the cutting tool. Set the machine reference point (zero). Perform safety checks.
5. **Machining** — The spindle rotates the cutter while motors move the tool or workpiece along programmed paths. Material is removed until the final shape is achieved.
6. **Inspection** — Measure dimensions, inspect surface finish, and remove burrs if necessary.

:::warning[Safety]
CNC machines involve fast-spinning cutting tools and flying debris. Secure fixturing, correct eye/ear protection, and trained supervision are required before operating any CNC machine.
:::

## CNC is a Subtractive Manufacturing Process

CNC machining removes material from a solid block called stock. Unlike 3D printing, which builds parts layer by layer, CNC cuts away unwanted material to produce the finished component.

## Difference Between CNC Machining and 3D Printing

- **CNC**: Subtractive manufacturing, high strength, excellent accuracy, smooth finish.
- **3D Printing**: Additive manufacturing, minimal waste, ideal for prototypes and complex shapes.

## Common Types of CNC Machines

**CNC Router**: Cuts wood, foam, acrylic, HDPE, and plywood. Used for robot chassis, signs, and educational projects.

![A CNC router, used for wood, foam, acrylic, HDPE, and plywood.](/img/mechanical/phase4-cnc-router.png)

**CNC Mill**: Machines aluminium, brass, steel, and engineering plastics. Used for motor mounts, gearbox plates, and precision brackets.

![A CNC mill, used for aluminium, brass, steel, and engineering plastics.](/img/mechanical/phase4-cnc-mill.png)

**CNC Lathe**: Produces cylindrical parts by rotating the workpiece. Used for shafts, spacers, rollers, and bushings.

![A CNC lathe, producing cylindrical parts by rotating the workpiece.](/img/mechanical/phase4-cnc-lathe.png)

## Materials Used in CNC Machining

**Aluminium**: Lightweight, strong, corrosion-resistant, and easy to machine. Used for robot chassis and structural components.

**HDPE**: Tough, lightweight engineering plastic. Used for side plates, guards, and brackets.

**Hardwood**: Used for furniture, prototypes, and educational projects.

## G-code

G-code is the programming language that controls CNC machines. It tells the machine where to move, how fast to move, how deep to cut, and when to change tools or start the spindle.

Students usually do not write G-code manually. CAM software such as Autodesk Fusion 360 CAM, Mastercam, or SolidCAM automatically generates it from the CAD model.

![G-code drives every movement of a CNC machine.](/img/mechanical/phase4-cnc-gcode.png)

## Important CNC Design Rules

1. **Inside Corners** — Rotating cutters cannot produce perfectly sharp inside corners. Add a radius equal to the cutter radius.
2. **Minimum Feature Size** — Smallest feature depends on cutter diameter (typically 2–6 mm on school machines).
3. **Fixturing** — Clamp the workpiece securely. Poor fixturing causes vibration, inaccurate dimensions, poor finish, and possible tool breakage.

## Advantages of CNC Machining

High precision and repeatability, excellent surface finish, machines strong materials such as aluminium and steel, suitable for professional mechanical components.

## Limitations of CNC Machining

Expensive machines and tooling, longer setup than 3D printing, produces material waste, requires trained supervision and safety precautions.

## Applications in Robotics

Common CNC-machined robot components include: motor mounts, aluminium chassis plates, drive shafts, wheel hubs, gearbox plates, bearing blocks, custom brackets, sensor mounts, structural frame members.

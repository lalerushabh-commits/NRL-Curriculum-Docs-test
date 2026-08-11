---
title: "Module 5.1: Connectors & the Wiring Harness"
sidebar_position: 1
slug: /phase-5-wiring-wireless-and-the-whole-robot/connectors-and-the-wiring-harness
---

Your kit ships with professionally made cables for every connection. Your superpower is knowing each one by sight — and seating it right.

You will not build cables on this team — the **pre-made NRL wiring harness** covers every connection with the correct wire, length, and connector. What you own is *using* them well: picking the right cable, seating it fully, and spotting a damaged one before it costs a match.

## Meet the connector families

| Connector | Looks like | Used for | Personality |
| --- | --- | --- | --- |
| **XT30** | Small yellow block, two fat pins | Battery power, main switch harness, motor driver power | Keyed — cannot go in backwards. Needs a firm push; seats with authority. |
| **JST-XH** | Small white shell, 3/4/6 thin pins | All signal cables: motor driver signal, sensors, I2C, UART | Latched — listen for the tiny click. Remove by the shell, never the wires. |
| **JST-VH** | Larger white shell, 2 sturdy pins | Motor power, driver to each motor | Power's little brother — same firm-click rules as XT30. |
| **Servo header** | Bare 3-pin friction fit | Servos onto the Hub's servo ports | **Not keyed** — the one connector you can physically reverse. Read the silkscreen every time. |
| **DC jack** | Round barrel plug | Chargers into the battery pack and Controller | Simple and sturdy — but only ever mates with its **matched** charger ([Module 3.2](/phase-3-power/charging-checking-and-battery-care)). |

:::note[Photo coming soon]
All harness cable types laid out and labelled on a white background. The full harness family — main switch harness, motor driver power (XT30 F-F), 6-pin driver signal, sensor cables, servo leads. Print this photo for the pit wall.
:::

## The colour code

Every harness cable follows one colour law: **red is positive power (VCC — whether that rail is 3.3 V or 5 V), black is ground (GND)** — and the remaining colours identify signals. When a cable and a port meet, red meets the **+** marking, black meets GND, and the world stays orderly.

## The seating ritual

1. **Look** — right connector, right port, silkscreen agrees, pins straight.
2. **Seat** — push straight in until it clicks or bottoms out firmly. No click on a latched connector = not connected, however connected it looks.
3. **Tug** — a gentle pull on the *shell* (never the wires). A seated connector shrugs it off.

:::tip[Retiring a wounded cable]
A cable with a cracked shell, a backed-out pin, or wires pulling from the housing is a time bomb of intermittent faults — the worst kind. Mark it with tape, swap in a spare, and hand it to a mentor. Spare cables exist precisely so you never have to nurse a bad one.
:::

---
title: "Module 4.3: The Motor Driver"
sidebar_position: 3
slug: /phase-4-motion-and-sensing/the-motor-driver
---

The translator between the Hub's whisper and the motors' shout.

The Hub's brain speaks in tiny 3.3 V signals — far too weak to move a motor. Motors want raw battery power in controlled doses. Between them sits the **motor driver**: your kit's is a **custom-built NRL dual-channel driver**, controlling both drive motors.

## The idea inside: the H-bridge

Each channel contains an **H-bridge** — four electronic switches arranged like the letter H with the motor as the crossbar. Close one diagonal pair and current flows through the motor left-to-right: forward. Close the other diagonal: reverse. Switch the power on and off very fast and the motor sees an average power — that is speed control, and the fast switching signal is called **PWM** ([Module 4.4](/phase-4-motion-and-sensing/pwm-controlling-power-with-pulses) is all about it). So each motor needs exactly two commands from the Hub: **DIR** (which diagonal) and **PWM** (how much).

![The H-bridge: same four switches, two diagonals — current flows through the motor one way for forward, the other way for reverse. PWM the closed pair and you get speed control too.](/img/electronics/phase4-h-bridge.png)

*The H-bridge: same four switches, two diagonals — current flows through the motor one way for forward, the other way for reverse. PWM the closed pair and you get speed control too.*

## The three connections

| Connector | Type | Carries |
| --- | --- | --- |
| Power IN | XT30 | Raw ~12 V from the Hub's Power OUT passthrough — the muscle supply |
| Motor A / Motor B OUT | 2-pin JST-VH, one per motor | Full-power output to each drive motor |
| Signal IN | 6-pin JST-XH | The control cable from the Hub's Motor Driver port: DIR1 \| GND \| PWM1 \| DIR2 \| GND \| PWM2 |

:::note[Photo coming soon]
The NRL motor driver board, connectors labelled: XT30 in, two JST-VH motor outputs, 6-pin JST-XH signal. The driver's three families of connectors: one power in, two motor out, one signal in. Keyed connectors make miswiring nearly impossible — nearly.
:::

:::keyidea[Power and signal never mix]
Notice the pattern: thick wires and big connectors carry **power**; the thin six-wire cable carries **signals**. The driver is where the two worlds meet — which is why its wiring deserves your neatest work and why [Module 5.2](/phase-5-wiring-wireless-and-the-whole-robot/conclusion-and-next-steps) routes power and signal cables apart from each other.
:::

:::warning[If one side of the robot won't drive]
Don't reach for a replacement driver — a genuinely dead channel is rare. Check, in order: the dead motor's **JST-VH power cable** seated at both the driver and the motor; the **6-pin signal cable** fully clicked at the Hub and the driver; then swap the silent motor onto the working channel to learn whether the problem travels with the motor or stays with the wiring. [Module 5.5](/phase-5-wiring-wireless-and-the-whole-robot/conclusion-and-next-steps) walks the full method.
:::

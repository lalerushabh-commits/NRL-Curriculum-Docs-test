---
title: "Module 4.2: Servos"
sidebar_position: 2
slug: /phase-4-motion-and-sensing/servos
---

Motors that go where they're told: dial an angle, and the servo holds it.

A **servo** is a complete position-control system in a plastic case: a small motor, a gearbox, a position sensor, and a control board that constantly compares "where am I?" against "where was I told to be?" and corrects the difference. Your kit's servos are **high-torque 20 kg·cm** units — strong enough for arms and grippers.

- **Three wires only:** plugged straight onto the Hub's servo headers (GND \| S+ \| SIG). The position command travels on the signal wire as a timed pulse — a form of the PWM signalling you will meet properly in [Module 4.4](/phase-4-motion-and-sensing/pwm-controlling-power-with-pulses).
- **20 kg·cm decoded:** at 1 cm from the shaft the servo can hold about 20 kg; at 10 cm, about 2 kg. Leverage matters — share this number with your Mechanical teammates when designing arms.
- **Their own power rail:** all four servo ports are fed by the Hub's dedicated **servo power rail**, with extra energy-storage capacitors at each port — because servos twitching together draw sharp bursts that would rattle a shared supply.

![The 20 kg·cm servo with its mounting tabs and output spline. Its 3-pin lead is friction-fit — note the wire colours and the silkscreen (GND | S+ | SIG) before plugging, because unlike JST connectors, it can physically go on backwards.](/img/electronics/phase4-servo.png)

*The 20 kg·cm servo with its mounting tabs and output spline. Its 3-pin lead is friction-fit — note the wire colours and the silkscreen (GND | S+ | SIG) before plugging, because unlike JST connectors, it can physically go on backwards.*

:::warning[Two ways to hurt a servo]
**Forcing the horn by hand** while powered — you are fighting the gearbox and it loses teeth. **Commanding it against a hard stop** — the servo will strain at full current forever, getting hot (watch the servo rail current climb on telemetry). If a servo buzzes continuously and feels warm, its target position is unreachable; ask the programmers to back it off a few degrees.
:::

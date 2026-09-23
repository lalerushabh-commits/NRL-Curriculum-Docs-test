---
title: "Module 4.4: PWM — Controlling Power with Pulses"
sidebar_position: 4
slug: /phase-4-motion-and-sensing/pwm-controlling-power-with-pulses
---

How a computer that only knows ON and OFF creates any speed, any brightness, any angle — by switching faster than anything can notice.

Here is a puzzle. The Hub's brain is digital — its pins can only be fully ON or fully OFF ([Module 4.5](/phase-4-motion-and-sensing/analog-and-digital-signals)). Yet your robot drives at half speed, dims LEDs, and holds a servo at exactly 90°. How does an ON/OFF machine produce "halfway"?

The answer is **PWM — Pulse-Width Modulation** — and it is one of the most useful tricks in all of electronics: **switch ON and OFF so fast that the device only feels the average.**

## Duty cycle — the one number that matters

A PWM signal repeats a simple cycle: ON for a while, OFF for a while, thousands of times per second. The **duty cycle** is the percentage of each cycle spent ON — and it directly sets the average power delivered:

![Three PWM signals switching the same 12 V supply. Nothing about the voltage changes — only the fraction of time it is ON. The dashed line is what the motor "feels."](/img/electronics/phase4-pwm-duty-cycle.png)

*Three PWM signals switching the same 12 V supply. Nothing about the voltage changes — only the fraction of time it is ON. The dashed line is what the motor "feels."*

| Duty cycle | Signal looks like | Average of a 12 V supply | Motor result |
| --- | --- | --- | --- |
| 0% | Always OFF | 0 V | Stopped |
| 25% | Short ON, long OFF | 3 V | Slow |
| 50% | Half ON, half OFF | 6 V | Medium |
| 75% | Long ON, short OFF | 9 V | Fast |
| 100% | Always ON | 12 V | Full speed |

The switching is far too fast to see or hear as pulses — the motor's own spinning mass smooths thousands of tiny pushes per second into steady motion, exactly the way a movie's still frames blur into smooth video.

## Why not just lower the voltage?

You *could* slow a motor by putting a resistor in its path — but the resistor would burn the unwanted energy as heat, wasting battery and cooking itself. PWM wastes almost nothing: the switch is either fully ON (little resistance, little heat) or fully OFF (no current, no heat). That efficiency is why PWM runs everything from robot motors to phone screen brightness.

## Where PWM lives on your robot

- **DC motor speed:** the Hub sends a PWM signal to each motor driver channel (the PWM1/PWM2 wires in the 6-pin cable); the driver's H-bridge switches the full 12 V to match. Joystick position → duty cycle → speed.
- **Servo position:** servos use a special dialect of pulse signalling — the *width* of a repeating pulse tells the servo which **angle** to hold ([Module 4.2](/phase-4-motion-and-sensing/servos)). Same idea, different message: motors read the average, servos read the pulse width.
- **Lights and sounds:** the RGB status LED's colours and brightness come from PWM-dimming its red, green, and blue elements, and the buzzer's tones come from switching at audible frequencies.

:::keyidea[PWM in one sentence]
PWM delivers any fraction of full power by switching ON and OFF very fast — the **duty cycle** (% of time ON) *is* the throttle.
:::

:::note[Who sets the duty cycle?]
Your programmers do, in code — mapping joystick values to duty cycles is one of the Programming book's early victories. Your side of the deal is hardware that lets the pulses arrive clean: seated signal cables, and power wiring routed away from signal wiring ([Module 5.2](/phase-5-wiring-wireless-and-the-whole-robot/wiring-the-robot)).
:::

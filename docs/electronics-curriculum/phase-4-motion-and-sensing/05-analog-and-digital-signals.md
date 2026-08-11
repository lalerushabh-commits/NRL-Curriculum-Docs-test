---
title: "Module 4.5: Analog & Digital Signals"
sidebar_position: 5
slug: /phase-4-motion-and-sensing/analog-and-digital-signals
---

Every wire on the robot carries one of two kinds of message. Learn both and no port will ever confuse you again.

- **Digital** signals have two states — ON or OFF. Buttons, limit switches, touch sensors. The Hub's three **Digital Ports** (3-pin: GND \| Dx \| 5V supply) and two 4-pin **Extra Digital IO Ports** read these.
- **Analog** signals vary smoothly across a range — a joystick axis mid-travel, a reflectance reading, a battery voltage. The Hub's five **Analog Ports (A3–A7)** read these.

## How a smooth voltage becomes a number

Brains only understand numbers, so an **ADC** (analog-to-digital converter) measures the voltage on an analog pin and reports it as a count. The Hub uses a dedicated ADC chip — the **MCP3008** — with **10-bit** resolution: it splits its measuring range into **1024 steps (0–1023)**. Zero volts reads ~0; full scale reads ~1023; halfway reads ~512. When your programmers print "raw sensor value: 680," you now know exactly what that number is — a voltage, translated.

The MCP3008 has eight channels, and [Module 3.4](/phase-3-power/brownouts-and-power-monitoring) already introduced three of them: channels 1–2 read the current sensors and channel 3 reads the battery voltage divider. The other five are brought out as the Analog Ports **A3–A7** on the board's edge — those are yours.

:::warning[Check the voltage before you connect — every time]
Different ports live in different voltage worlds. The 3-pin sensor ports offer a **5 V supply** pin to power sensors; the 4-pin Extra Digital IO ports supply **3.3 V**; and any signal wired to the brain's own pins (digital, I2C, UART) must never exceed **3.3 V**. The Analog Ports measure signals from 0 up to 5 V (the ADC's full scale) — but on the digital ports and buses, never connect a sensor whose output exceeds **3.3 V**: it can permanently damage the brain's input pins. Before connecting anything new, find its supply and output voltages in its datasheet or ask a mentor.
:::

:::note[Signal vs. supply]
A sensor port has supply pins (which *power* the sensor) and a signal pin (which *carries its answer*). Some sensors are powered from 5 V yet politely answer in 3.3 V — the datasheet always tells you which voltages live on which pins.
:::

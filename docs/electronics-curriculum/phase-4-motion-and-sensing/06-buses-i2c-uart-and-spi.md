---
title: "Module 4.6: Buses — I2C, UART & SPI"
sidebar_position: 6
slug: /phase-4-motion-and-sensing/buses-i2c-uart-and-spi
---

Smart sensors don't send a voltage — they hold a conversation. Buses are the languages they speak.

Simple sensors answer with one voltage on one wire. Smart devices — distance sensors, colour sensors, cameras, display screens — have too much to say, so they talk over shared digital "party lines" called **buses**. You don't need to speak these languages, but knowing a few words of each tells you which port hosts which conversation — and why.

## I2C — the conference call

**I2C** ("I-squared-C", Inter-Integrated Circuit) lets many devices share just two signal wires. Its port has four pins: **SDA** (Serial **Data** — the wire the actual information travels on, in both directions), **SCL** (Serial **Clock** — a steady tick from the Hub that keeps every device reading the data at the same rhythm), plus 3.3V and GND. Every device on the bus has its own **address**, like houses on a street — the Hub calls an address, and only that device answers. In principle over a hundred devices can share one I2C bus; in practice you will connect a handful, and each needs a different address.

- **On the Command Hub:** the onboard **IMU** already lives on the **I2C0** bus — the external I2C0 port shares its street. The onboard **OLED display** lives on **I2C1**, sharing that port's street.
- **On the Controller:** its onboard IMU likewise sits on its I2C0 bus.
- **Practical rule:** two *different* sensors can share one port's bus (different addresses). Two *identical* sensors usually clash (same address) — put one on I2C0 and one on I2C1.

## UART — the private phone line

**UART** (Universal Asynchronous Receiver-Transmitter) connects exactly **two** parties, each talking on its own wire: **TX** (**transmit** — the wire a device talks out of) and **RX** (**receive** — the wire it listens on). The Hub's TX must connect to the other device's RX, and vice versa — like two people each holding a phone to the correct ear. There are no addresses because there is nobody else on the line; the two sides simply agree on a talking speed and stream bytes both ways at once. The Hub's 4-pin **UART port** (RX \| TX \| GND \| 3.3V) hosts one smart guest: a HuskyLens camera, a Raspberry Pi, or another microcontroller.

## SPI — the fast internal expressway

**SPI** (Serial Peripheral Interface) is the fastest of the three, used where lots of data must move quickly. It needs more wires: **MOSI** (Master Out, Slave In — data from the Hub to the device), **MISO** (Master In, Slave Out — data back), **SCLK** (the clock tick), and a **CS** (chip-select) line per device — the Hub "taps the shoulder" of whichever chip it wants, so several can share the data wires. Plus power and ground, that's the six-wire family. You won't wire SPI yourself — the Hub uses it internally to talk to the MCP3008 ADC, and the Controller uses it to drive its TFT screen fast enough for smooth graphics.

| Bus | Wires (signals) | Devices | On your robot |
| --- | --- | --- | --- |
| **I2C** | 2 — SDA + SCL | Many, by address | IMU (I2C0), OLED (I2C1), your add-on sensors |
| **UART** | 2 — TX + RX crossed | Exactly two | The UART port: HuskyLens, R-Pi |
| **SPI** | 4+ — MOSI, MISO, SCLK, CS | Several, by chip-select | Internal: ADC chip; Controller's TFT |

![Three buses, three shapes of conversation: I2C's shared street with addresses, UART's crossed private pair, SPI's shared expressway with a chip-select per device.](/img/electronics/phase4-buses.png)

*Three buses, three shapes of conversation: I2C's shared street with addresses, UART's crossed private pair, SPI's shared expressway with a chip-select per device.*

:::note[When a smart sensor "isn't found"]
Programmers will sometimes report an I2C device "not detected." Nine times out of ten it is hardware: cable half-seated, plugged into the wrong port, or an address clash with the onboard IMU or OLED sharing that bus. Your two-minute check — right port, firm click at both ends, correct cable — solves it before anyone reads a line of code.
:::

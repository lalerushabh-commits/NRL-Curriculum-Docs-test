---
title: "Module 5.3: Hexa Link & the Antenna"
sidebar_position: 3
slug: /phase-5-wiring-wireless-and-the-whole-robot/hexa-link-and-the-antenna
---

Your commands fly through the air on invisible waves — and one small antenna decides how reliably they arrive.

## The crowded airwaves

Hexa Link lives on the **2.4 GHz radio band** — the same public band as WiFi routers, Bluetooth headphones, and (yes) microwave ovens. A competition hall is a storm of 2.4 GHz chatter, which is why every hardware detail in this module exists: your link must stay crisp in a noisy room.

Over that band, the HEXA system speaks three protocols, each with its own job: **ESP-NOW** — an ultra-quick, direct board-to-board protocol — carries the driving commands, because a driver can feel even a few milliseconds of lag; **WiFi** carries bigger data when needed; and **Bluetooth LE** handles low-power companion roles. Setting them up is the Programming book's business; making the radio's *hardware* excellent is yours.

## The antenna

Both boards use an **external antenna** — the small flexible strip supplied already fitted to the Hub and the Controller. It connects to the board through a tiny snap-on socket called a **U.FL** connector, and that thumbnail-sized part is the most delicate component on your robot. Three rules keep it alive:

- **Leave it connected.** U.FL sockets survive only a limited number of connect/disconnect cycles — the antenna comes fitted; there is almost never a reason to remove it.
- **If it must be re-seated:** press the round plug **straight down** onto the socket until it snaps — never at an angle, never with a twist. To remove, lift straight up from under the metal plug with a plastic tool. **Never pull the cable.**
- **Strain-relieve the cable** — a small piece of tape near the plug means a snagged antenna tears the tape, not the socket.

:::note[Photo coming soon]
Macro shot: U.FL connector being pressed on correctly; FPC antenna mounted on the polycarbonate panel. Left: pressing the U.FL straight down. Right: the antenna mounted high on the polycarbonate plate, cable strain-relieved.
:::

## Placement — where the antenna lives

- **High and clear** — top of the robot, with open air around it.
- **Never against metal.** A metal plate behind an antenna is a mirror and a shield at once; mount it on the **polycarbonate plate**.
- **Away from the battery and motor power cables** — both are electrically loud neighbours.
- **Flat and secured**, not dangling — a flapping antenna changes performance corner to corner.

:::warning["The robot lags in matches but not at home"]
Classic antenna story: at home, one robot in a quiet room — any placement works. At an event, dozens of 2.4 GHz devices roar at once, and the badly placed antenna finally matters.
:::

:::tip[A quieter channel]
The 2.4 GHz band is divided into numbered **channels**, and Hexa Link can be moved to a different one through the Controller's settings menu. If the hall is badly congested, switching the robot-and-controller pair to a quieter channel — with a mentor's guidance — often cures stutters that no amount of antenna adjustment can.
:::

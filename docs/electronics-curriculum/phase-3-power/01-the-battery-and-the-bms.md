---
title: "Module 3.1: The Battery & the BMS"
sidebar_position: 1
slug: /phase-3-power/the-battery-and-the-bms
---

Eleven point one volts of stored sunshine — what the numbers on the label really mean.

Your robot runs on a **3S Li-ion battery pack**: three cells in series, 11.1 V nominal, 2200 mAh, rated 10C, with a built-in protection board (BMS), an **XT30** power connector, and a **DC jack** for charging. Every one of those words matters. Let's decode the pack:

| On the pack | What it means | Why you care |
| --- | --- | --- |
| 3S | Three Li-ion cells in **series** | 3 × 3.7 V = 11.1 V nominal — the robot's "12 V" system |
| 11.1 V nominal | The average working voltage | Fully charged it reads about **12.6 V**; near-empty, about **9 V**. Voltage is your fuel gauge. |
| 2200 mAh | The fuel tank (capacity) | Roughly 2.2 A for one hour. Hard driving drains it in well under an hour. |
| 10C | Maximum safe discharge rate | 10 × 2.2 A = up to **22 A** available — headroom for motors accelerating and stalling |
| BMS | Battery Management System | A tiny guardian board inside the pack that protects against over-charge, over-discharge, and shorts — and performs **cell balancing**, keeping all three cells evenly charged |
| XT30 (yellow) | The power output connector | Connects to the robot through the main switch cable. Keyed — cannot go in backwards. |
| DC jack (black) | The power **in** connector | Where the charger plugs in to charge the pack ([Module 3.2](/phase-3-power/charging-checking-and-battery-care)) |

:::note[Photo coming soon]
The 3S battery pack showing XT30 output, DC charging jack, and label. Two connectors, two jobs: yellow XT30 sends power out to the robot; the black DC jack takes charging power in.
:::

:::keyidea[Voltage is the fuel gauge]
A Li-ion pack's voltage falls as it empties: ~12.6 V full → ~11.1 V mid → ~10 V getting low. Your robot displays battery voltage live on the Controller's screen, and the battery checker ([Module 3.2](/phase-3-power/charging-checking-and-battery-care)) reads it directly from the pack. Learn to glance at it the way a driver glances at a fuel gauge.
:::

:::note[Why the BMS is not an excuse]
The BMS is a last line of defence, like a seatbelt. It will cut power in a crisis — but a pack that gets rescued by its BMS has still been abused. Your habits ([Module 3.2](/phase-3-power/charging-checking-and-battery-care)) are the real protection.
:::

---
title: "Module 3.3: The Power Path"
sidebar_position: 3
slug: /phase-3-power/the-power-path
---

Follow the energy: battery → switch → clean rails and one raw one.

Flip the main switch and energy begins a well-planned journey. Walk it with your finger on the real robot:

1. **The battery** connects through its XT30 into the **main switch harness** — the robot's master ON/OFF and your emergency stop.
2. From the switch, power enters the Hub's **XT30 Power IN**.
3. One branch leaves straight back out of the **XT30 Power OUT** as raw ~12 V to the **motor driver**. Motors are strong and thirsty — they get battery power directly.
4. The other branch feeds the **voltage regulators**, which manufacture clean, steady supplies: the dedicated **servo power rail**, the **5 V rail**, and the **3.3 V rail** that powers the brain and most sensors.

![The whole power story in one picture. Raw power goes to muscles; regulated power goes to brains.](/img/electronics/phase3-power-path.png)

*The whole power story in one picture. Raw power goes to muscles; regulated power goes to brains.*

:::keyidea[Muscles get raw power; brains get clean power]
Motors tolerate the battery's rough, sagging voltage — sensors and microcontrollers do not. That is the entire reason regulators exist, and it explains a dozen design choices you will meet later: separate servo power, sensor voltage rules, even why brownouts ([Module 3.4](/phase-3-power/brownouts-and-power-monitoring)) hurt the brain before the muscles.
:::

![The main rocker switch — the robot's master ON/OFF and your emergency stop. Mount it where anyone can hit it in one second.](/img/electronics/phase3-main-switch.png)

*The main rocker switch — the robot's master ON/OFF and your emergency stop. Mount it where anyone can hit it in one second.*

:::warning[The main switch is the safety system]
With no user-serviceable fuse in the path, the protection order is: the **BMS inside the pack** guards against shorts and abuse, and the **main switch** is your instant hand-operated cut-off. Keep the switch mounted where any team member can reach it in one second — that placement is a safety feature, not a convenience.
:::

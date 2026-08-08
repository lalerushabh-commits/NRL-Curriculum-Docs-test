---
title: "Module 2.2: Creating Your Own Project (HexaSDK)"
sidebar_position: 2
slug: /part-2-getting-started/creating-your-own-project
---

Rather than editing the shared template directly, each team makes its **own copy** of the project, stamped with the team's number and name. NRL includes a wizard called **HexaSDK** to do exactly this — it is the NRL equivalent of WPILib's *"Create a new project."*

## Running the wizard

The easiest way needs nothing open first — just double-click a launcher:

- **Windows:** run `tools\new-nrl-project.bat`
- **macOS:** double-click `tools/new-nrl-project.command`
- **Linux:** run `bash tools/new-nrl-project.sh`

![In the tools folder, double-click the new-nrl-project launcher (the Windows Batch File) to start the wizard.](/img/curriculum/ch04-wizard-launcher.png)

*In the tools folder, double-click the new-nrl-project launcher (the Windows Batch File) to start the wizard.*

The wizard asks for a **project name**, a **team number**, a **team name**, and a **location**, then creates a fresh project folder and opens it in VS Code automatically. If you already have the template open in VS Code, you can instead run it from **Ctrl+Shift+P → Tasks: Run Task → "HexaSDK: Create a New Project."**

![The wizard confirms your details — name, team number, team name, the ESP-NOW channel it derived, and the location — then reports "Project created" with the next steps.](/img/curriculum/ch04-wizard-confirmation.png)

*The wizard confirms your details — name, team number, team name, the ESP-NOW channel it derived, and the location — then reports "Project created" with the next steps.*

:::note[First-time Python]
The wizard is a small Python program. If your computer has no suitable Python installed, the double-click launchers install one for you the first time (a one-time step). You don't have to set anything up by hand.
:::

## What the team number does

NRL has no wired "deploy" target like a competition roboRIO. Instead, your **team number selects the wireless radio channel** both boards use, with this formula:

```
channel = ((team - 1) mod 11) + 1  // a number from 1 to 11
```

Both the Robot and Controller firmware in a generated project are locked to that same channel. This keeps several kits in the same room from stepping on each other's signals.

:::warning[Flash both boards from the SAME project]
Because the channel is baked into each firmware, the Robot and Controller must be built from the *same* generated project, or their radios will be on different channels and they will never connect.
:::

## What you get

The wizard produces a self-contained project folder with `RobotFirmware/`, `ControllerFirmware/`, the shared `lib/` drivers, a renamed `.code-workspace` file, and a small `nrl-project.json` recording your team details. Build artifacts and tooling are left out. Dependencies download on your first build, exactly as before.

![The generated project opens automatically in VS Code: both RobotFirmware and ControllerFirmware are in the Explorer, ready to build and flash.](/img/curriculum/ch04-generated-project.png)

*The generated project opens automatically in VS Code: both RobotFirmware and ControllerFirmware are in the Explorer, ready to build and flash.*

---
title: 6. Flashing and Pairing
sidebar_position: 4
slug: /part-2-getting-started/flashing-and-pairing
---

With a project created, it's time to put firmware on both boards and connect them to each other.

## 6.1 · Flash the firmware

"Flashing" means uploading the compiled program to a board over USB. You flash each board once (and again whenever you change its code). Start with the **Controller**, then repeat for the **Robot** — the four steps are marked on the picture below.

![Flashing both boards. STEP 1: pick the ControllerFirmware environment in the bottom status bar. STEP 2: open ControllerMain.ino. STEP 3: click Upload to flash the Controller. STEP 4: switch to the RobotFirmware environment and upload again to flash the RobotMain.ino to the Robot.](/img/curriculum/ch06-flashing-steps.png)

*Flashing both boards. STEP 1: pick the ControllerFirmware environment in the bottom status bar. STEP 2: open ControllerMain.ino. STEP 3: click Upload to flash the Controller. STEP 4: switch to the RobotFirmware environment and upload again to flash the RobotMain.ino to the Robot.*

1. **Select the target.** In the bottom status bar, choose the **ControllerFirmware** environment.
2. **Connect and open.** Plug the **Controller** board in over USB and open **ControllerMain**.
3. **Upload.** Click **Upload** on the PlatformIO toolbar (or press **Ctrl+Alt+U**) and wait for "SUCCESS."
4. **Repeat for the Robot.** Switch to the **RobotFirmware** environment, connect the **Robot** board, and **Upload** again.

:::tip[Upload = Build + Send]
Upload automatically builds first, so you don't need a separate Build step. If Upload fails to find the board, check the USB cable (some are charge-only) and that no other program is using the serial port.
:::

## 6.2 · Pair the two boards

The Robot and Controller should be on the same channel before pairing — you can see your WiFi channel of the Robot on the OLED screen. The bot must be **paired** so they only talk to each other, even in a room full of other kits. Pairing uses the Robot's button and a short code shown on the Controller.

![The Robot's small OLED screen shows your team name and pairing status at a glance.](/img/curriculum/ch01-oled-screen.png)

*The Robot's small OLED screen shows your team name and pairing status at a glance.*

You can change the WiFi channel of both bot and controller under **SETTING → WIFI CHANNEL**.

![Each kit is pinned to a radio channel derived from its team number, so multiple robots can run in the same room.](/img/curriculum/ch06-wifi-channel-setting.png)

*Each kit is pinned to a radio channel derived from its team number, so multiple robots can run in the same room.*

To pair, first press the tactile button on the **Robot** for 3 seconds. Then, under the pairing menu, press and hold the left bumper and right bumper on the Controller. This generates a 4-digit random number on the Controller. Check that you see the same number on the Robot's OLED. If you do, press the same button on the Robot for 1 second until it shows "paired."

![Put the Robot into pairing mode with its onboard button.](/img/curriculum/ch06-pairing-button.png)

*Put the Robot into pairing mode with its onboard button.*

![The Controller shows a 4-digit pairing code; confirm it to link the two boards.](/img/curriculum/ch06-pairing-code.png)

*The Controller shows a 4-digit pairing code; confirm it to link the two boards.*

Once paired, the link is remembered (saved in the board's non-volatile memory), so you only pair once. The Controller's header shows the connection status and the Robot's battery voltage.

## 6.3 · The Controller, at a glance

You drive the whole match from the Controller. Here is the button map you'll use constantly:

| Control | In the menu | During a match |
| --- | --- | --- |
| D-pad Up / Down | Scroll the OpMode list. | Free for your program to use. |
| D-pad Left / Right | Move across the MENU carousel. | Free for your program to use. |
| X button | Select / confirm. | Free for your program to use. |
| Y button | Go back. | Free for your program to use. |
| INIT / START / STOP | Run controls for the selected OpMode. | START begins the match; STOP ends it. |

## 6.4 · Writing your OpModes

Once your project is generated, the VS Code window opens with both the Controller and Robot firmware loaded. The first time it opens you'll see the loading screen below — indexing and initializing the whole firmware takes about 10 minutes, so let it finish before you start.

![VS Code indexing and initializing the whole firmware for the first time.](/img/curriculum/ch06-vscode-loading.png)

Once the project has finished loading, follow this same sequence each time you want to create a new OpMode:

1. Open the command palette with **Ctrl + Shift + P**.
2. Choose **Tasks: Run Task**.
3. Type **NRL** (or **OpMode**) to filter the list.
4. Select **NRL: New OpMode (template)**.

![Filtering the Tasks: Run Task list down to "NRL: New OpMode (template)".](/img/curriculum/ch06-run-task-palette.png)

The wizard then runs in the terminal. Enter your details when prompted — here's a full example:

```text
============================================================
NRL · Create a New OpMode
============================================================
OpMode name (e.g. DriveStraight): TemplateTest1     # the .cpp file name
Type (teleop/auto) [teleop]: teleop                 # teleop or auto, as needed
Controller display name [TemplateTest1]: templatetest1   # name shown on the Controller
------------------------------------------------------------
OpMode name    : TemplateTest1
Type           : TELEOP
Display name   : templatetest1 (shown on the Controller)
File           : C:\Rushabh\ARDUINO_Libs\NRL\NRL_Update_1\RobotFirmware\opmodes\TemplateTest1.cpp
------------------------------------------------------------
Create this OpMode? (y/n) [y]: y
```

![The new OpMode file generated from the template, ready for you to fill in with your own code.](/img/curriculum/ch06-generated-opmode-file.png)

The new OpMode is generated from a template — ready for you to fill in with your own code.

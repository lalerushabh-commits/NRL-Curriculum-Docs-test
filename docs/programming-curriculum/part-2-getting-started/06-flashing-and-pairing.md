---
title: "Module 2.5: Flashing and Pairing"
sidebar_position: 5
slug: /part-2-getting-started/flashing-and-pairing
---

With a project created, it's time to put firmware on both boards and connect them to each other. The **Controller** and the **Robot** are flashed differently — start with the Controller.

## Step 1 — Install the Python extension

The Controller ships with a prebuilt firmware image, flashed through a small Python script rather than a normal PlatformIO build. Make sure the **Python** extension is installed in VS Code (Extensions icon in the Activity Bar → search "Python" → Install), and let PlatformIO finish initializing first — check its status from the Activity Bar and wait if the status bar still shows "PlatformIO: Loading Tasks."

![Installing the Python extension in VS Code.](/img/curriculum/ch06-install-python-extension.jpg)

*Installing the Python extension in VS Code.*

## Step 2 — Run flash_controller.py

Open **`flash_controller.py`** under `ControllerFirmware`, plug the Controller in over USB, then click the dropdown arrow next to the **Run** button (top-right) and choose **Run Python File**.

![flash_controller.py under ControllerFirmware.](/img/curriculum/ch06-flash-controller-py-location.jpg)

*flash_controller.py under ControllerFirmware.*

![Click the dropdown next to Run and choose "Run Python File" — not the usual PlatformIO Upload.](/img/curriculum/ch06-run-python-file-dropdown.jpg)

*Click the dropdown next to Run and choose "Run Python File" — not the usual PlatformIO Upload.*

:::note[First-time Python]
The wizard is a small Python program. If your computer has no suitable Python installed, the double-click launchers install one for you the first time (a one-time step). You don't have to set anything up by hand.
:::

## Step 3 — Confirm the flash succeeded

Wait for the terminal to report success.

![The terminal confirms the flash succeeded and reminds you to pick your team's WiFi channel on the Controller.](/img/curriculum/ch06-flash-controller-success.jpg)

*The terminal confirms the flash succeeded and reminds you to pick your team's WiFi channel on the Controller.*

## Step 4 — Flash the Robot

Switch to the **RobotFirmware** environment in the bottom status bar, connect the **Robot** board, open **RobotMain.ino** (or an OpMode `.cpp` file), and click **Upload** on the PlatformIO toolbar (or the arrow in the status bar).

:::tip[Upload = Build + Send]
Upload automatically builds first, so you don't need a separate Build step. If Upload fails to find the board, check the USB cable (some are charge-only) and that no other program is using the serial port.
:::

## Step 5 — Check the Robot's OLED

Once the Robot is flashed, its OLED screen shows your team's details.

![The Robot's OLED shows your team details after a successful flash.](/img/curriculum/ch06-oled-team-details-after-flash.jpg)

*The Robot's OLED shows your team details after a successful flash.*

## Step 6 — Match the WiFi channel

The Robot and Controller should be on the same channel before pairing — you can see your WiFi channel of the Robot on the OLED screen. You can change the WiFi channel of both bot and controller under **SETTING → WIFI CHANNEL**.

![Each kit is pinned to a radio channel derived from its team number, so multiple robots can run in the same room.](/img/curriculum/ch06-wifi-channel-setting.jpg)

*Each kit is pinned to a radio channel derived from its team number, so multiple robots can run in the same room.*

## Step 7 — Pair the boards

The bot must be **paired** so they only talk to each other, even in a room full of other kits. Pairing uses the Robot's button and a short code shown on the Controller.

Press the tactile button on the **Robot** for 3 seconds. Then, under the pairing menu, press and hold the left bumper and right bumper on the Controller. This generates a 4-digit random number on the Controller. Check that you see the same number on the Robot's OLED. If you do, press the same button on the Robot for 1 second until it shows "paired."

![Holding the left and right bumpers on the Controller during pairing.](/img/curriculum/ch06-pairing-demo.gif)

*Holding the left and right bumpers on the Controller during pairing.*

![Pressing the tactile button on the Robot (Command Hub) during pairing.](/img/curriculum/ch06-command-hub-pairing-demo.gif)

*Pressing the tactile button on the Robot (Command Hub) during pairing.*

Once paired, the link is remembered (saved in the board's non-volatile memory), so you only pair once. The Controller's header shows the connection status and the Robot's battery voltage.

## The Controller, at a glance

![The Controller's header at a glance: firmware version, WiFi channel, robot battery voltage, controller battery percentage, robot connection status, the driver station screen, and the controller status LED.](/img/curriculum/ch06-controller-info.png)

*The Controller's header at a glance: firmware version, WiFi channel, robot battery voltage, controller battery percentage, robot connection status, the driver station screen, and the controller status LED.*

You drive the whole match from the Controller. Here is the button map you'll use constantly:

| Control | In the menu | During a match |
| --- | --- | --- |
| D-pad Up / Down | Scroll the OpMode list. | Free for your program to use. |
| D-pad Left / Right | Move across the MENU carousel. | Free for your program to use. |
| X button | Select / confirm. | Free for your program to use. |
| Y button | Go back. | Free for your program to use. |
| INIT / START / STOP | Run controls for the selected OpMode. | START begins the match; STOP ends it. |

## Step 8 — Wait for the first-time load

Once your project is generated, the VS Code window opens with both the Controller and Robot firmware loaded. The first time it opens you'll see the loading screen below — indexing and initializing the whole firmware takes about 10 minutes, so let it finish before you start.

![VS Code indexing and initializing the whole firmware for the first time.](/img/curriculum/ch06-vscode-loading.png)

## Step 9 — Open the OpMode creation task

Once the project has finished loading, follow this same sequence each time you want to create a new OpMode. Open the command palette with **Ctrl + Shift + P** and select **Tasks: Run Task**.

![Opening the command palette and selecting "Tasks: Run Task".](/img/curriculum/ch06-run-task-command.png)

*Opening the command palette and selecting "Tasks: Run Task".*

## Step 10 — Fill in the wizard

From the task list, select **NRL: New OpMode** — *"Create a new robot OpMode (TeleOp or Auto) from a minimal template."*

![Selecting "NRL: New OpMode" from the task list.](/img/curriculum/ch06-new-opmode-task.png)

*Selecting "NRL: New OpMode" from the task list.*

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

## Step 11 — Your new OpMode is ready

The new OpMode is generated from a template — ready for you to fill in with your own code.

![The new OpMode file generated from the template, ready for you to fill in with your own code.](/img/curriculum/ch06-first-opmode-generated.png)

*The new OpMode file generated from the template, ready for you to fill in with your own code.*

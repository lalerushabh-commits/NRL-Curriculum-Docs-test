---
title: "Module 2.3: Creating Your Own Project (HexaSDK)"
sidebar_position: 3
slug: /part-2-getting-started/creating-your-own-project
---

Rather than editing the shared template directly, each team makes its **own copy** of the project, stamped with the team's number and name. NRL includes a wizard called **HexaSDK** to do exactly this — it is the NRL equivalent of WPILib's *"Create a new project."* Now that VS Code and PlatformIO are installed, here is the complete walkthrough, start to finish.

## Step 1 — Get the project files

Go to the NRL kit's GitHub repository.

![The NRL kit repository on GitHub.](/img/curriculum/ch04-step01-repo-page.jpg)

*The NRL kit repository on GitHub.*

## Step 2 — Download the ZIP

Click the green **`<> Code`** button and select **Download ZIP**.

![Click the green Code button, then Download ZIP.](/img/curriculum/ch04-step02-download-zip.jpg)

*Click the green Code button, then Download ZIP.*

## Step 3 — Extract the ZIP

Once it has downloaded, right-click the ZIP file and select **Extract All**.

![Right-click the downloaded ZIP and choose Extract All.](/img/curriculum/ch04-step03-extract-zip.jpg)

*Right-click the downloaded ZIP and choose Extract All.*

## Step 4 — Open the tools folder

Inside the extracted folder, double-click into **`tools`**.

![Inside the extracted folder, open the tools folder.](/img/curriculum/ch04-step04-open-tools-folder.jpg)

*Inside the extracted folder, open the tools folder.*

## Step 5 — Run the launcher

Double-click **`new-nrl-project`** (the Windows Batch File) — this is the launcher/project generator.

![Double-click new-nrl-project (Windows Batch File) to start the wizard.](/img/curriculum/ch04-step05-new-nrl-project-launcher.jpg)

*Double-click new-nrl-project (Windows Batch File) to start the wizard.*

:::note[Windows only, for now]
NRL currently supports Windows. macOS and Linux are not yet compatible.
:::

## Step 6 — Confirm the security prompt

A Windows "publisher could not be verified" warning pops up — click **Run**. This is expected: the script isn't digitally signed, but it's the same launcher from the kit you just downloaded.

![Windows shows a security warning because the script is unsigned — click Run to continue.](/img/curriculum/ch04-step06-security-warning-run.jpg)

*Windows shows a security warning because the script is unsigned — click Run to continue.*

:::note[First-time Python]
The wizard is a small Python program. If your computer has no suitable Python installed, the double-click launchers install one for you the first time (a one-time step). You don't have to set anything up by hand.
:::

## Step 7 — Fill in your team details

A terminal window opens and asks for your **project name**, **team number**, and **team name**.

![Enter the project name, team number, and team name in the terminal wizard.](/img/curriculum/ch04-step07-fill-team-details.jpg)

*Enter the project name, team number, and team name in the terminal wizard.*

## Step 8 — Choose where to save it

A Windows Explorer window opens automatically — pick the folder where you want the project saved.

![A file explorer window opens for you to choose the save location.](/img/curriculum/ch04-step08-choose-save-location.jpg)

*A file explorer window opens for you to choose the save location.*

## Step 9 — Confirm and generate

The wizard fills in the details and shows the **ESP-NOW channel** it derived for your team, plus the save location. Note that channel down — you'll want it for pairing later. Press **Y** to generate the project.

![The wizard confirms your details, including the ESP-NOW channel — press Y to generate.](/img/curriculum/ch04-step09-confirm-generate.jpg)

*The wizard confirms your details, including the ESP-NOW channel — press Y to generate.*

## Step 10 — Project created

Once generation finishes, you'll see a confirmation like this.

![The wizard reports the project was generated successfully.](/img/curriculum/ch04-step10-project-generated.jpg)

*The wizard reports the project was generated successfully.*

## Step 11 — VS Code opens automatically

VS Code launches with your new project already loaded. The first setup takes about **10–15 minutes**, because PlatformIO needs to initialize and download dependencies — let it finish before you start building.

![VS Code opens automatically with the new project. First-time PlatformIO setup takes 10–15 minutes.](/img/curriculum/ch04-step11-vscode-opens-automatically.jpg)

*VS Code opens automatically with the new project. First-time PlatformIO setup takes 10–15 minutes.*

## Step 12 — Always reopen via the workspace file

An NRL project contains **two** firmware folders — one for the Robot, one for the Controller. To let VS Code and PlatformIO see both at once, always open the project through its **workspace file**, never the bare folder.

![Always reopen the project through its .code-workspace file.](/img/curriculum/ch04-step12-reopen-code-workspace.jpg)

*Always reopen the project through its .code-workspace file.*

If you close VS Code, remember where you saved the project, then:

1. In VS Code choose **File → Open Workspace from File...**
2. Select the file ending in **`.code-workspace`** (named after the project name you entered in Step 7).
3. If PlatformIO needs to re-download anything, let it finish before you start building.

:::warning[Don't open the bare folder]
If you open the plain folder instead of the `.code-workspace` file, PlatformIO only sees one firmware at a time and IntelliSense (code auto-complete) may show phantom errors. Always open the workspace file.
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

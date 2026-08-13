---
title: "Module 2.2: Installing the Software"
sidebar_position: 2
slug: /part-2-getting-started/installing-the-software
---

You need exactly **two** free programs on your computer. That's it — everything else installs itself the first time you build a project.

1. **Visual Studio Code (VS Code)** — a free code editor from Microsoft. Download it from [code.visualstudio.com](https://code.visualstudio.com) and install it like any normal app.

![The VS Code download page — pick the installer for your operating system (Windows, macOS, or Linux).](/img/curriculum/ch03-vscode-download.png)

*The VS Code download page — pick the installer for your operating system (Windows, macOS, or Linux).*

2. **The PlatformIO IDE extension** — this is the piece that compiles your code and uploads it to the robot. Open VS Code, click the **Extensions** icon in the left sidebar (the four-squares icon), search for **"PlatformIO IDE"**, and click **Install**.

![Searching for "PlatformIO IDE" in the VS Code Extensions marketplace. Install the one published by PlatformIO.](/img/curriculum/ch03-platformio-extension.png)

*Searching for "PlatformIO IDE" in the VS Code Extensions marketplace. Install the one published by PlatformIO.*

:::note[What is PlatformIO?]
PlatformIO is a build system for microcontrollers. When you press *Build*, it turns your C++ into a binary the ESP32-S3 can run; when you press *Upload*, it sends that binary to the board over USB. It also downloads any code libraries your project needs — automatically, the first time you build.
:::

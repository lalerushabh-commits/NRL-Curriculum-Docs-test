---
title: "Module 1.2: A Five-Minute C++ Primer"
sidebar_position: 2
slug: /part-1-foundations/cpp-primer
---

NRL programs are written in **C++**. You do not need to master C++ to use this book — you need a handful of ideas. This chapter covers exactly those, and nothing else. Every concept here shows up in the real robot code later, so we frame each one with a robot example.

:::note[You will not memorize this]
Skim this chapter now to recognize the words. You will actually *learn* it by writing the programs in Parts 2 and 3. Come back here whenever a symbol looks unfamiliar.
:::

## 2.1 · Values and variables

A **variable** is a named box that stores a value. Every variable has a **type** — the kind of value it holds. These four types cover almost everything you will do:

| Type | Holds | Robot example |
| --- | --- | --- |
| `int` | A whole number. | A motor speed from -255 to 255. |
| `float` | A number with a decimal point. | A joystick reading like 0.75, or an angle like 90.0. |
| `bool` | Either true or false. | Is the gripper open? Is a button pressed? |
| `const char*` | A piece of text (a "string"). | A label like `"speed"` you send to the screen. |

You **declare** a variable by writing its type, a name, and (optionally) a starting value:

```cpp
int motorSpeed = 150;   // a whole number
float turnAmount = 0.5; // a decimal number
bool isArmUp = false;   // true or false
```

The `=` sign means *"put this value into the box."* You can change a variable later just by assigning a new value: `motorSpeed = 0;`.

## 2.2 · Doing things: functions and methods

A **function** is a named block of instructions you can run ("call") by name. When a function belongs to an object, we call it a **method**. You call one by writing its name followed by parentheses, with any inputs (**arguments**) inside:

```cpp
leftMotor.setSpeed(150); // call setSpeed on leftMotor, with the argument 150
drive.stop();            // call stop — it needs no arguments, so ()
```

Some functions **return** a value you can store or use. `gamepad1.leftY()` returns the up/down position of the left joystick as a float:

```cpp
float forward = gamepad1.leftY(); // read the joystick, keep the number
```

## 2.3 · Making decisions: if / else

An `if` statement runs a block of code **only when a condition is true**. The optional `else` runs when it is false:

```cpp
if (gamepad1.pressed(BTN_A)) {
  gripper.setPosition(0);  // A is held down -> open the gripper
} else {
  gripper.setPosition(40); // A is not held -> close it
}
```

Conditions are built from **comparison** and **logic** operators:

| Operator | Means | Operator | Means |
| --- | --- | --- | --- |
| `==` | is equal to | `&&` | AND (both must be true) |
| `!=` | is not equal to | <code>&#124;&#124;</code> | OR (either can be true) |
| `>` `<` | greater / less than | `!` | NOT (flips true/false) |
| `>=` `<=` | greater-or-equal / less-or-equal | | |

:::warning[One equals sign vs. two]
`=` **assigns** a value (`x = 5`). `==` **compares** two values (`if (x == 5)`). Mixing them up is the single most common beginner bug in C++.
:::

## 2.4 · The idea of a class

A **class** is a blueprint that bundles data and the methods that act on it. `HexaServo` is a class: it knows a servo's pin and current angle, and it offers methods like `setPosition()`. When you write:

```cpp
static HexaServo arm{{ .signalPin = SERVO_1, .startAngle = 90.0f }};
```

...you are creating **one servo object** named `arm`, built from the `HexaServo` blueprint, configured for the pin labeled `SERVO_1` and told to start at 90°. From then on, `arm.setPosition(45)` moves *that* servo.

Your OpMode is itself a class. `class MyProgram : public NRLOpMode` means *"MyProgram is a kind of NRLOpMode."* It **inherits** the machinery of the base class and fills in the `init` / `loop` / `stop` methods with your behavior. That is the whole trick behind the framework.

## 2.5 · A few symbols you will see

| Symbol | What it means |
| --- | --- |
| `;` | Ends a statement. (Almost) every line ends with a semicolon. |
| `{ }` | Groups a block of statements — a function body, an if block, an object's insides. |
| `//` | A comment. Everything after it on the line is a note for humans; the robot ignores it. |
| `#include "NRL.h"` | Pulls in the NRL framework so your file can use its features. First line of every OpMode. |
| `.` (dot) | Reaches into an object to use its method: `arm.setPosition(90)`. |
| `::` | Reaches into a *class or namespace* directly: `NRLComms::getHeading()`. |

:::tip[That is genuinely enough]
With variables, functions, if/else, and the class idea, you can read and modify every program in this book. Let's get the tools installed.
:::

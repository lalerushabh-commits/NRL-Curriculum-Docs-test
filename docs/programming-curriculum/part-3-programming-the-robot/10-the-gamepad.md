---
title: 10. The Gamepad
sidebar_position: 4
slug: /part-3-programming-the-robot/the-gamepad
---

import ApiTable from '@site/src/components/ApiTable';

Everything the driver does on the Controller reaches your program through one ready-made object: **`gamepad1`**. You don't declare it — it's always there, refreshed automatically at the start of every `loop()`.

## Reading the joysticks

Each joystick axis returns a float from **-1.0 to +1.0**:

<ApiTable rows={[
  {member: 'gamepad1.leftY()', description: 'Left stick up/down. Up is positive — the usual "forward."'},
  {member: 'gamepad1.leftX()', description: 'Left stick left/right.'},
  {member: 'gamepad1.rightX()', description: 'Right stick left/right — the usual "turn."'},
  {member: 'gamepad1.rightY()', description: 'Right stick up/down.'},
]} />

## Reading the buttons

There are three ways to ask about a button, and choosing the right one matters:

<ApiTable rows={[
  {member: 'pressed(BTN_X)', description: 'True while the button is held down right now. Use for continuous actions (drive faster while held).'},
  {member: 'justPressed(BTN_X)', description: 'True for the one pass the button went down. Use for one-shot actions (toggle, fire a sequence).'},
  {member: 'justReleased(BTN_X)', description: 'True for the one pass the button went up. Use for acting on release.'},
]} />

## The button names

| Constant | Button | Constant | Button |
| --- | --- | --- | --- |
| `BTN_X` | X face button | `BTN_DPAD_UP` | D-pad up |
| `BTN_A` | A face button | `BTN_DPAD_DOWN` | D-pad down |
| `BTN_Y` | Y face button | `BTN_DPAD_LEFT` | D-pad left |
| `BTN_LB` / `BTN_RB` | left / right bumper | `BTN_DPAD_RIGHT` | D-pad right |
| | | `BTN_LT` / `BTN_RT` | left / right trigger toggle |

:::warning[BTN_Y is off-limits]
`BTN_Y` always triggers the system STOP and is not usable in your program. Build your controls around the other buttons.
:::

## The edge-detection toggle pattern

A very common need: press a button once to toggle something (open/close a gripper). If you check `pressed()` in `loop()`, it's true for *every* pass the button is held — dozens of times — so the gripper flickers. The fix is `justPressed()`, which is true for exactly **one** pass per press:

```cpp
bool _open = false;

void loop() override {
  if (gamepad1.justPressed(BTN_RB)) { // exactly one toggle per press
    _open = !_open;
    gripper.setPosition(_open ? 0 : 40);
  }
}
```

## Optional: button bindings

For simple "when pressed, do this" actions, you can register a callback once in `init()` instead of checking every pass:

```cpp
void init() override {
  gamepad1.onPress(BTN_A, []{ arm.setPosition(120); });
  gamepad1.onPress(BTN_B, []{ arm.setPosition(30); });
}
```

:::tip[Which to use?]
Use `justPressed()` in `loop()` for most things — it keeps all your logic in one place. Reach for `onPress()` bindings when you have a lot of independent one-shot buttons and want to keep `loop()` tidy. For multi-step sequences, use Actions ([Chapter 17](/part-4-autonomous-and-advanced/the-action-system)).
:::

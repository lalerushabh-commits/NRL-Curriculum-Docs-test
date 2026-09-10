---
title: "Module 1.4: Conditionals & Loops"
sidebar_position: 4
slug: /part-1-foundations/conditionals-and-loops
---

import Answer from '@site/src/components/Answer';

Making decisions and repeating work.

## if

Run a block of code only when something is true.

```cpp
int battery = 15;

if (battery < 20) {
    std::cout << "Battery low!\n";
}
```

```cpp
if (condition) {
    // runs only when
    // condition is true
}
```

The condition is just a `bool` — anything that evaluates to true or false works here: a comparison, a bool variable, or several joined with `&&` and `||`.

:::warning[No semicolon after the )]
Writing `if (x < 5);` creates an empty `if`, and the block below it then runs every time. The compiler will not warn you.
:::

## if / else

Exactly one of the two blocks runs. Never both, never neither.

```cpp
int battery = 55;

if (battery < 20) {
    std::cout << "Battery low\n";
} else {
    std::cout << "Battery OK\n";
}
```

```text
Battery OK
```

`else` is the catch-all: "in every other case." It doesn't get its own `( )` — if you want to test something else, you need `else if`.

:::tip
Change 55 to 10 and run it again. Watching the other branch fire is worth more than reading three paragraphs about it.
:::

## else if chains

Test several conditions in order. The first one that is true wins.

```cpp
int score = 78;

if (score >= 90) {
    std::cout << "Grade A\n";
} else if (score >= 75) {
    std::cout << "Grade B\n";
} else if (score >= 60) {
    std::cout << "Grade C\n";
} else {
    std::cout << "Grade F\n";
}
```

```text
Grade B
```

78 fails the first test, passes the second, and C++ stops there. The third test is never even looked at.

:::keyidea[Order matters enormously]
Put `>= 60` first and every passing score becomes a C, because it matches before the higher tests get a chance. Go strictest first.
:::

## switch

A cleaner way to branch when you're comparing one value against fixed options.

```cpp
int mode = 2;

switch (mode) {
    case 1:
        std::cout << "Manual\n";
        break;
    case 2:
        std::cout << "Auto\n";
        break;
    default:
        std::cout << "Unknown\n";
}
```

Three parts:

- `case` — one specific value to match
- `break` — stop here, leave the switch
- `default` — none of the above

:::warning[Forget break and it falls through]
Execution keeps running into the next case instead of stopping. It prints Auto AND Unknown. Occasionally useful, usually a bug.
:::

## The ?: shortcut

An if/else squeezed into one line that produces a value.

```cpp
int battery = 15;

std::string status = (battery < 20) ? "LOW" : "OK";
std::cout << status << "\n";      // LOW
```

Read it as: `condition ? A : B` → "if condition then A, otherwise B."

:::note[Never nest them]
`a ? b : c ? d : e` is legal and nobody can read it. Use if/else the moment there are three outcomes. You'll read `?:` more than you write it — it's everywhere in real code, so you need to recognise it, but a plain if/else is easier to read. Reach for `?:` only when it genuinely shortens things.
:::

## while

Keep repeating a block for as long as a condition stays true.

```cpp
int count = 0;

while (count < 3) {
    std::cout << count << " ";
    count++;
}
// prints: 0 1 2
```

Every `while` needs three things:

1. A starting value (`count = 0`)
2. A condition to test (`count < 3`)
3. Something that moves it towards false (`count++`)

:::warning[Drop the third and it never ends]
Leave out `count++` and the condition stays true forever. The program hangs and you have to kill it.
:::

## for

The same three parts as a `while`, gathered onto one line where you cannot forget them.

```cpp
for (int i = 0; i < 5; i++) {
    std::cout << i << " ";
}
// prints: 0 1 2 3 4
```

- `int i = 0` — **Start**: runs once, before anything else.
- `i < 5` — **Test**: checked before every pass; stop when false.
- `i++` — **Step**: runs after every pass.

Use `for` when you know how many times — "do this 5 times." Use `while` when you don't — "keep going until the user quits." Counting from 0 looks odd at first but it's the C++ convention. Get used to reading `i < 5` as "five times."

## do / while

Same as `while`, except the body always runs at least once.

```cpp
int n = 10;

do {
    std::cout << n << " ";
    n++;
} while (n < 3);

// prints: 10
```

The condition is tested at the **bottom**, so the body has already run once by the time C++ discovers `10 < 3` is false.

:::tip[When you want it]
Menus and prompts: show the menu first, then decide whether to show it again.
:::

:::note[Note the semicolon]
`do/while` is the one loop that ends with a `;` after the closing `while ( )`.
:::

## break and continue

Two ways to change a loop's normal flow mid-pass.

```cpp
for (int i = 0; i < 6; i++) {
    if (i == 2) continue;   // skip just this one
    if (i == 4) break;      // stop the loop entirely
    std::cout << i << " ";
}
// prints: 0 1 3
```

- **`continue`** — abandon this pass, jump straight to the next one. The loop carries on.
- **`break`** — leave the loop right now. Nothing after it in the loop ever runs.

Trace it: 0 and 1 print. At 2, `continue` skips the print. 3 prints. At 4, `break` ends the loop, so 4 and 5 never appear.

## Common mistakes: loops

**The infinite loop.**

```cpp
int i = 0;
while (i < 5) {
    std::cout << i;
    // forgot i++
}
```

Nothing changes `i`, so the condition is true forever. The program freezes.

**The stray semicolon.**

```cpp
for (int j = 0; j < 5; j++);
{
    std::cout << j;
}
```

The `;` ends the loop immediately. The block below is not the loop body and `j` does not exist there.

**Off by one.**

```cpp
for (int i = 0; i <= 5; i++)
// runs 6 times: 0,1,2,3,4,5

for (int i = 0; i < 5; i++)
// runs 5 times: 0,1,2,3,4
```

`<` and `<=` differ by exactly one pass. Decide which you meant.

## Your turn

Trace each loop on paper, one pass at a time.

**Q1.** What prints?

```cpp
for (int i = 1; i <= 3; i++) {
  std::cout << i * i << " ";
}
```

<Answer>`1 4 9` — `i` takes 1, 2 and 3, and `i * i` gives 1, 4 and 9. Note `<= 3` means it does run for 3.</Answer>

**Q2.** How many times?

```cpp
int n = 0;
do {
  std::cout << "run ";
} while (n > 5);
```

<Answer>Once — the condition is tested at the bottom. `0 > 5` is false, but the body has already run.</Answer>

**Q3.** What prints?

```cpp
int score = 60;

if (score >= 90) {
  std::cout << "A";
} else if (score >= 60) {
  std::cout << "C";
} else {
  std::cout << "F";
}
```

<Answer>`C` — 90 fails, 60 >= 60 passes, so the chain stops there. The else is never reached.</Answer>

:::tip[How to trace a loop on paper]
Draw two columns: pass number and variable value. Add one row per pass until the condition fails. The rows are your output.
:::

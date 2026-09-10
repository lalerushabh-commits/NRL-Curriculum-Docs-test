---
title: "Module 1.1: Introduction to C++"
sidebar_position: 1
slug: /part-1-foundations/introduction-to-cpp
---

This is where the C++ section of the book starts — five modules covering plain C++, with no robot or NRL framework code at all. Everything you learn here works in any C++ program, anywhere, on any computer.

## How to follow along

You do not need to install anything yet. Open any free online C++ compiler in your browser — an [online GDB compiler](https://www.onlinegdb.com/online_c++_compiler) works well — and type each example yourself. Don't just read them: type them, then change one thing and see what happens. That's the whole job.

## What is C++?

C++ is a language you write in English-ish text that gets turned into instructions a machine runs, in three steps:

1. **You write** `main.cpp` — text you can read.
2. **The compiler** translates it into machine code.
3. **The machine runs** it — the program does the thing.

:::keyidea[The one rule that trips everyone up]
The compiler does exactly what you wrote — not what you meant. A missing semicolon or a stray bracket stops the whole build. That feels harsh at first. It's also why C++ programs can be trusted to run fast and predictably.
:::

A few things follow from this:

- **Compiled, not interpreted** — errors are caught before the program ever runs.
- **Fast and close to the hardware** — why phones, games, cars, and robots use it.
- **Strict about types** — you must say what kind of value each thing holds.

## Anatomy of a C++ program

Every program you write starts from this shape:

```cpp
#include <iostream>

int main() {
    std::cout << "Hello, robot!";
    return 0;
}
```

Reading it line by line:

- `#include <iostream>` brings in the ability to print.
- `int main() { ... }` is where the program starts. Every program has exactly one.
- `{ }` braces group the lines that belong together.
- `;` ends every statement. Forgetting it is the #1 beginner error.
- `return 0;` tells the system "finished, no problems."

## Printing output

`std::cout` sends text to the screen. The `<<` arrows point the way the data flows.

```cpp
std::cout << "Line one" << std::endl;
std::cout << "Line two\n";
std::cout << "Sum: " << 3 + 4 << "\n";
```

```text
Line one
Line two
Sum: 7
```

:::note[endl or \n?]
Both end the line. `\n` is simply a character inside the text; `std::endl` also forces the text out immediately. Use `\n` unless you have a reason not to.
:::

You can chain as much as you like — keep adding `<<` to print text and numbers in one statement.

## Comments

Notes for humans. The compiler ignores them completely.

```cpp
// This is a single-line comment

/* This comment
   spans several lines. */

int speed = 120;   // trailing comment
```

- `//` ignores the rest of that line.
- `/* */` ignores everything in between, across lines.

:::tip[A comment is also an off switch]
Putting `//` in front of a line disables it without deleting it — the fastest way to test "what if this line weren't here?"
:::

**Write why, not what.** "add 1 to speed" is useless — the code already says that. "slow ramp to protect the gears" is worth writing.

Next up: putting values in named boxes, in [Module 1.2](/part-1-foundations/variables-and-data-types).

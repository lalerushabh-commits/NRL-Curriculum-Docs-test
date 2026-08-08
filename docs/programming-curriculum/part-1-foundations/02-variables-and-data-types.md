---
title: "Module 1.2: Variables & Data Types"
sidebar_position: 2
slug: /part-1-foundations/variables-and-data-types
---

import Answer from '@site/src/components/Answer';

This is where the C++ section of the book starts — four modules covering plain C++, with no robot or NRL framework code at all. Everything you learn here works in any C++ program, anywhere, on any computer.

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

## Variables

A named box that holds a value you can read back and change later.

```cpp
int   count = 0;       // declare + initialize
float speed = 1.5f;

count = 10;            // assign a new value
count = count + 5;     // now 15
```

Three things to declare one:
- A **type** — what kind of value (`int`)
- A **name** — how you refer to it (`count`)
- A **value** — what goes in it (`0`)

:::keyidea[= means "put into," not "is equal to"]
`count = count + 5` is not maths nonsense. It reads: take what is in `count`, add 5, put the result back into `count`.
:::

Naming rules:
- Letters, digits, and `_` only — no spaces.
- Cannot start with a digit.
- Case matters: `count` and `Count` differ.
- Name it for what it holds, not `x2` or `temp`.

## Reading input

`std::cin` takes what the user types and puts it into a variable.

```cpp
int age;
std::cout << "Enter your age: ";
std::cin >> age;
std::cout << "You are " << age << "\n";
```

- `cout <<` — data goes **out** to the screen.
- `cin >>` — data comes **in** to your variable.

Point the arrows at where the data is going.

:::warning[Always prompt first]
Without the `cout` line, the program just sits there with a blank screen and the user has no idea it's waiting for them.
:::

**Type still matters.** `age` is an `int`, so `cin` expects a whole number. Type "hello" and the read fails and `age` keeps its old value.

## int and float

The two number types you'll use constantly.

```cpp
int   ticks = 42;
float ratio = 0.75f;
float half  = 1.0f / 2.0f;   // 0.5
int   whole = 7 / 2;         // 3, not 3.5
```

**`int`** — whole numbers only: -3, 0, 42. No fractional part, ever. Use for counts, indexes, steps.

**`float`** — numbers with a decimal: 0.75, -1.5. Use for measurements and ratios. Write `0.75f`, not `0.75`.

:::note[Why the f suffix?]
Plain `0.75` is a `double` (a bigger, slower decimal type). Writing `0.75f` says "this is a float." It costs one keystroke and avoids a silent conversion.
:::

## bool — true or false

The type behind every decision a program makes.

```cpp
bool isReady   = true;
bool isRunning = false;

isReady = !isReady;      // now false
std::cout << isReady;    // prints 0
```

- `true` prints as `1`
- `false` prints as `0`
- `!` flips it — read as "not." `!isReady` means "the opposite of isReady." Assigning it back to itself is the standard way to toggle something on and off.

:::tip[Name bools as a question]
`isReady`, `hasPower`, `doneCalibrating`. Then `if (isReady)` reads like a sentence. A bool called `flag` or `b` tells the next reader nothing.
:::

## char, double and string

Three more types you'll meet early.

```cpp
char        grade   = 'A';        // single quotes
std::string name    = "NRL";      // double quotes
double      precise = 3.14159265358979;

std::cout << name << " got " << grade << "\n";
```

- **`char`** — one single character: `'A'`, `'z'`, `'7'`.
- **`std::string`** — text of any length: `"Rushabh"`.
- **`double`** — like `float`, more decimal places: `3.14159265`.

:::warning[Quotes are not decoration]
`'A'` with single quotes is one `char`. `"A"` with double quotes is a `string`. They are different types. Mixing them up is a common first error.
:::

**float or double?** `double` holds far more decimal digits but uses more memory and time. On small computers and microcontrollers, prefer `float`.

## const — values that must not change

Say it out loud and the compiler will enforce it for you.

```cpp
const int   MAX_SPEED = 255;
const float PI        = 3.14159f;

// MAX_SPEED = 300;   // error: cannot assign to a const
```

What you get:
- The compiler blocks any accidental change.
- One place to edit when the number changes.
- A name explains what `255` actually means.

:::note[The real cost of a bare number]
If `255` appears in nine places, changing it means finding all nine and not missing one. With a `const`, you change one line.
:::

Constants are usually written in `CAPITALS_WITH_UNDERSCORES` so they stand out from ordinary variables.

## Common mistakes: numbers

**1. Integer division throws away the remainder.**

```cpp
int   a = 7 / 2;      // 3    both are ints -> int division
float b = 7 / 2;      // 3.0  divided as ints first
float c = 7.0f / 2;   // 3.5  correct
```

If both sides of `/` are whole numbers, C++ does whole-number division and drops the rest. Making just one side a float fixes it.

**2. An uninitialized variable holds garbage.**

```cpp
// wrong
int d;
std::cout << d;   // unpredictable

// right
int d = 0;
std::cout << d;   // 0, always
```

## Your turn

Work these out on paper first — then run them and see if you were right.

**Q1.** What prints?
```cpp
int x = 9;
int y = 2;
std::cout << x / y
          << " "
          << x % y;
```
<Answer>`4 1` — `9 / 2` is integer division, so 4. Then `9 % 2` is the remainder left over, which is 1.</Answer>

**Q2.** What prints?
```cpp
bool done = false;
std::cout << !done;
```
<Answer>`1` — `done` is false, so `!done` is true, and true prints as 1.</Answer>

**Q3.** Spot the bug — expected `2.5`:
```cpp
float temp = 5 / 2;
std::cout << temp;
```
<Answer>Prints `2`. `5 / 2` is computed as ints before the answer is stored in a float. Fix: write `5.0f / 2`.</Answer>

:::tip[Stuck? Trace it like the computer does]
Read one line at a time and write down what every variable holds after that line. By the time you reach the `cout` you already have the answer.
:::

---
title: "Module 1.2: Variables & Data Types"
sidebar_position: 2
slug: /part-1-foundations/variables-and-data-types
---

import Answer from '@site/src/components/Answer';

Naming boxes that hold values.

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

---
title: "Module 1.5: Functions & Scope"
sidebar_position: 5
slug: /part-1-foundations/functions-and-scope
---

import Answer from '@site/src/components/Answer';

Naming a chunk of work and reusing it.

## Why functions?

A function gives a name to a piece of work so you can do it again without repeating yourself.

```cpp
// without
std::cout << "====\n";
std::cout << " MENU\n";
std::cout << "====\n";
// ... later ...
std::cout << "====\n";
std::cout << " MENU\n";
std::cout << "====\n";
```

```cpp
// with
void showMenu() {
    std::cout << "====\n";
    std::cout << " MENU\n";
    std::cout << "====\n";
}

showMenu();
// ... later ...
showMenu();
```

- **Change it once** — fix the menu in one place, not in nine.
- **Read it faster** — `showMenu()` says what happens. Three `cout` lines make you work it out.
- **Test it alone** — a small named piece is far easier to check than a giant `main()`.

## Defining and calling

Write it once above `main`. Then use its name as many times as you like.

```cpp
#include <iostream>

void greet() {
    std::cout << "Hello!\n";
}

int main() {
    greet();
    greet();
    return 0;
}
```

Anatomy of `void greet() { }`: `void` (returns nothing) — `greet` (name) — `()` (no inputs) — `{ }` (body).

:::note[Defining is not running]
The body sits there doing nothing until something calls `greet()`. Output here is "Hello!" twice — once per call.
:::

## Parameters

Pass values in so the same function can do the job on different data.

```cpp
void greet(std::string name) {
    std::cout << "Hello, " << name << "!\n";
}

int main() {
    greet("Aarav");
    greet("Priya");
    return 0;
}
```
```text
Hello, Aarav!
Hello, Priya!
```

You can take more than one: `void move(int x, int y)`, called as `move(10, 4);`.

:::tip[Parameter vs argument]
`name` is the **parameter** — the placeholder in the definition. `"Aarav"` is the **argument** — the actual value you hand over at the call.
:::

## Return values

A function can hand a value back to whoever called it.

```cpp
int add(int a, int b) {
    return a + b;
}

int main() {
    int total = add(3, 4);   // total is 7
    std::cout << total;
    return 0;
}
```

`int add(...)` promises to hand back an `int`. If you promise a value you must actually return one.

- **`void` means no promise** — a void function hands nothing back. You can still write a bare `return;` to leave it early.
- **`return` ends the function immediately** — any lines after it never run. That's a feature: return early on bad input instead of nesting deeper ifs.

## Declare before you use

C++ reads your file top to bottom and will not call something it hasn't seen yet.

```cpp
#include <iostream>

void greet();       // declaration (prototype)

int main() {
    greet();        // OK: compiler already knows it
    return 0;
}

void greet() {      // definition, further down
    std::cout << "Hi\n";
}
```

Two ways to be safe: define every function above `main`, or declare it above and define it below.

:::note[A prototype is the signature only]
Return type, name, parameter types, then a semicolon — no body. It tells the compiler what to expect.
:::

## Scope — where a variable lives

A variable exists only inside the braces it was declared in.

```cpp
int outer = 1;
{
    int inner = 2;
    std::cout << outer << inner;   // both visible
}
// std::cout << inner;   // error: inner is gone
```

The rule: created at its declaration, destroyed at the closing brace, visible to inner blocks, never to outer ones.

:::keyidea[This is why loop counters vanish]
`int i` declared inside `for ( )` belongs to the loop. After the closing brace it no longer exists — which is exactly what you want.
:::

**Functions cannot see each other's variables.** A variable inside `main()` is invisible inside `greet()`. That's what parameters are for.

## Global variables

Declared outside every function, so every function can see them.

```cpp
#include <iostream>

int matchCount = 0;    // global: seen everywhere

void recordMatch() {
    matchCount++;      // no parameter needed
}

int main() {
    recordMatch();
    recordMatch();
    std::cout << matchCount;   // 2
    return 0;
}
```

Handy: no need to pass the value into every function that touches it.

:::warning[Use sparingly]
Any function can change a global, so when the value is wrong you have to check the whole program to find out who did it. Prefer parameters and return values.
:::

## Your turn

Last set. Trace the calls carefully.

**Q1.** What prints?
```cpp
int twice(int n) {
  return n * 2;
}

std::cout << twice(twice(3));
```
<Answer>`12` — the inner call runs first: `twice(3)` is 6. That 6 is then passed out to `twice` again, giving 12.</Answer>

**Q2.** Spot the bug:
```cpp
int square(int n) {
  int result = n * n;
}
```
<Answer>No return — it promises an `int` but never returns one, so the value you get back is undefined. Fix: add `return result;`</Answer>

**Q3.** What prints?
```cpp
void tick() {
  int x = 0;
  x++;
  std::cout << x;
}

tick();
tick();
```
<Answer>`11` — `x` is local to `tick()`, so it's created fresh at 0 on every call. It never carries over. Two calls, two 1s.</Answer>

:::note[Remember]
A local variable is created fresh every time the function is called and destroyed when it returns. Nothing carries over between calls.
:::

## Recap

Everything across these four modules is plain C++. It works in any C++ program, anywhere.

| Module | Covers |
| --- | --- |
| [1.2 — Variables & Types](/part-1-foundations/variables-and-data-types) | `int`, `float`, `bool`, `char`, `string`, `const`. Say what a thing is before you use it. |
| [1.3 — Operators](/part-1-foundations/operators) | `+ - * / %`, the six comparisons, and `&& \|\| !` to join them. |
| 1.4 — Conditionals & Loops | `if` / `else if` / `else`, `switch`, `while`, `for`, `do-while`, `break`, `continue`. |
| 1.5 — Functions & Scope | Name a piece of work, pass values in, hand a value back. Braces decide what's visible. |

**Keep going**: [w3schools.com/cpp](https://www.w3schools.com/cpp/cpp_intro.asp) and [geeksforgeeks.org/c-plus-plus](https://www.geeksforgeeks.org/cpp/c-plus-plus/) are both good for extra practice.

:::tip
Redo every example on this page and the previous three from memory before moving on to the rest of the book — that's the fastest way to make it stick.
:::

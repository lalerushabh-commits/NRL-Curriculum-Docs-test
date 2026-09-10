---
title: "Module 1.3: Operators"
sidebar_position: 3
slug: /part-1-foundations/operators
---

import Answer from '@site/src/components/Answer';

Maths, plus a few operators you've probably never used before.

## Arithmetic operators

```cpp
int a = 17, b = 5;

std::cout << a + b << "\n";   // 22
std::cout << a - b << "\n";   // 12
std::cout << a * b << "\n";   // 85
std::cout << a / b << "\n";   // 3   integer division
std::cout << a % b << "\n";   // 2   remainder
```

`%` is the remainder: 17 ÷ 5 = 3, with 2 left over. `17 / 5` gives you the 3. `17 % 5` gives you the 2. It only works on whole numbers.

:::tip[Where % earns its keep]
`n % 2 == 0` tests for an even number. `n % 5 == 0` fires once every five steps.
:::

## Assignment operators

Shorthand for the very common "change a variable using its own value."

```cpp
int score = 10;

score += 5;    // 15
score -= 3;    // 12
score *= 2;    // 24
score++;       // 25
score--;       // 24
```

Same thing, written twice:

| Shorthand | Longhand |
| --- | --- |
| `score += 5;` | `score = score + 5;` |
| `score++;` | `score = score + 1;` |

:::note[++ is everywhere]
Adding exactly 1 is so common in counting and loops that it gets its own operator. You will see it on almost every `for` loop you ever read.
:::

## Relational operators

Comparisons. Every one of them answers true or false.

```cpp
int a = 5, b = 8;

std::cout << (a <  b) << "\n";   // 1   true
std::cout << (a >  b) << "\n";   // 0   false
std::cout << (a == b) << "\n";   // 0
std::cout << (a != b) << "\n";   // 1
std::cout << (a <= 5) << "\n";   // 1
```

| Operator | Means |
| --- | --- |
| `>` | greater than |
| `<` | less than |
| `>=` | greater or equal |
| `<=` | less or equal |
| `==` | equal to |
| `!=` | not equal to |

:::keyidea[= vs ==]
One `=` puts a value in. Two `==` asks a question. This single character causes more beginner bugs than anything else in C++.
:::

## Logical operators

Combine several true/false answers into one.

```cpp
bool hasPower = true;
bool isArmed  = false;

std::cout << (hasPower && isArmed) << "\n";   // 0
std::cout << (hasPower || isArmed) << "\n";   // 1
std::cout << (!isArmed)            << "\n";   // 1
```

- `&&` is **AND** — true only when BOTH sides are true.
- `||` is **OR** — true when AT LEAST ONE side is true.
- `!` is **NOT** — flips true to false and back.

| A | B | A && B | A \|\| B | !A |
| --- | --- | --- | --- | --- |
| true | true | true | true | false |
| true | false | false | true | false |
| false | true | false | true | true |
| false | false | false | false | true |

:::tip
`&&` is strict, `||` is generous. If you can say the condition out loud in English, you've written it correctly.
:::

## Putting operators together

Real conditions mix comparison and logic in one line.

```cpp
int  score    = 12;
bool gameOver = false;

if (score > 10 && !gameOver) {
    std::cout << "Keep going!\n";
}
```

"If the score is above ten AND the game is not over, keep going." The code and the sentence match one to one.

**When in doubt, add brackets.** C++ has precedence rules that decide what happens first — you don't have to memorise them, since brackets make the order explicit and easier to read. For reference, from highest to lowest precedence:

1. `( )`
2. `!`
3. `*` `/` `%`
4. `+` `-`
5. `<` `>` `<=` `>=`
6. `==` `!=`
7. `&&` then `||`

## Common mistakes: operators

**1. Using `=` where you meant `==`.**

```cpp
// wrong — assigns 3 to x, then treats 3 as true -> ALWAYS runs
if (x = 3) { }

// right — asks whether x is 3
if (x == 3) { }
```

**2. Comparing floats with `==`.**

```cpp
float f = 0.1f + 0.2f;

if (f == 0.3f) { }                     // may be false!
if (std::fabs(f - 0.3f) < 0.001f) { }  // safer
```

Decimals are stored as approximations, so `0.1 + 0.2` may not land exactly on `0.3`. Ask "are these close enough" instead.

## Your turn

Predict the output before you run anything.

**Q1.** What prints?

```cpp
int a = 4, b = 4;
std::cout << (a >= b)
          << (a != b);
```

<Answer>`10` — `4 >= 4` is true, so 1. `4 != 4` is false, so 0. Printed side by side that reads 10.</Answer>

**Q2.** What prints?

```cpp
bool p = true;
bool q = false;
std::cout << (!p || q);
```

<Answer>`0` — `!p` is false and `q` is false. `||` needs at least one true side, so the whole thing is false.</Answer>

**Q3.** Spot the bug:

```cpp
int temperature = 20;

if (temperature = 100) {
  std::cout << "Hot!";
}
```

<Answer>Always prints "Hot!" — `=` assigns 100 to `temperature`, and 100 counts as true. Fix: use `==` to compare.</Answer>

:::note[Remember]
`true` prints as `1` and `false` prints as `0`. Two of them printed one after the other run together with no space in between.
:::

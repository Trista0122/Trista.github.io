---
title: AES 中的 GF(2⁸) 运算
description: 为什么 AES 的"加法"是异或、"乘法"要模一个八次多项式？从有限域的定义出发，推到 xtime、乘法逆元和 MixColumns，并用 Python 验证。
date: 2026-10-20
tags: [密码学, 数学, Python]
---

AES 的每一轮都在对字节做运算，但这些运算并不是普通的整数加减乘除，而是在**有限域** $\mathrm{GF}(2^8)$ 上进行的。理解了这个域，S 盒和 MixColumns 就不再神秘。

## 1. 字节就是多项式

一个字节 $b_7 b_6 \dots b_1 b_0$ 被看作系数在 $\mathrm{GF}(2) = \{0, 1\}$ 上的多项式：

$$
b(x) = b_7 x^7 + b_6 x^6 + \cdots + b_1 x + b_0
$$

例如 `0x57` $= 0101\,0111_2$ 对应

$$
x^6 + x^4 + x^2 + x + 1
$$

## 2. 加法 = 异或

系数在 $\mathrm{GF}(2)$ 中，$1 + 1 = 0$，所以多项式相加就是逐位异或：

$$
(x^6 + x^4 + x^2 + x + 1) + (x^7 + x + 1) = x^7 + x^6 + x^4 + x^2
$$

即 `0x57 ^ 0x83 == 0xD4`。注意减法和加法是同一个运算。

## 3. 乘法：模一个不可约多项式

两个七次以内的多项式相乘，结果可能到十四次，超出一个字节。AES 选用不可约多项式

$$
m(x) = x^8 + x^4 + x^3 + x + 1 \quad (\texttt{0x11B})
$$

并规定乘法结果要对 $m(x)$ 取模。因为 $m(x)$ 不可约，$\mathrm{GF}(2)[x] / (m(x))$ 构成一个有 $2^8 = 256$ 个元素的域——每个非零元素都有乘法逆元。

### xtime：乘以 x

乘以 $x$（也就是 `{02}`）只需左移一位；如果最高位溢出，就减去（异或）$m(x)$：

$$
\text{xtime}(b) =
\begin{cases}
b \ll 1, & b_7 = 0 \\
(b \ll 1) \oplus \texttt{0x1B}, & b_7 = 1
\end{cases}
$$

任何乘法都可以拆成若干次 xtime 再异或。以 FIPS-197 中的例子 $\{57\} \cdot \{13\}$ 为例：

| 运算 | 结果 |
| --- | --- |
| $\{57\} \cdot \{02\}$ | `0xAE` |
| $\{57\} \cdot \{04\}$ | `0x47` |
| $\{57\} \cdot \{08\}$ | `0x8E` |
| $\{57\} \cdot \{10\}$ | `0x07` |

因为 $\{13\} = \{10\} \oplus \{02\} \oplus \{01\}$，所以

$$
\{57\} \cdot \{13\} = \texttt{0x07} \oplus \texttt{0xAE} \oplus \texttt{0x57} = \texttt{0xFE}
$$

## 4. 用 Python 实现并验证

```python
def xtime(a: int) -> int:
    """乘以 x（即 {02}）：左移一位，溢出时异或 0x1B。"""
    a <<= 1
    if a & 0x100:
        a ^= 0x11B
    return a


def gmul(a: int, b: int) -> int:
    """GF(2^8) 乘法：俄罗斯农夫算法（移位 + 异或）。"""
    result = 0
    while b:
        if b & 1:
            result ^= a
        a = xtime(a)
        b >>= 1
    return result


def ginv(a: int) -> int:
    """乘法逆元：a^(2^8 - 2) = a^254；约定 0 的逆为 0。"""
    if a == 0:
        return 0
    result, base, e = 1, a, 254
    while e:
        if e & 1:
            result = gmul(result, base)
        base = gmul(base, base)
        e >>= 1
    return result


assert gmul(0x57, 0x83) == 0xC1      # FIPS-197 中的例子
assert gmul(0x57, 0x13) == 0xFE
assert all(gmul(a, ginv(a)) == 1 for a in range(1, 256))
print(hex(ginv(0x53)))               # 0xca
```

求逆用到了有限域中的"费马小定理"：非零元素构成 $255$ 阶乘法群，因此

$$
a^{255} = 1 \;\Longrightarrow\; a^{-1} = a^{254}
$$

## 5. 它在 AES 里出现在哪？

**S 盒（SubBytes）**：先在 $\mathrm{GF}(2^8)$ 中求逆，再做一个仿射变换。求逆提供了强非线性，这是抵抗线性 / 差分密码分析的关键。

**MixColumns**：把状态矩阵的每一列看作 $\mathrm{GF}(2^8)$ 上的向量，左乘一个固定矩阵：

$$
\begin{bmatrix} s'_0 \\ s'_1 \\ s'_2 \\ s'_3 \end{bmatrix}
=
\begin{bmatrix}
02 & 03 & 01 & 01 \\
01 & 02 & 03 & 01 \\
01 & 01 & 02 & 03 \\
03 & 01 & 01 & 02
\end{bmatrix}
\begin{bmatrix} s_0 \\ s_1 \\ s_2 \\ s_3 \end{bmatrix}
$$

其中乘法是 `gmul`，加法是异或。由于只用到 `{01}`、`{02}`、`{03}`，实际实现中只需要 xtime 和异或：$\{03\} \cdot b = \text{xtime}(b) \oplus b$。

## 小结

- 字节 ↔ $\mathrm{GF}(2)$ 上的多项式
- 加法 = 异或；乘法 = 多项式乘法再模 $m(x)$
- xtime 是一切乘法的积木；逆元可以用 $a^{254}$ 计算
- S 盒靠求逆提供非线性，MixColumns 靠矩阵乘法提供扩散

> **TODO：** 补充你自己的理解，比如为什么偏偏选 `0x11B` 这个多项式，或者用查表（对数 / 反对数表）加速乘法。

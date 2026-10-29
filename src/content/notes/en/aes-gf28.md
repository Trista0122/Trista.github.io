---
title: Arithmetic in GF(2⁸) for AES
description: Why is "addition" in AES just XOR, and why does multiplication reduce modulo a degree-8 polynomial? From the definition of a finite field to xtime, inverses and MixColumns — verified in Python.
date: 2026-10-20
tags: [cryptography, maths, Python]
---

Every AES round operates on bytes, but not with ordinary integer arithmetic: the operations live in the **finite field** $\mathrm{GF}(2^8)$. Once this field makes sense, the S-box and MixColumns stop being magic.

## 1. A byte is a polynomial

A byte $b_7 b_6 \dots b_1 b_0$ is read as a polynomial with coefficients in $\mathrm{GF}(2) = \{0, 1\}$:

$$
b(x) = b_7 x^7 + b_6 x^6 + \cdots + b_1 x + b_0
$$

For example `0x57` $= 0101\,0111_2$ corresponds to

$$
x^6 + x^4 + x^2 + x + 1
$$

## 2. Addition is XOR

In $\mathrm{GF}(2)$, $1 + 1 = 0$, so adding polynomials is bitwise XOR:

$$
(x^6 + x^4 + x^2 + x + 1) + (x^7 + x + 1) = x^7 + x^6 + x^4 + x^2
$$

i.e. `0x57 ^ 0x83 == 0xD4`. Subtraction is the very same operation.

## 3. Multiplication: reduce by an irreducible polynomial

Multiplying two polynomials of degree ≤ 7 can give degree 14 — too big for a byte. AES fixes the irreducible polynomial

$$
m(x) = x^8 + x^4 + x^3 + x + 1 \quad (\texttt{0x11B})
$$

and reduces every product modulo $m(x)$. Because $m(x)$ is irreducible, $\mathrm{GF}(2)[x] / (m(x))$ is a field with $2^8 = 256$ elements — every non-zero element has a multiplicative inverse.

### xtime: multiply by x

Multiplying by $x$ (i.e. `{02}`) is a left shift; if the top bit overflows, subtract (XOR) $m(x)$:

$$
\text{xtime}(b) =
\begin{cases}
b \ll 1, & b_7 = 0 \\
(b \ll 1) \oplus \texttt{0x1B}, & b_7 = 1
\end{cases}
$$

Any product can be built from repeated xtime plus XOR. Take the FIPS-197 example $\{57\} \cdot \{13\}$:

| Operation | Result |
| --- | --- |
| $\{57\} \cdot \{02\}$ | `0xAE` |
| $\{57\} \cdot \{04\}$ | `0x47` |
| $\{57\} \cdot \{08\}$ | `0x8E` |
| $\{57\} \cdot \{10\}$ | `0x07` |

Since $\{13\} = \{10\} \oplus \{02\} \oplus \{01\}$,

$$
\{57\} \cdot \{13\} = \texttt{0x07} \oplus \texttt{0xAE} \oplus \texttt{0x57} = \texttt{0xFE}
$$

## 4. Implementing and checking it in Python

```python
def xtime(a: int) -> int:
    """Multiply by x ({02}): shift left, XOR 0x1B on overflow."""
    a <<= 1
    if a & 0x100:
        a ^= 0x11B
    return a


def gmul(a: int, b: int) -> int:
    """Multiplication in GF(2^8): the Russian peasant algorithm."""
    result = 0
    while b:
        if b & 1:
            result ^= a
        a = xtime(a)
        b >>= 1
    return result


def ginv(a: int) -> int:
    """Inverse: a^(2^8 - 2) = a^254; by convention inv(0) = 0."""
    if a == 0:
        return 0
    result, base, e = 1, a, 254
    while e:
        if e & 1:
            result = gmul(result, base)
        base = gmul(base, base)
        e >>= 1
    return result


assert gmul(0x57, 0x83) == 0xC1      # example from FIPS-197
assert gmul(0x57, 0x13) == 0xFE
assert all(gmul(a, ginv(a)) == 1 for a in range(1, 256))
print(hex(ginv(0x53)))               # 0xca
```

The inverse uses the finite-field version of Fermat's little theorem: the non-zero elements form a multiplicative group of order $255$, so

$$
a^{255} = 1 \;\Longrightarrow\; a^{-1} = a^{254}
$$

## 5. Where does it show up in AES?

**S-box (SubBytes):** take the inverse in $\mathrm{GF}(2^8)$, then apply an affine transformation. Inversion provides strong non-linearity — the key defence against linear and differential cryptanalysis.

**MixColumns:** each column of the state is a vector over $\mathrm{GF}(2^8)$, multiplied by a fixed matrix:

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

where multiplication is `gmul` and addition is XOR. Since only `{01}`, `{02}` and `{03}` appear, an implementation needs nothing more than xtime and XOR: $\{03\} \cdot b = \text{xtime}(b) \oplus b$.

## Summary

- Byte ↔ polynomial over $\mathrm{GF}(2)$
- Addition = XOR; multiplication = polynomial product reduced mod $m(x)$
- xtime is the building block of every product; inverses can be computed as $a^{254}$
- The S-box gets non-linearity from inversion; MixColumns gets diffusion from matrix multiplication

> **TODO:** Add your own insight — e.g. why `0x11B` in particular, or speeding up multiplication with log / antilog tables.

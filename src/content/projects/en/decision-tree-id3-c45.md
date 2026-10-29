---
title: ID3 and C4.5 Decision Trees from Scratch, with a Visual Comparison
summary: Implementing ID3 (information gain) and C4.5 (gain ratio) in plain Python without sklearn, comparing tree structure and accuracy on the same dataset, and drawing the trees.
date: 2025-04-20
period: TODO term · coursework / self-study
role: Solo
status: Done
tags: [machine learning, Python, decision trees, visualisation]
links:
  - label: Code (TODO)
    href: https://github.com/Trista0122
order: 3
---

## Problem

Training a decision tree with a library is a one-liner, but I wanted to really understand: **how does a tree choose which attribute to split on, and why does C4.5 use the gain *ratio* instead of plain information gain?** How differently do the two grow on the same data?

## Approach

- **Entropy:** $H(D) = -\sum_k p_k \log_2 p_k$
- **ID3** picks the attribute with the largest information gain: $\text{Gain}(D, a) = H(D) - \sum_v \frac{|D^v|}{|D|} H(D^v)$
- **C4.5** corrects ID3's bias towards many-valued attributes with $\text{GainRatio}(D,a) = \dfrac{\text{Gain}(D,a)}{\text{IV}(a)}$, and handles continuous attributes via binary thresholds
- Recursive tree building, with the tree stored as nested dicts; TODO: pruning?
- Both trees drawn side by side with TODO (graphviz / matplotlib).

```python
import numpy as np

def entropy(y: np.ndarray) -> float:
    _, counts = np.unique(y, return_counts=True)
    p = counts / counts.sum()
    return float(-(p * np.log2(p)).sum())
```

## Result

- On TODO dataset (e.g. Watermelon 2.0 / a UCI dataset), ID3 and C4.5 reached TODO / TODO accuracy.
- Adding an ID-like attribute with many distinct values makes ID3 choose it as the root, while C4.5 does not — exactly the problem the gain ratio solves.

**TODO:** Add the side-by-side tree figure.

## What I learned

- After implementing it myself, "information gain favours many-valued attributes" stopped being a sentence to memorise and became something I could see.
- Recursion plus a clear data structure made the code much shorter than expected.
- Small hand-computed test cases (e.g. entropy of a toy dataset) catch edge-case bugs quickly.
- **TODO:** Add one concrete bug you hit along the way.

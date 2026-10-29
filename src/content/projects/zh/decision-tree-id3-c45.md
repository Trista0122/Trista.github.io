---
title: 从零实现 ID3 与 C4.5 决策树，并做对比可视化
summary: 不调用 sklearn，用 Python 从零实现 ID3（信息增益）与 C4.5（信息增益率），在同一数据集上对比树结构与准确率，并把树画出来。
date: 2025-04-20
period: TODO 学期 · 课程作业 / 自学
role: 独立完成
status: 已完成
tags: [机器学习, Python, 决策树, 可视化]
links:
  - label: 代码仓库（TODO）
    href: https://github.com/Trista0122
order: 3
---

## 问题

调包训练决策树只要一行代码，但我想真正弄懂：**树是怎么选择划分属性的？为什么 C4.5 要用"增益率"而不是直接用"信息增益"？** 两者在同一份数据上会长出怎样不同的树？

## 方法

- **信息熵：** $H(D) = -\sum_k p_k \log_2 p_k$
- **ID3** 选择信息增益最大的属性：$\text{Gain}(D, a) = H(D) - \sum_v \frac{|D^v|}{|D|} H(D^v)$
- **C4.5** 用增益率修正 ID3 对取值多的属性的偏好：$\text{GainRatio}(D,a) = \dfrac{\text{Gain}(D,a)}{\text{IV}(a)}$，并支持连续属性（二分点）
- 递归建树，用字典表示树结构；TODO：是否实现了剪枝？
- 用 TODO（graphviz / matplotlib）把两棵树画出来并排对比。

```python
import numpy as np

def entropy(y: np.ndarray) -> float:
    _, counts = np.unique(y, return_counts=True)
    p = counts / counts.sum()
    return float(-(p * np.log2(p)).sum())
```

## 结果

- 在 TODO 数据集（如西瓜数据集 2.0 / UCI 某数据集）上，ID3 与 C4.5 的准确率分别为 TODO / TODO。
- 当加入"编号"这类取值很多的属性时，ID3 会直接选它作为根节点，而 C4.5 不会——这正是增益率要解决的问题。

**TODO：** 放两棵树的对比图。

## 我学到了什么

- 自己实现一遍之后，"信息增益偏好取值多的属性"不再是一句需要背的话，而是能亲眼看到的现象。
- 递归 + 清晰的数据结构，让代码比想象中短。
- 写测试用例（比如手算一个小数据集的熵）能很快发现边界情况的 bug。
- **TODO：** 补充一条你实现时遇到的具体 bug。

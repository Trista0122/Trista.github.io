---
title: "Reputation vs. Location on Berlin Airbnb: A Hedonic Pricing Research Design"
summary: A hedonic pricing design asking whether strong reputation can "compensate" for a weaker location among Berlin Airbnb listings.
date: 2025-06-01
period: TODO term · course project
role: "Solo (TODO: confirm)"
status: Research design
tags: [hedonic pricing, econometrics, urban economics, Python]
order: 2
---

## Problem

In short-term rentals, price depends on the property itself (size, bedrooms), its **location** (distance to the centre or a U-Bahn station) and its **reputation** (rating, number of reviews, Superhost status). My question:

> When a listing's location is a disadvantage, can better reputation "compensate" for it in price? Are the two substitutes or complements?

**TODO:** Add why you chose Berlin and why the question matters (pricing for hosts / platform design).

## Approach

- **Data:** public Inside Airbnb listings for Berlin (TODO: snapshot date, sample size, cleaning rules).
- **Baseline model:** regress log price on property features, location and reputation:

  $$\ln P_i = \beta_0 + \mathbf{x}_i^\top\boldsymbol\beta + \gamma\,\text{Dist}_i + \delta\,\text{Rep}_i + \theta\,(\text{Dist}_i \times \text{Rep}_i) + \mu_{d} + \varepsilon_i$$

  The interaction coefficient $\theta$ tests the compensation effect; $\mu_d$ are district fixed effects.
- **Robustness:** TODO: alternative reputation measures, sub-samples, spatially clustered standard errors.
- **Caveats:** reputation and price may cause each other, and review counts depend on how long a listing has existed — the identification strategy needs discussion.

## Result

**TODO:** This is still a research design. If you have preliminary estimates, report the sign and significance of $\theta$; otherwise state your expected result and why.

## What I learned

- Hedonic pricing decomposes a good's price into implicit prices of its attributes — very close to the factor idea in asset pricing.
- Interaction terms need careful interpretation: main effects change meaning once the interaction is included.
- Often the most important part of a research design is **admitting what it can't answer**.
- **TODO:** Add the pitfalls you hit while cleaning the data.

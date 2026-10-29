---
title: Drying of Medicinal Herbs with a 1-D Radial Heat & Mass Transfer Model
summary: Problem A of the China Undergraduate Mathematical Contest in Modeling (CUMCM). A team paper modelling herb drying with a 1-D radial heat and mass transfer model; advanced to the provincial-level defence.
date: 2025-09-15
period: TODO year · 3-day contest
role: "Team member (TODO: modelling / coding / writing)"
status: Provincial defence
tags: [mathematical modelling, PDEs, numerical methods, teamwork]
order: 1
---

## Problem

When herbs are dried, heat flows in from the surrounding air while moisture migrates from the inside to the surface and evaporates. Drying too slowly is inefficient; drying too fast can destroy active ingredients or harden the surface. The task was to describe how **temperature and moisture content change over time and across the herb**, and to recommend better drying parameters.

**TODO:** Summarise the specific sub-questions in one or two sentences.

## Approach

- **Geometry:** approximate each piece as a cylinder / sphere and only model variation along the radius — a 1-D radial model.
- **Heat transfer:** radial heat conduction with a convective boundary condition at the surface.
- **Mass transfer:** moisture diffusion via Fick's law, with surface evaporation as the boundary condition and a temperature-dependent diffusivity (TODO: confirm whether an Arrhenius form was used).
- **Numerical solution:** finite differences (TODO: explicit / implicit / Crank–Nicolson), implemented in TODO (MATLAB / Python).
- **Parameter fitting & optimisation:** TODO: explain how parameters were fitted to the given data and what the objective was.

## Result

- The model reproduces the overall trend of moisture loss in the data (TODO: add an error metric such as RMSE / R²).
- We proposed TODO process recommendations (e.g. staged heating, air speed).
- The paper advanced to the **provincial-level defence**.

**TODO:** Add a figure of temperature / moisture vs. radius and time.

## What I learned

- The hard part of modelling isn't writing equations — it's **deciding what to ignore**. The 1-D radial assumption made the problem tractable, but its limits had to be discussed honestly.
- Stability conditions for numerical schemes are not just textbook material: pick the wrong step size and the solution blows up.
- In a 3-day team sprint, agreeing on a **notation table and file structure** up front saves a lot of communication.
- **TODO:** Note the questions the judges asked at the defence, and how you'd answer them now.

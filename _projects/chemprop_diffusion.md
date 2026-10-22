---
layout: page
title: Chemprop-conditioned diffusion
permalink: /projects/chemprop-diffusion/
description: Molecular toxicity prediction using Chemprop graph representations and score-based diffusion.
importance: 1
category: Research
---

## Overview

My research code investigates molecular property prediction using score-based diffusion conditioned on Chemprop graph representations. The experiments focus on predicting the 12 toxicity endpoints in Tox21.

The work builds on the DiffPred framework and compares a Chemprop classifier with a Chemprop-conditioned diffusion model.

[View the research repository](https://github.com/aralcimcim/bsc)

## Method

A Chemprop message-passing network encodes each molecule as a graph, using atom and bond features. These molecular representations condition a diffusion model that learns to denoise noisy property targets.

At inference time, repeated sampling produces predictions for the toxicity endpoints. The implementation also supports estimating uncertainty from the spread of sampled predictions.

## Experiments

- Tox21 classification using the JKU training, validation, and test splits.
- Comparison of a Chemprop baseline and its diffusion-conditioned counterpart across five random seeds.
- Hyperparameter experiments covering message passing, aggregation, network size, dropout, and optimization.
- Validation-based model selection using average precision (logged as PR-AUC), with test evaluation stored separately.
- Aggregate and per-endpoint evaluation, including ROC-AUC, average precision, F1, and Matthews correlation coefficient.

The stored diffusion configurations use 200 prediction samples and 50 refinement steps. Results are specific to the recorded splits, configurations, and prediction processing; they do not establish a general advantage over Chemprop.

## Code and experiment records

The repository includes the modified DiffPred implementation, experiment configurations, tuning documentation, and saved evaluation metrics.

- [Model and training code](https://github.com/aralcimcim/bsc/tree/main/thesis_code/diffpred_MODDED)
- [Chemprop tuning procedure](https://github.com/aralcimcim/bsc/blob/main/thesis_code/diffpred_MODDED/diffpred/TUNING_CHEMPROP.md)
- [Five-seed baseline and diffusion runs](https://github.com/aralcimcim/bsc/tree/main/diffpred_runs/retuned_unrounded_5seeds)

**Tools:** Python, PyTorch, PyTorch Lightning, Chemprop, and Hydra.

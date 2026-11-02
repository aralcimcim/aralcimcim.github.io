---
layout: page
title: Dashboard
permalink: /projects/patho_dat/
description: An interactive dashboard for tissue classification errors, confidence, and review thresholds.
importance: 3
category: Software
portfolio: true
tools: ["JavaScript", "HTML", "CSS"]
---

## Overview

An interactive model evaluation dashboard built from 7,180 held-out colorectal histology patches. It brings together a confusion matrix, recall by tissue class, confidence distributions, and a searchable table of individual misclassifications.

[Open the interactive dashboard](https://aralcimcim.github.io/patho_dash/) · [View the code on GitHub](https://github.com/aralcimcim/patho_dash)

## Model selection

Additional models will be added here. The dashboard currently displays the frozen ResNet-18 + logistic regression baseline.

## How it works

A frozen ImageNet ResNet-18 encoder extracts image representations. A StandardScaler and logistic regression are fitted on 9,000 training patches, sampled from the normalized NCT-CRC-HE-100K dataset. The complete CRC-VAL-HE-7K dataset is reserved for held-out evaluation.

The dashboard runs in the browser using the exported predictions. Independent controls explore confidence-based review coverage and tumour probability thresholds. Selecting a matrix cell, tissue class, or confidence bin filters the error table. Users can search, sort, and download those errors as CSV.

## Results

| Held-out benchmark                   | Result |
| ------------------------------------ | -----: |
| Evaluated patches                    |  7,180 |
| Overall accuracy                     | 86.38% |
| Macro F1 across nine classes         | 82.77% |
| Tumour sensitivity at threshold 0.50 | 82.40% |
| Tumour specificity at threshold 0.50 | 98.35% |

The browser checks all 54 saved metrics before showing the results. The repository contains the static dashboard, exported predictions, saved metrics, and automated dashboard checks.

Results describe image patches, not patient diagnoses. Patches within a patient are correlated, confidence scores are uncalibrated, and threshold changes are exploratory.

**Data:** Kather, Halama and Marx (2018), [100,000 histological images of human colorectal cancer and healthy tissue](https://doi.org/10.5281/zenodo.1214456), Zenodo, CC BY 4.0.

{% include tools.liquid names=page.tools %}

---
layout: page
title: German Pathology AI
permalink: /projects/pathology-ai/
description: An interactive dashboard for tissue classification errors, confidence, and review thresholds.
importance: 3
category: Software
---

## Overview

An interactive model evaluation dashboard built from 7,180 held-out colorectal histology patches. It brings together a confusion matrix, recall by tissue class, confidence distributions, and a searchable table of individual misclassifications.

[Open the interactive dashboard](https://aralcimcim.github.io/german-pathology-ai/) · [View the code on GitHub](https://github.com/aralcimcim/german-pathology-ai)

<figure class="project-preview">
  <a href="https://aralcimcim.github.io/german-pathology-ai/">
    <img src="{{ '/assets/img/projects/pathology-ai-dashboard.png' | relative_url }}" alt="Pathology evaluation dashboard showing actual results, independent review and tumour controls, a confusion matrix, and class recall" width="1440" height="1100" loading="lazy">
  </a>
  <figcaption>Model evaluation workspace. Open the dashboard to explore the results.</figcaption>
</figure>

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

The browser checks all 54 saved metrics before showing the results. The repository includes the Colab notebook, fitted classifier, run metadata, prediction CSVs, Power BI measures, and automated dashboard checks.

Results describe image patches, not patient diagnoses. Patches within a patient are correlated, confidence scores are uncalibrated, and threshold changes are exploratory.

**Data:** Kather, Halama and Marx (2018), [100,000 histological images of human colorectal cancer and healthy tissue](https://doi.org/10.5281/zenodo.1214456), Zenodo, CC BY 4.0.

**Tools:** Python, PyTorch, scikit-learn, JavaScript, and Power BI.

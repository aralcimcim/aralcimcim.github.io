---
layout: page
title: Molescope
permalink: /projects/moleculizer/
description: Molecular evidence retrieval combining chemical similarity, semantic search, and cited summaries.
img: assets/img/projects/moleculizer.png
importance: 2
category: Software
---

## Overview

Molescope explores public molecular evidence using a molecule's SMILES representation and an evidence question. It combines structure-based retrieval with semantic search, keeping the source measurements and assay context visible.

[View the code on GitHub](https://github.com/aralcimcim/moleculizer)

<figure class="project-preview">
  <a href="{{ '/assets/img/projects/moleculizer.png' | relative_url }}" target="_blank" rel="noopener">
    <img src="{{ '/assets/img/projects/moleculizer.png' | relative_url }}" alt="Molescope interface with dataset selection and molecular search controls" width="1440" height="861" loading="lazy">
  </a>
  <figcaption>Application workspace. Select the image to view it at full resolution.</figcaption>
</figure>

## Datasets

- ChEMBL human androgen-receptor binding measurements, reported as Ki in nM.
- ChEMBL human estrogen-receptor alpha binding measurements, reported as Ki in nM.
- MoleculeNet Tox21 active/inactive labels for 12 screening endpoints, preserving missing labels.
- MoleculeNet ESOL measured aqueous solubility in log10(mol/L), excluding the prediction column.

Each dataset has a separate index. Binding measurements, screening labels, and solubility values remain distinct.

## How it works

RDKit validates SMILES and generates Morgan fingerprints for Tanimoto similarity. FastEmbed provides local text embeddings, and SQLite stores the source records and vectors. Users can rank evidence by molecular structure, text relevance, or a combination of both.

An interactive landscape lets users select molecules, inspect structures and measurements, and pin up to three records for comparison. Measurement views retain dataset units, and Tox21 endpoint colors distinguish active, inactive, and missing labels. Pinned records define the optional summary scope, and comparisons can be exported as JSON.

The similarity cutoff updates the displayed matches immediately after the first search. Exact molecular identities take priority, and analogue records are clearly labeled. Optional Gemini summaries cite retrieved source identifiers and supporting quotations, which are checked against the source text.

## Implementation

- A responsive Streamlit interface with interactive charts, a source inspector, comparison trays, and molecule drawings.
- Local CPU embeddings, chemical fingerprints, and an SQLite vector store.
- Source links and original dataset row identifiers for provenance.
- Pydantic validation of generated summaries and source quotations.
- A tested Docker image with starter indexes for all four datasets.

## Testing and limitations

Twenty-two automated tests cover dataset parsing, missing labels, solubility units, retrieval, citation checks, and interface state changes. Searches were checked against real records in all four datasets, and the Docker app was verified for startup, molecule drawing, and evidence retrieval.

**Retrieval evaluation:** Across eight assistant-authored compound-name/identifier text questions on frozen snapshots from all four datasets, supporting evidence appeared in the top five for **2/8 questions with Combined ranking (25% Hit@5)** and **5/8 with Text only (62.5%)**. Eight separate exact-SMILES controls scored 8/8 in both modes, which measures identity lookup rather than semantic retrieval. [Labels, results, and reproducible evaluation](https://github.com/aralcimcim/moleculizer/tree/main/evaluation) include the misses. This is a small development set requiring independent review; it does not establish analogue-discovery or answer quality.

Molescope retrieves existing dataset evidence; it does not predict activity or implement Chemprop predictions. Structural similarity does not establish shared biological activity. Binding data and Tox21 screening labels do not establish clinical toxicity or safety. The bounded snapshots are not comprehensive literature reviews, and matching a quotation does not guarantee a correct interpretation.

**Tools:** Python, Streamlit, RDKit, FastEmbed, NumPy, SQLite, Pydantic, Gemini API, and Docker.

---
layout: page
title: Moleculizer
permalink: /projects/moleculizer/
description: Molecular evidence retrieval combining chemical similarity, semantic search, and cited summaries.
img: assets/img/projects/moleculizer.png
importance: 2
category: Industry
---

## Overview

Moleculizer explores public molecular evidence using a molecule's SMILES representation and an evidence question. It combines structure-based retrieval with semantic search, keeping the source measurements and assay context visible.

[View the code on GitHub](https://github.com/aralcimcim/moleculizer)

![Moleculizer interface with dataset selection and molecular search controls]({{ '/assets/img/projects/moleculizer.png' | relative_url }})

## Datasets

- ChEMBL human androgen-receptor binding measurements, reported as Ki in nM.
- ChEMBL human estrogen-receptor alpha binding measurements, reported as Ki in nM.
- MoleculeNet Tox21 active/inactive labels for 12 screening endpoints, preserving missing labels.
- MoleculeNet ESOL measured aqueous solubility in log10(mol/L), excluding the prediction column.

Each dataset has a separate index. Binding measurements, screening labels, and solubility values remain distinct.

## How it works

RDKit validates SMILES and generates Morgan fingerprints for Tanimoto similarity. FastEmbed provides local text embeddings, and SQLite stores the source records and vectors. Users can rank evidence by molecular structure, text relevance, or a combination of both.

The similarity cutoff updates the displayed matches immediately after the first search. Exact molecular identities take priority, and analogue records are clearly labeled. Optional Gemini summaries cite retrieved source identifiers and supporting quotations, which are checked against the source text.

## Implementation

- A responsive Streamlit interface with dataset selection, molecule drawings, and evidence cards.
- Local CPU embeddings, chemical fingerprints, and an SQLite vector store.
- Source links and original dataset row identifiers for provenance.
- Pydantic validation of generated summaries and source quotations.
- A tested Docker image with starter indexes for all four datasets.

## Testing and limitations

Eighteen automated tests cover dataset parsing, missing labels, solubility units, retrieval, citation checks, and interface state changes. Searches were checked against real records in all four datasets, and the Docker app was verified for startup, molecule drawing, and evidence retrieval.

Moleculizer retrieves existing dataset evidence; it does not predict activity or implement Chemprop predictions. Structural similarity does not establish shared biological activity. Binding data and Tox21 screening labels do not establish clinical toxicity or safety. The bounded snapshots are not comprehensive literature reviews, and matching a quotation does not guarantee a correct interpretation.

**Tools:** Python, Streamlit, RDKit, FastEmbed, NumPy, SQLite, Pydantic, Gemini API, and Docker.

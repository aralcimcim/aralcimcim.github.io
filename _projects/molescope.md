---
layout: page
title: Molescope
permalink: /projects/molescope/
importance: 2
category: Software
portfolio: true
tools: ["Python", "Streamlit", "RDKit", "FastEmbed", "NumPy", "SQLite", "Pydantic", "Gemini API", "Docker"]
---

## Overview

Molescope explores public molecular evidence using a molecule's SMILES representation and an evidence question. It combines structure-based retrieval with semantic search, keeping the source measurements and assay context visible.

[View the code on GitHub](https://github.com/aralcimcim/molescope)

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

{% include tools.liquid names=page.tools %}

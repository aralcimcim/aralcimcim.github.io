---
layout: page
title: RAGz
permalink: /projects/ragz/
description: Public neuroscience trial exploration with semantic search and cited explanations.
importance: 1
category: Industry
---

## Overview

RAGz explores public clinical trial protocols related to Alzheimer's disease, Parkinson's disease, and mild cognitive impairment. Users can filter registry records, compare up to three trials, and search for evidence about study design, interventions, primary outcomes, and participant criteria.

[View the code on GitHub](https://github.com/aralcimcim/ragz)

## How it works

The app downloads a bounded snapshot of public ClinicalTrials.gov records, splits protocol fields into passages, and embeds them locally with FastEmbed. SQLite stores the records and vectors, and cosine similarity ranks passages within the selected trials.

Optional Gemini explanations use only the retrieved passages. Each generated claim must include a source identifier and a supporting quotation. The app rejects unknown sources and quotations that do not match the retrieved text.

## Implementation

- Streamlit interface with topic, registry status, and study type filters.
- Local CPU embeddings and an SQLite vector store.
- Trial comparisons and evidence passages linked to registry records.
- Optional structured Gemini output validated with Pydantic.
- Public data only, without patient uploads or personal health questions.

## Testing and limitations

Nine automated tests cover record normalization, passage splitting, retrieval filters, vector storage, and citation validation. The interface and retrieval were also checked against a starter snapshot of 25 public trials.

RAGz is a research education prototype. It describes study protocols, not clinical recommendations. Planned outcomes are not study findings, and results tables are not indexed. The snapshot is limited and may become outdated. Matching a quotation does not guarantee that the model interprets it correctly.

**Tools:** Python, Streamlit, ClinicalTrials.gov API, FastEmbed, NumPy, SQLite, Pydantic, and Gemini API.

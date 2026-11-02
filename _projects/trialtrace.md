---
layout: page
title: TrialTrace
permalink: /projects/trialtrace/
description: An interactive research canvas connecting clinical trial questions to source evidence.
importance: 1
category: Software
portfolio: true
tools: ["Python", "Streamlit", "JavaScript", "SVG", "ClinicalTrials.gov API", "FastEmbed", "NumPy", "SQLite", "Pydantic", "Gemini API", "Docker"]
---

## Overview

TrialTrace is a visual research workspace for public clinical trial protocols across 13 neuroscience topics, including neurodegeneration, epilepsy, multiple sclerosis, stroke, brain injury, migraine, sleep disorders, ADHD, and autism. Users combine topic, question, and study-filter cards on a draggable canvas to define the evidence they want to explore.

[View the code on GitHub](https://github.com/aralcimcim/trialtrace)

## How it works

The app downloads a bounded snapshot of public ClinicalTrials.gov records, splits protocol fields into passages, and embeds them locally with FastEmbed. SQLite stores the records and vectors. Topic cards combine with OR, while study-filter categories narrow the scope. Each question card gets its own semantic search, and the results are interleaved.

Retrieved trials appear as connected source nodes. Users can open a node to inspect its passages and registry link, compare up to three trials, and export their research map as JSON. Connections describe the search scope and retrieved records; they do not assert biological relationships or causation.

Optional Gemini explanations use only the retrieved passages. Each generated claim must include a source identifier and a supporting quotation. The app rejects unknown sources and quotations that do not match the retrieved text.

## Implementation

- An interactive canvas built with a local Streamlit component, JavaScript, and SVG.
- Draggable concept cards, undo, automatic arrangement, reset, and map export.
- Keyboard controls and a mobile-friendly list view.
- Local CPU embeddings and an SQLite vector store.
- Trial comparisons and evidence passages linked to registry records.
- Optional structured Gemini output validated with Pydantic.
- Public data only, without patient uploads or personal health questions.
- A tested Docker image with bundled starter data and a CPU embedding model.

{% include tools.liquid names=page.tools %}

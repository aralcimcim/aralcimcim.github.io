---
layout: page
title: TrialTrace
permalink: /projects/ragz/
description: An interactive research canvas connecting clinical trial questions to source evidence.
img: assets/img/projects/ragz-canvas.png
importance: 1
category: Software
---

## Overview

TrialTrace is a visual research workspace for public clinical trial protocols across 13 neuroscience topics, including neurodegeneration, epilepsy, multiple sclerosis, stroke, brain injury, migraine, sleep disorders, ADHD, and autism. Users combine topic, question, and study-filter cards on a draggable canvas to define the evidence they want to explore.

[View the code on GitHub](https://github.com/aralcimcim/ragz)

<figure class="project-preview">
  <a href="{{ '/assets/img/projects/ragz-canvas.png' | relative_url }}" target="_blank" rel="noopener">
    <img src="{{ '/assets/img/projects/ragz-canvas.png' | relative_url }}" alt="TrialTrace canvas connecting topics and question cards to retrieved trial records" width="1440" height="793" loading="lazy">
  </a>
  <figcaption>Application workspace. Select the image to view it at full resolution.</figcaption>
</figure>

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

## Testing and limitations

Nineteen automated tests cover record normalization, passage splitting, retrieval filters, vector storage, map validation, combined-question retrieval, and citation validation. Browser checks verify dragging, node movement, map search, source inspection, export, undo, and mobile layout. The packaged Docker app was also checked with real public trial records.

**Retrieval evaluation:** On 12 assistant-authored, passage-labelled questions over a frozen snapshot of 119 trials and 911 passages, the supporting passage appeared in the top five for **9/12 questions (75% Hit@5)**. The three misses retrieved the correct trial's overview but not the labelled supporting passage. This evaluates the underlying retriever without topic filters, rather than the preset-question canvas. [Labels, results, and reproducible evaluation](https://github.com/aralcimcim/ragz/tree/main/evaluation) are available. The small development set needs independent review and does not measure answer quality.

TrialTrace is a research education prototype. It describes study protocols, not clinical recommendations. Planned outcomes are not study findings, and results tables are not indexed. The snapshot is limited and may become outdated. Matching a quotation does not guarantee that the model interprets it correctly.

**Tools:** Python, Streamlit, JavaScript, SVG, ClinicalTrials.gov API, FastEmbed, NumPy, SQLite, Pydantic, Gemini API, and Docker.

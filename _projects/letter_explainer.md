---
layout: page
title: Letter Explainer
permalink: /projects/letter-explainer/
description: Plain-language PDF explanations and action checklists with source evidence.
importance: 1
category: Industry
---

## Overview

Letter Explainer helps readers understand what a letter says, what they need to do, and which deadlines or conditions apply. It accepts digitally generated PDFs of one to three pages and produces explanations in English or German.

[View the code on GitHub](https://github.com/aralcimcim/letter-explainer)

## How it works

The app extracts text page by page with PyMuPDF and lets the reader review it before sending it to the Gemini API. Structured model output separates the explanation from the action checklist, including deadlines, conditions, and supporting quotations.

Each quotation is checked against its cited page, allowing for whitespace differences. Source quotations stay in the original language even when the explanation is translated.

## Implementation

- Streamlit interface with English and German explanation options.
- Pydantic validation of model responses and source quotation checks.
- Session-based checklists and document clearing.
- Pilot access code, request cooldown, and persistent usage limits.
- Explicit consent before sending extracted text to Google Gemini.

The app does not save letters or explanations to disk. It holds them in the current session's memory, while the usage database stores only timestamps, random session identifiers, and attempt types. Google's processing and retention terms apply to text sent to the API.

## Testing and limitations

The prototype was manually tested with synthetic letters covering missing deadlines, conditional actions, and no-action cases. Automated checks cover access protection, request limits, session clearing, language changes, and evidence validation, using mocked model calls.

Matching a quotation confirms that the text exists; it does not guarantee that the model interprets it correctly. Scanned PDFs, photographs, and OCR are not supported yet. This is a pilot prototype, with source code available for local setup.

**Tools:** Python, Streamlit, PyMuPDF, Pydantic, Gemini API, and SQLite.

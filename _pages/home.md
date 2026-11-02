---
layout: default
title: Home
permalink: /
description: Aral Cimcim — machine learning engineer working on graph neural networks, conditional diffusion, computational pathology, and NLP.
portfolio: true
---

<article class="portfolio-home">
  <header class="home-hero">
    <div class="hero-copy">
      <p class="eyebrow"><span class="label-dot" aria-hidden="true"></span> MACHINE LEARNING / FIELD NOTES</p>
      <h1>Machine learning for <span class="decode-word" data-decode><span>drug design</span><span class="decode-overlay" aria-hidden="true"></span></span> &amp; large-scale medical data</h1>
      <p class="hero-note">Geometric representations, generative models, and the questions inside biomedical data.</p>
      <div class="hero-categories" aria-label="Research categories"><span class="category-chip">cs.LG</span><span class="category-chip">q-bio.QM</span><span class="category-chip">cs.CV</span><span class="category-chip">cs.IR</span></div>
      <aside class="margin-note"><span class="note-index" aria-hidden="true">↳</span> Across molecules, tissue, and language:<br> learning useful representations.</aside>
    </div>
    {% include molecule-figure.liquid %}
  </header>

  <section class="research-areas-section" aria-labelledby="areas-heading">
    <div class="section-heading"><span class="section-index">01 / RESEARCH</span><h2 id="areas-heading">Research Areas:</h2><p>Three scales. Connected questions.</p></div>
    <ol class="research-areas">
      <li class="area-card" data-field="geometry">
        <span class="field-index" aria-hidden="true">01</span>
        <div class="field-copy"><p class="field-category">cs.LG · q-bio.QM</p><h3>Geometric Deep Learning &amp; Generative Models</h3><p>Geometric graph neural networks (GNNs) and SE(3)/E(3)-equivariant conditional diffusion models for molecular property prediction and structure-conditioned de novo drug design.</p></div>
        <figure class="field-figure">{% include lab-figure.liquid kind='geometry' %}<figcaption><span>FIG. 02</span> Geometry changes. The prediction stays.</figcaption></figure>
      </li>
      <li class="area-card" data-field="pathology">
        <span class="field-index" aria-hidden="true">02</span>
        <div class="field-copy"><p class="field-category">cs.CV · q-bio.QM</p><h3>Multimodal Vision-Language</h3><p>Vision-Language Models (VLMs) and multi-gigapixel whole-slide image (WSI) representation models for computational pathology.</p></div>
        <figure class="field-figure">{% include lab-figure.liquid kind='pathology' %}<figcaption><span>FIG. 03</span> From whole slides to local structure.</figcaption></figure>
      </li>
      <li class="area-card" data-field="retrieval">
        <span class="field-index" aria-hidden="true">03</span>
        <div class="field-copy"><p class="field-category">cs.IR · cs.CL</p><h3>Information Retrieval &amp; NLP</h3><p>End-to-end neural IR pipelines, fine-tuning dense retrievers and cross-encoders for domain-based embeddings, semantic search, and RAG architectures.</p></div>
        <figure class="field-figure">{% include lab-figure.liquid kind='retrieval' %}<figcaption><span>FIG. 04</span> A question finds its neighbours.</figcaption></figure>
      </li>
    </ol>
    <p class="figure-disclaimer">Figures are conceptual illustrations, not model outputs or experimental results.</p>
  </section>

  <aside class="now-note" aria-labelledby="now-heading"><span class="section-index">02 / NOTEBOOK</span><div><h2 id="now-heading">Now</h2><p>Exploring geometric representations and conditional diffusion for molecular property prediction.</p></div><span class="notebook-mark" aria-hidden="true">↗</span></aside>
</article>

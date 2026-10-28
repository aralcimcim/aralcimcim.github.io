---
layout: default
title: About
permalink: /
description: Aral Cimcim — machine learning engineer working on graph neural networks, conditional diffusion, computational pathology, and NLP.
---

<article class="portfolio-home">
  <header class="home-hero">
    <div class="hero-heading">
    <h1>Machine learning for <span class="hero-word">drug design</span> &amp; <span class="hero-word">large-scale</span> medical data</h1>
    </div>
    <div class="hero-bottom">
      <p>I work on graph neural networks and conditional diffusion for molecular property prediction, vision-language models for computational pathology, and NLP pipelines for text embeddings and dense retrieval.</p>
      <div class="hero-actions">
        <a class="action-link" href="#selected-work">View selected work <span aria-hidden="true">↓</span></a>
        <div class="hero-secondary"><a class="text-link" href="https://github.com/{{ site.data.socials.github_username }}">View GitHub <span aria-hidden="true">↗</span></a><a class="text-link cv-link" href="{{ '/profile/vita_en.pdf' | relative_url }}">View CV (PDF) <span aria-hidden="true">↗</span></a></div>
      </div>
    </div>
  </header>

  <section id="selected-work" class="home-work" aria-labelledby="work-heading">
    <div class="section-heading"><div><h2 id="work-heading">Selected work</h2></div></div>
    {% for work in site.data.selected_work %}
      {% include work-preview.liquid work=work number=forloop.index %}
    {% endfor %}
  </section>

  <section class="explore-pathways" aria-labelledby="explore-heading">
    <h2 id="explore-heading">Experiments, applications.</h2>
    <div class="pathway-grid">
      <div><h3><a href="{{ '/research/' | relative_url }}">Research <span aria-hidden="true">↗</span></a></h3><p>Molecular representations, conditional diffusion, and reasoning-guided pathology reports. Methods, experiments, and the questions behind them.</p><a class="text-link" href="{{ '/research/' | relative_url }}">Explore research <span aria-hidden="true">→</span></a></div>
      <div><h3><a href="{{ '/industry/' | relative_url }}">Software <span aria-hidden="true">↗</span></a></h3><p>Molecular evidence search and a clinical trial research canvas. Software, source inspection, and practical retrieval workflows.</p><a class="text-link" href="{{ '/industry/' | relative_url }}">Explore applications <span aria-hidden="true">→</span></a></div>
    </div>
  </section>

  <section id="about" class="home-about" aria-labelledby="about-heading">
    <div><span id="about-heading" class="eyebrow">About</span></div>
    <div>
      <p>I am a machine learning researcher and software engineer specializing in AI for drug discovery and computational biology. I develop geometric deep learning and generative diffusion models to decode molecular structures and power next-generation therapeutics.</p>
      <p>Rooted in multivariate calculus and numerical optimization, my background centers on building scalable, production-ready machine learning systems for large-scale biomedical datasets.</p>
      <p><strong>Tech stack</strong></p>
      <ul>
        <li>PyTorch</li>
        <li>Geometric Deep Learning</li>
        <li>Diffusion Models</li>
        <li>Graph Neural Networks</li>
        <li>C++ / Python</li>
        <li>Molecular Dynamics</li>
      </ul>
      <a class="text-link" href="mailto:{{ site.data.socials.email }}">Have a question or a project in mind? Get in touch <span aria-hidden="true">↗</span></a>
    </div>
  </section>
</article>

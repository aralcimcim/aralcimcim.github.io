---
layout: default
title: Home
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

</article>

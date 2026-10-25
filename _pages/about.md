---
layout: default
title: About
permalink: /
description: Aral Cimcim — machine learning engineer working on graph neural networks, conditional diffusion, computational pathology, and NLP.
---

<article class="portfolio-home">
  <header class="home-hero">
    <div class="hero-heading">
    <h1><span class="text-highlight">Machine learning</span> for <span class="text-highlight hero-word">drug design</span> &amp; <span class="hero-word">large-scale</span> medical data</h1>
    </div>
    <div class="hero-bottom">
      <p>I work on <span class="text-highlight">graph neural networks</span> and <span class="text-highlight">conditional diffusion</span> for molecular property prediction, <span class="text-highlight">vision-language models</span> for computational pathology, and <span class="text-highlight">NLP pipelines</span> for text embeddings and dense retrieval.</p>
      <div class="hero-actions">
        <a class="action-link" href="#selected-work">View selected work <span aria-hidden="true">↓</span></a>
        <div class="hero-secondary"><a class="text-link" href="https://github.com/{{ site.data.socials.github_username }}">View GitHub <span aria-hidden="true">↗</span></a><a class="text-link cv-link" href="{{ '/profile/vita_en.pdf' | relative_url }}"><span class="text-highlight">View CV (PDF) <span aria-hidden="true">↗</span></span></a></div>
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
    <span class="eyebrow">Two ways into the work</span>
    <h2 id="explore-heading">Questions, experiments, applications.</h2>
    <div class="pathway-grid">
      <div><h3><a href="{{ '/research/' | relative_url }}">Research <span aria-hidden="true">↗</span></a></h3><p>Molecular representations, conditional diffusion, and reasoning-guided pathology reports. Methods, experiments, and the questions behind them.</p><a class="text-link" href="{{ '/research/' | relative_url }}">Explore research <span aria-hidden="true">→</span></a></div>
      <div><h3><a href="{{ '/industry/' | relative_url }}">Software <span aria-hidden="true">↗</span></a></h3><p>Molecular evidence search and a clinical trial research canvas. Software, source inspection, and practical retrieval workflows.</p><a class="text-link" href="{{ '/industry/' | relative_url }}">Explore applications <span aria-hidden="true">→</span></a></div>
    </div>
  </section>

  <section id="about" class="home-about" aria-labelledby="about-heading">
    <div><span class="eyebrow">About</span><h2 id="about-heading">at the intersection of <span class="text-highlight">foundation models</span> and <span class="text-highlight">medical data</span></h2></div>
    <div><p>My work combines applied machine learning, mathematics, and software engineering. I study how graph representations and generative models can support scientific prediction.</p><p>My background includes multivariate calculus, numerical optimization, software development with a specialization on machine learning in Life Sciences; in particular, <span class="text-highlight">geometric deep learning and diffusion models</span> trained on large-scale molecular datasets.</p><a class="text-link" href="mailto:{{ site.data.socials.email }}">Have a question or a project in mind? Get in touch <span aria-hidden="true">↗</span></a></div>
  </section>
</article>

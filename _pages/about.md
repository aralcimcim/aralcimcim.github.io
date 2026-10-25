---
layout: default
title: About
permalink: /
description: Aral Cimcim — machine learning engineer working on graph neural networks, conditional diffusion, computational pathology, and NLP.
---

<article class="portfolio-home">
  <header class="home-hero">
    <div class="hero-heading">
    <div class="hero-identity"><span class="text-highlight">Aral Cimcim</span></div>
    <div class="profile-portrait"><div class="portrait-crop"><img src="{{ '/profile/foto.png' | relative_url }}" alt="Portrait of Aral Cimcim" width="306" height="309" loading="eager" decoding="async"></div></div>
    <h1><span class="text-highlight">Machine learning</span><span class="mobile-line-break"></span> <span class="text-highlight">for&nbsp;</span><br class="desktop-line-break"><span class="text-highlight">molecules</span> <em><span class="text-highlight">&amp; evidence.</span></em></h1>
    </div>
    <div class="hero-bottom">
      <p><span class="text-highlight">I work on graph neural networks and conditional diffusion for molecular property prediction, vision-language models for computational pathology, and NLP pipelines for text embeddings and dense retrieval.</span></p>
      <div class="hero-actions">
        <a class="action-link" href="#selected-work"><span class="text-highlight">View selected work</span> <span aria-hidden="true" class="text-highlight">↓</span></a>
        <div class="hero-secondary"><a class="text-link" href="https://github.com/{{ site.data.socials.github_username }}"><span class="text-highlight">View GitHub</span> <span aria-hidden="true" class="text-highlight">↗</span></a><a class="text-link" href="{{ '/profile/vita_en.pdf' | relative_url }}"><span class="text-highlight">View CV (PDF)</span> <span aria-hidden="true" class="text-highlight">↗</span></a></div>
      </div>
    </div>
  </header>

  <section id="selected-work" class="home-work" aria-labelledby="work-heading">
    <div class="section-heading"><div><span class="text-highlight eyebrow">A closer look</span><h2 id="work-heading"><span class="text-highlight">Selected work</span></h2></div></div>
    {% for work in site.data.selected_work %}
      {% include work-preview.liquid work=work number=forloop.index %}
    {% endfor %}
  </section>

  <section class="explore-pathways" aria-labelledby="explore-heading">
    <span class="text-highlight eyebrow">Two ways into the work</span>
    <h2 id="explore-heading"><span class="text-highlight">Questions, experiments, applications.</span></h2>
    <div class="pathway-grid">
      <div><h3><a href="{{ '/research/' | relative_url }}"><span class="text-highlight">Research</span> <span aria-hidden="true" class="text-highlight">↗</span></a></h3><p><span class="text-highlight">Molecular representations, conditional diffusion, and reasoning-guided pathology reports. Methods, experiments, and the questions behind them.</span></p><a class="text-link" href="{{ '/research/' | relative_url }}"><span class="text-highlight">Explore research</span> <span aria-hidden="true" class="text-highlight">→</span></a></div>
      <div><h3><a href="{{ '/industry/' | relative_url }}"><span class="text-highlight">Industry</span> <span aria-hidden="true" class="text-highlight">↗</span></a></h3><p><span class="text-highlight">Molecular evidence search and a clinical trial research canvas. Software, source inspection, and practical retrieval workflows.</span></p><a class="text-link" href="{{ '/industry/' | relative_url }}"><span class="text-highlight">Explore applications</span> <span aria-hidden="true" class="text-highlight">→</span></a></div>
    </div>
  </section>

  <section id="about" class="home-about" aria-labelledby="about-heading">
    <div><span class="text-highlight eyebrow">About</span><h2 id="about-heading"><span class="text-highlight">at the intersection of foundation models and medical data</span></h2></div>
    <div><p><span class="text-highlight">My work combines applied machine learning, mathematics, and software engineering. I study how graph representations and generative models can support scientific prediction.</span></p><p><span class="text-highlight">My background includes multivariate calculus, numerical optimization, software development with a specialization on machine learning in Life Sciences; in particular, geometric deep learning and diffusion models trained on large-scale molecular datasets.</span></p><a class="text-link" href="mailto:{{ site.data.socials.email }}"><span class="text-highlight">Have a question or a project in mind? Get in touch</span> <span aria-hidden="true" class="text-highlight">↗</span></a></div>
  </section>
</article>

{% if site.visit_notification_url and site.visit_notification_url != "" %}
<script defer src="{{ '/assets/js/visit-notifier.js' | relative_url }}" data-endpoint="{{ site.visit_notification_url | escape }}"></script>
{% endif %}

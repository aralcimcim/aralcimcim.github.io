---
layout: page
title: Industry
permalink: /industry/
description: Applied machine learning and evidence retrieval. Software for searching, inspecting, and comparing source records.
nav: true
nav_order: 2
---

<div class="industry-intro"><span class="eyebrow">From models to workflows</span><p>Applications that keep source evidence close to the questions being asked.</p></div>

{% assign applications = site.data.selected_work | where: 'category', 'Industry' %}
{% for work in applications %}
{% include work-preview.liquid work=work number=forloop.index heading='h2' %}
{% endfor %}

<section class="side-project" aria-labelledby="toitoitoi-heading">
  <span class="eyebrow">A smaller experiment</span>
  <div class="side-project-content">
    <div>
      <h2 id="toitoitoi-heading">toitoitoi</h2>
      <p>A Telegram bot that sends me “toitoitoi 🎉” when someone visits my homepage. It runs on Cloudflare Workers.</p>
      <a class="text-link" href="https://github.com/aralcimcim/aralcimcim.github.io/tree/main/_services/visit-notifier">View code on GitHub <span aria-hidden="true">↗</span></a>
    </div>
    <a href="{{ '/toitoi_img/toi.png' | relative_url }}"><img src="{{ '/toitoi_img/toi.png' | relative_url }}" alt="Toitoitoi bot sending homepage visit notifications in Telegram" width="322" height="322" loading="lazy"></a>
  </div>
</section>

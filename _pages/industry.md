---
layout: page
title: Software
permalink: /industry/
description: Applied machine learning and evidence retrieval. Software for searching, inspecting, and comparing source records.
nav: true
nav_order: 2
---

<div class="software-intro"><span class="eyebrow">From models to workflows</span><p>Applications that keep source evidence close to the questions being asked.</p></div>

{% assign applications = site.data.selected_work | where: 'category', 'Software' %}
{% for work in applications %}
{% include work-preview.liquid work=work number=forloop.index heading='h2' %}
{% endfor %}

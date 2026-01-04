---
layout: default
title: Projects
permalink: /projects/
---

<main class="blog">
  <header class="blog-header">
    <h1>Projects</h1>
    <p class="projects-intro">
      A collection of things I’m building and exploring — ideas in progress, experiments, and practical solutions.
    </p>
  </header>

  <div class="cards">
    {% for project in site.projects %}
      <article class="card hover-raise">
        <a href="{{ project.url | relative_url }}">
          <h3>{{ project.title }}</h3>

          <p class="post-meta">
            {% if project.started %}
              <time datetime="{{ project.started | date: '%Y' }}">
                Started: {{ project.started | date: "%Y" }}
              </time>
            {% endif %}
            {% if project.started and project.status %}
            ·
            {% endif %}
            {% if project.status %}
              <span class="post-tags">
                  <span class="tag status-{{ project.status | downcase }}">{{ project.status }}</span>
              </span>
            {% endif %}
          </p>
          
          <p class="post-excerpt">
            {{ project.excerpt | strip_html | truncate: 140 }}
          </p>
        </a>
      </article>
    {% endfor %}
  </div>
</main>



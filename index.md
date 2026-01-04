---
layout: default
title: NetworkingDream
is_homepage: true
---

{% include hero.html %}

<main>

  {% include about.html %}

  <!-- Blog Section -->
  <section id="blog">
    <h2>Blog</h2>

    <div class="cards">
      {% for post in site.posts limit:6 %}
        <a class="card hover-raise" href="{{ post.url | relative_url }}">
          <h3>
            {{ post.title }}

            {% assign post_time = post.date | date: "%s" %}
            {% assign now_time  = site.time | date: "%s" %}
            {% assign days = now_time | minus: post_time | divided_by: 86400 %}

            {% if days < 14 %}
              <span class="recent status-updated">NEW</span>
            {% endif %}
          </h3>

          <p>
            {{ post.excerpt | strip_html | truncate: 120 }}
          </p>
        </a>
      {% endfor %}
    </div>
  </section>

  <!-- Project Section -->
  <section id="projects">
    <h2>Projects</h2>

    <div class="cards">

      {%- comment -%} Featured projects {%- endcomment -%}
      {% for project in site.projects %}
        {% if project.featured %}
          <a class="card hover-raise" href="{{ project.url | relative_url }}">
            <h3>
              {{ project.title }}

              {% if project.updated %}
                {% assign updated_time = project.updated | date: "%s" %}
                {% assign now_time = site.time | date: "%s" %}
                {% assign days = now_time | minus: updated_time | divided_by: 86400 %}

                {% if days < 30 %}
                  <span class="recent status-updated">UPDATED</span>
                {% endif %}
              {% endif %}
            </h3>
            
            <p>{{ project.description }}</p>
          </a>
        {% endif %}
      {% endfor %}

      {%- comment -%} Normal projects {%- endcomment -%}
      {% for project in site.projects %}
        {% unless project.featured %}
          <a class="card hover-raise" href="{{ project.url | relative_url }}">
            <h3>
              {{ project.title }}
              {% if project.status %}
                {% include project-status.html status=project.status %}
              {% endif %}
            </h3>
            <p>{{ project.description }}</p>
          </a>
        {% endunless %}
      {% endfor %}

    </div>
  </section>

</main>
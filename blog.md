---
layout: default
title: Blog
permalink: /blog/
---

<main class="blog">
  <header class="blog-header">
    <h1>Blog</h1>
    <p class="blog-intro">
      Notes, experiments, and write-ups on things I’m building, breaking, and learning along the way.
    </p>
  </header>

  <div class="cards">
    {% for post in site.posts %}
      <article class="card hover-raise">
        <a href="{{ post.url | relative_url }}">
          <h3>{{ post.title }}</h3>

          <p class="post-meta">
            <time datetime="{{ post.date | date_to_xmlschema }}">
              {{ post.date | date: "%B %d, %Y" }}
            </time>
            {% if post.date and post.tags.size > 0 %}
            ·
            {% endif %}
            {% if post.tags %}
              <span class="post-tags">
                {% for tag in post.tags %}
                  <span class="tag">{{ tag }}</span>
                {% endfor %}
              </span>
            {% endif %}
          </p>
          
          <p class="post-excerpt">
            {{ post.excerpt | strip_html | truncate: 140 }}
          </p>
        </a>
      </article>
    {% endfor %}
  </div>
</main>

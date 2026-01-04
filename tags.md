---
layout: default
title: Tags
permalink: /tags/
---

<main class="tags-page">
  <header>
    <h1>Tags</h1>
    <p>Browse content by topic across posts and projects.</p>

    <input
      type="search"
      id="tag-filter"
      placeholder="Filter tags…"
      aria-label="Filter tags"
      class="tag-filter"
    >
  </header>

  {% assign sorted_tags = site.tags | sort: "title" %}

  <ul class="tag-list" id="tag-list">
    {% for tag_page in sorted_tags %}

      {% assign post_count = site.posts
        | where_exp: "p", "p.tags contains tag_page.tag"
        | size
      %}

      {% assign project_count = site.projects
        | where_exp: "p", "p.tags contains tag_page.tag"
        | size
      %}

      {% assign total_count = post_count | plus: project_count %}

      {% if total_count > 0 %}
        <li
          class="tag-item"
          data-tag="{{ tag_page.tag }}"
          data-title="{{ tag_page.title | default: tag_page.tag | downcase }}"
          data-description="{{ tag_page.description | default: '' | downcase }}"
        >
          <h2 class="tag-title">
            <a href="{{ tag_page.url | relative_url }}">
              {{ tag_page.title | default: tag_page.tag }}
            </a>
            <span class="tag-count">({{ total_count }})</span>
          </h2>

          {% if tag_page.description %}
            <p class="tag-description">
              {{ tag_page.description }}
            </p>
          {% endif %}

          <p class="tag-meta">
            {{ post_count }} post{% if post_count != 1 %}s{% endif %}
            ·
            {{ project_count }} project{% if project_count != 1 %}s{% endif %}
          </p>
        </li>
      {% endif %}

    {% endfor %}
  </ul>

  <p id="no-results" hidden>No tags match your search.</p>
</main>

<script>
  (function () {
    const input = document.getElementById('tag-filter');
    const items = document.querySelectorAll('.tag-item');
    const noResults = document.getElementById('no-results');

    input.addEventListener('input', function () {
      const query = this.value.toLowerCase().trim();
      let visibleCount = 0;

      items.forEach(item => {
        const title = item.dataset.title;
        const description = item.dataset.description;
        const tag = item.dataset.tag;

        const matches =
          title.includes(query) ||
          description.includes(query) ||
          tag.includes(query);

        item.hidden = !matches;
        if (matches) visibleCount++;
      });

      noResults.hidden = visibleCount > 0;
    });
  })();
</script>

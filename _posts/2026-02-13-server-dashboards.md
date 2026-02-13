---
layout: post
title: "Self-Hosted Dashboards"
description: "Self-hosted dashboards, focusing on resource usage, features, and deployment options for homelabs."
date: 2026-02-13
featured: false
tags:
  - homelab
  - self-hosted
  - dashboards
  - docker
  - containers
  - networking
excerpt: >
  Reviewing self-hosted dashboards, comparing resource efficiency, configuration methods, and deployment via Docker to help you choose the right option for your homelab.
---

## What is a Dashboard and Why You Need One When Self-Hosting

Self-hosting services gives you greater control, privacy, and flexibility, but as the number of services grows, so does the complexity of managing them. Dashboards help bring order to that sprawl by acting as a central landing page for everything you host.

A good dashboard provides:

- A single web interface for accessing self-hosted services
- At-a-glance visibility of what’s running
- Organised and consistent access to service web UIs

Rather than replacing service-specific management interfaces, dashboards complement them.

---

## Deployable Options

There is no shortage of self-hosted dashboards available, each designed with different priorities in mind such as aesthetics, performance, or extensibility.

I've chosen to review the following dashboards:

1. Homepage
2. Homer
3. Flame
4. Honey

---

## Resource  Efficiency

In my opinion, efficiency matters. Dashboards are typically always-on services, so keeping memory, compute and storage usage low helps preserve resources for more important workloads.

Below is a rough comparison of resource usage when these dashboards are deployed via Docker with default configurations.

| Dashboard | Image Size | RAM Usage |
| --------- | ---------- | --- | 
| Homepage | 272 MB | ~200 MB |
| Homer | 15 MB | ~10 MB |
| Flame | 188 MB | ~170 MB |
| Honey | 209 MB | ~150 MB |
| Homarr | 458 MB | ~900 MB |
| Dashy | 522 MB | ~300 MB |

These figures are from a fresh Docker deployment, they highlight the significant differences each solution.

---

## Dashboards

### Homepage

Homepage is a modern and flexible dashboard with built-in widgets and optional Docker integration. It’s well-suited to users who want visibility into service metrics alongside quick access links.

- **GitHub**: [Homepage](https://gethomepage.dev/)
- **Management**: YAML configuration files
- **Authentication**: No
- **User Management**: No

Docker Compose example:

```yaml
services:
  homepage:
    image: ghcr.io/gethomepage/homepage:latest
    container_name: homepage
    ports:
      - 3000:3000
    volumes:
      - config:/app/config
      # (optional) For docker integrations
      - /var/run/docker.sock:/var/run/docker.sock:ro 
    environment:
      # See gethomepage.dev/installation/#homepage_allowed_hosts
      - HOMEPAGE_ALLOWED_HOSTS=gethomepage.dev
      - PUID=1000
      - PGID=1000

volumes:
    config:
```

---

### Homer

Homer is an extremely lightweight static dashboard. It focuses entirely on fast load times and simplicity, making it ideal for resource-constrained environments.

- **GitHub**: [Homer](https://github.com/bastienwirtz/homer)
- **Management**: YAML configuration file
- **Authentication**: No
- **User Management**: No

Docker Compose example:

```yaml
services:
  homer:
    image: b4bz/homer
    container_name: homer
    volumes:
      - config:/www/assets
    ports:
      - 8080:8080
    user: 1000:1000
    environment:
      - INIT_ASSETS=1 # default, requires the config directory to be writable for the container user (see user option)
    restart: unless-stopped

volumes:
    config:
```

---

### Flame

Flame provides a minimalist interface with the convenience of web-based configuration. It includes basic authentication, which can be useful in shared environments.

- **GitHub**: [Flame](https://github.com/pawelmalak/flame)
- **Management**: Web interface
- **Authentication**: Yes, through app password
- **User Management**: No

Docker Compose example:

```yaml
services:
  flame:
    image: pawelmalak/flame
    container_name: flame
    volumes:
      - config:/app/data
      # optional but required for Docker integration
      - /var/run/docker.sock:/var/run/docker.sock 
    ports:
      - 5005:5005
    environment:
      - PASSWORD=settings-password
    restart: unless-stopped

volumes:
    config:
```

---

### Honey

Honey is a static dashboard written in HTML, CSS, and JavaScript. Its simplicity keeps dependencies to a minimum and makes it easy to deploy almost anywhere.

- **GitHub**: [Honey](https://github.com/dani3l0/honey)
- **Management**: JSON configuration file
- **User Authentication**: No
- **User Management**: No

Docker Compose example:

```yaml
services:
  honey:
    image: ghcr.io/dani3l0/honey:latest
    container_name: honey
    restart: unless-stopped
    volumes:
      - config:/app/dist/config
    ports:
      - "4173:4173"

volumes:
    config:
```

---

## Which Dashboard Did I Choose?

For my setup, a dashboard needs to meet a few clear requirements:

1. Be resource-efficient
2. Load quickly when used as a new tab page
3. Be easy to style and customise
4. Be simple to maintain over time

Homer fits these requirements well. It has an extremely small resource footprint, and because it’s a static site, it loads instantly without any backend processing or database dependencies. Configuration is handled through YAML, which I’m already comfortable working with and is easy to version, back up, and modify in bulk.

While Homer may appear limited at first glance, it’s surprisingly flexible once configured. That balance of simplicity, speed, and maintainability makes it a good fit for my homelab, and it’s the dashboard I’ve chosen to deploy going forward.
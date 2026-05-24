---
layout: post
title: "Self-Hosted Ticket System"
description: "Exploring self-hosted IT ticketing systems for homelabs and small organisations"
date: 2026-05-06
featured: false
tags:
  - self-hosted
  - homelab
  - management
excerpt: >
  A practical look at self-hosted IT ticketing systems, key requirements, and a hands-on setup with Zammad.
---

## Introduction

### What

A ticketing system (or helpdesk system) is a centralised platform used to manage support requests, incidents, service requests, and internal IT tasks.

Instead of handling issues through scattered emails, messages, or verbal requests, everything is tracked as a **ticket** with a clear lifecycle, ownership, and history.

### Why

For anyone running a homelab, small business, or internal IT environment, a ticketing system quickly becomes essential:

- Prevents requests from being lost or forgotten  
- Provides accountability and ownership  
- Enables prioritisation and SLA tracking  
- Creates an audit trail of work completed  
- Improves communication between users and support staff  

Self-hosting adds additional benefits:

- Full control over data  
- No recurring SaaS costs  
- Integration with internal systems (e.g. AD)  

---

## Requirements

When evaluating a self-hosted ticketing system, these were my baseline requirements:

- Clean and intuitive UI  
- SLA (Service Level Agreement) support  
- Preventative Maintenance (PM) tasks  
- SSO integrations  
- Customer/user sync (e.g. Microsoft AD / LDAP / Exchange)  
- Role-based access control (RBAC)  
- Branding/customisation  
- Ticket assignment and ownership  
- Reporting and analytics  
- Customisable notifications  
- Customisable ticket views  
- Ticket linking/merging  
- Multiple ticket creation methods (email ingestion, API, forms)  

### Nice to Have

- Multi-tenant or multi-department support  
- Health check endpoint (for monitoring)  
- Knowledge base  
- Canned responses  
- Checklists / task templates  
- Tagging system  

---

## Solutions Considered

A few popular self-hosted options worth exploring:

- **GLPI** – Feature-rich, includes asset management  
- **FreeScout** – Lightweight and email-focused  
- **Zammad (Community Edition)** – Modern UI and strong integrations  

In this article, I’ll focus on **Zammad**, as it strikes a good balance between usability and features.

---

## Zammad (Community Edition)

Zammad has been around since 2016 and has matured into a very capable open-source helpdesk platform.

While there is a commercial offering, the **community edition is fully self-hostable and free to use**, which makes it ideal for homelabs and small environments.

---

## Docker Compose Installation

Zammad provides an official Docker setup, which is the easiest way to get started.

### Host Requirements

Zammad relies on Elasticsearch, which requires a kernel parameter adjustment:

```bash
sudo sysctl -w vm.max_map_count=262144
```

You should also ensure:

- **Minimum 4 GB RAM** (realistically 6–8 GB recommended)  
- Docker and Docker Compose installed  
- A system capable of running ~10 containers  

---

### Docker Compose File

Below is a working example configuration:

```yaml
x-shared:
  zammad-service: &zammad-service
    environment: &zammad-environment
      MEMCACHE_SERVERS: ${MEMCACHE_SERVERS:-zammad-memcached:11211}
      POSTGRESQL_DB: ${POSTGRES_DB:-zammad_production}
      POSTGRESQL_HOST: ${POSTGRES_HOST:-zammad-postgresql}
      POSTGRESQL_USER: ${POSTGRES_USER:-zammad}
      POSTGRESQL_PASS: ${POSTGRES_PASS:-zammad}
      POSTGRESQL_PORT: ${POSTGRES_PORT:-5432}
      POSTGRESQL_OPTIONS: ${POSTGRESQL_OPTIONS:-?pool=50}
      POSTGRESQL_DB_CREATE:

      REDIS_URL: ${REDIS_URL:-redis://zammad-redis:6379}

      BACKUP_DIR: "${BACKUP_DIR:-/var/tmp/zammad}"
      BACKUP_TIME: "${BACKUP_TIME:-03:00}"
      HOLD_DAYS: "${HOLD_DAYS:-10}"
      TZ: "${TZ:-Europe/London}"

      AUTOWIZARD_JSON:
      ELASTICSEARCH_ENABLED:
      ELASTICSEARCH_HOST:
      ELASTICSEARCH_PORT:

    image: ${IMAGE_REPO:-ghcr.io/zammad/zammad}:${VERSION:-7.0.1-0024}
    restart: ${RESTART:-always}
    volumes:
      - zammad-backup:/var/tmp/zammad:ro
      - zammad-storage:/opt/zammad/storage
    depends_on:
      - zammad-memcached
      - zammad-postgresql
      - zammad-redis

services:
  zammad-backup:
    <<: *zammad-service
    command: ["zammad-backup"]
    volumes:
      - zammad-backup:/var/tmp/zammad
      - zammad-storage:/opt/zammad/storage
    user: 0:0

  zammad-elasticsearch:
    image: elasticsearch:${ELASTICSEARCH_VERSION:-9.3.3}
    restart: ${RESTART:-always}
    volumes:
      - elasticsearch-data:/usr/share/elasticsearch/data
    environment:
      discovery.type: single-node
      xpack.security.enabled: 'false'
      ES_JAVA_OPTS: ${ELASTICSEARCH_JAVA_OPTS:--Xms1g -Xmx1g}

  zammad-init:
    <<: *zammad-service
    command: ["zammad-init"]
    depends_on:
      - zammad-postgresql
    restart: on-failure
    user: 0:0

  zammad-memcached:
    command: memcached -m 256M
    image: memcached:${MEMCACHE_VERSION:-1.6.41-alpine}
    restart: ${RESTART:-always}

  zammad-nginx:
    <<: *zammad-service
    command: ["zammad-nginx"]
    ports:
      - "${NGINX_EXPOSE_PORT:-8080}:8080"
    depends_on:
      - zammad-railsserver

  zammad-postgresql:
    environment:
      POSTGRES_DB: ${POSTGRES_DB:-zammad_production}
      POSTGRES_USER: ${POSTGRES_USER:-zammad}
      POSTGRES_PASSWORD: ${POSTGRES_PASS:-zammad}
    image: postgres:${POSTGRES_VERSION:-17.9-alpine}
    restart: ${RESTART:-always}
    volumes:
      - postgresql-data:/var/lib/postgresql/data

  zammad-railsserver:
    <<: *zammad-service
    command: ["zammad-railsserver"]

  zammad-redis:
    image: redis:${REDIS_VERSION:-8.6.2-alpine}
    restart: ${RESTART:-always}
    volumes:
      - redis-data:/data

  zammad-scheduler:
    <<: *zammad-service
    command: ["zammad-scheduler"]

  zammad-websocket:
    <<: *zammad-service
    command: ["zammad-websocket"]

volumes:
  elasticsearch-data:
  postgresql-data:
  redis-data:
  zammad-backup:
  zammad-storage:
```

---

## Initial Setup

Once the stack is running:

1. Navigate to the web interface (e.g. `http://localhost:8080`)  
2. Complete the setup wizard  
3. Create your admin account  
4. Configure:
   - Email for ticket ingestion and notifcations
   - Organisation details  
   - Roles and permissions  

---

## My Thoughts on Zammad

Zammad stands out due to its **modern design and usability**, the community version is completely free, but there are also paid for support versions and additional features such as AI integration.

### What It Does Well

- Clean and intuitive UI  
- Chat-style ticket conversations  
- Internal notes by default (reduces mistakes)  
- Ticket splitting at conversation level  
- Customisable ticket states via `Settings > System > Objects > Ticket > State`
- Built-in AI integrations (optional)  
- Built-in holiday calendar support
- Template checklists  
- Text highlighting inside tickets  
- Multiple communication channels:
  - Email  
  - Embed Web forms  
  - Chat widget  
  - SMS  
  - External integrations
    - Google
    - Microsoft
    - Facebook
    - Telegram
    - WhatsApp

---

## Conclusion

If you're looking for a **self-hosted ticketing system with a modern UI and strong feature set** without SaaS lock-in, Zammad is a solid choice for:

- Homelabs with multiple users  
- Small businesses  
- Internal IT teams  

---
layout: post
title: "Self-Hosted Wiki: BookStack vs Wiki.js"
description: "A practical comparison of BookStack and Wiki.js for self-hosted ICT documentation."
date: 2026-05-03
featured: false
tags:
  - self-hosted
  - wiki
  - documentation
  - homelab
excerpt: >
  A hands-on comparison of BookStack and Wiki.js for IT documentation.
  Explore features, usability, system requirements, and which platform best fits.
---

## Why Documentation Matters

For system administrators, documentation is not optional, it is essential. While few people enjoy sitting down to write documentation, the right tools can significantly reduce the friction involved.

A well-designed wiki platform makes it easier to capture, organise, and maintain knowledge.

Documentation means different things to different teams, and that is perfectly fine. Personally, I favour comprehensive documentation, even if it feels slightly excessive. When deploying a new system, capturing all configuration details ensures that knowledge is shared, accessible, and reusable.

High-quality, well-maintained documentation becomes a **single source of truth**. It reduces reliance on individual memory and allows administrators to focus on solving problems rather than recalling past configurations.

---

## Wiki System Requirements

When selecting a documentation platform, the following requirements are important to me:

### Core Requirements
- **Self-hosted**: Maintain full control over data and reduce ongoing costs  
- **Secure web interface**: Accessible while protecting sensitive information  
- **Granular permissions**: Control access (e.g. read-only vs edit rights)  
- **Lightweight**: Efficient use of server resources  
- **Clean, intuitive UI**: Encourages adoption and usability  
- **Version history**: Track changes and roll back when needed  
- **Backup and restore**: Protect against data loss  
- **Structured organisation**: Logical hierarchy for content  

### Content Capabilities
- Text formatting and headings  
- Code snippets  
- Image embedding  
- File attachments  
- Hyperlinks  
- Callouts (Info, Note, Warning, Danger)  
- Embedded video  

### Nice-to-Have Features
- Markdown support  
- Diagram integration  
- Reusable content templates  
- Task lists (checkbox support)  

---

## BookStack Overview

BookStack is a simple, self-hosted wiki designed with usability in mind. Its structure is intentionally straightforward:

- **Pages** belong to Chapters  
- **Chapters** belong to Books  
- **Books** can be grouped into Shelves  

This hierarchy makes organisation easy, although users accustomed to expandable tree navigation may find overall visibility somewhat limited.

Despite this, BookStack meets all core requirements and the Nice-to-Have features outlined above.

### Key Features
- Clean and user-friendly interface  
- Built-in version control  
- Role-based access control (users, groups, permissions)  
- Audit logging  
- Branding customisation  
- Email notifications and webhooks  
- Multi-factor authentication (MFA)  
- External authentication support (SAML2, OIDC, LDAP)  
- Proxy support  

### Content Features
- WYSIWYG editor  
- Markdown editor  
- Image and file embedding  
- Page templates  
- Diagram support via integration with https://app.diagrams.net/  

---

## System Requirements (BookStack)

- Linux or Docker  
- 2 CPU cores (recommended)  
- Minimum 1 GB RAM  
- MySQL or MariaDB database  
- PHP and Composer  
- Apache or Nginx web server  
- Git  

---

## Docker Compose Installation (BookStack)

```yaml
services:

  bookstack:
    image: lscr.io/linuxserver/bookstack:version-v26.03.3
    container_name: bookstack
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Etc/UTC
      - APP_URL=http://localhost:6875
      # docker run -it --rm --entrypoint /bin/bash lscr.io/linuxserver/bookstack:latest appkey
      - APP_KEY=base64:REPLACE_WITH_YOUR_OWN_KEY
      - DB_HOST=mariadb
      - DB_PORT=3306
      - DB_DATABASE=bookstack
      - DB_USERNAME=bookstack
      - DB_PASSWORD=REPLACE_WITH_SECURE_PASSWORD
    volumes:
      - app-data:/config
    ports:
      - 6875:80
    restart: unless-stopped

  mariadb:
    image: lscr.io/linuxserver/mariadb:latest
    container_name: bookstack_mariadb
    environment:
      - MYSQL_ROOT_PASSWORD=REPLACE_WITH_SECURE_PASSWORD
      - MYSQL_DATABASE=bookstack
      - MYSQL_USER=bookstack
      - MYSQL_PASSWORD=REPLACE_WITH_SECURE_PASSWORD
    volumes:
      - db-data:/config
    restart: unless-stopped

volumes:
  app-data:
  db-data:
```

### Default Credentials (BookStack)

- Username: `admin@admin.com`  
- Password: `password`  

> Change these credentials immediately after first login.

---

## Wiki.js Overview

Homepage: https://js.wiki/

Wiki.js is a powerful and highly customisable wiki platform. Compared to BookStack, it is slightly more complex offering a modern user experience and a wide range of integrations.

Unlike traditional wiki systems, Wiki.js does not rely on a strict folder-based hierarchy. Instead, it uses **path-based organisation**, where content structure is inferred from URL paths.

### Navigation Options

Wiki.js provides several navigation modes:

1. **Site Tree** - Classic tree-based navigation  
2. **Static** - Navigation menu only  
3. **Custom** - Static menu with optional site tree access  
4. **None** - No built-in navigation  

While flexible, these options can feel less intuitive compared to the BookStack approach.

### Features

- Diagram support via integration with https://app.diagrams.net/  
- Advanced Markdown editor with built-in tools (callouts, diagrams, etc.)  
- Multiple editor types (not all features are shared across editors)  
- Custom CSS per page  
- Configurable storage backends for backup and synchronisation  

### Editors

- Markdown  
- Visual Editor (WYSIWYG)  
- AsciiDoc  
- HTML (Code editor)  
- Template editor  

### Platform Features

- Version control  
- User registration  
- Branding  
- User management, groups, and roles  
- Email support  
- MFA and external authentication (SAML2, OIDC, LDAP)  

---

## System Requirements (Wiki.js)

- Linux, Windows, macOS, or Docker  
- 2 CPU cores (recommended)  
- Minimum 1 GB RAM  
- PostgreSQL (recommended)  
- Node.js  

---

## Docker Installation (Wiki.js)

```yaml
services:

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: wiki
      POSTGRES_PASSWORD: REPLACE_WITH_SECURE_PASSWORD
      POSTGRES_USER: wikijs
    logging:
      driver: none
    restart: unless-stopped
    volumes:
      - db-data:/var/lib/postgresql/data

  wiki:
    image: ghcr.io/requarks/wiki:2
    depends_on:
      - db
    init: true
    environment:
      DB_TYPE: postgres
      DB_HOST: db
      DB_PORT: 5432
      DB_USER: wikijs
      DB_PASS: REPLACE_WITH_SECURE_PASSWORD
      DB_NAME: wiki
    restart: unless-stopped
    ports:
      - "80:3000"

volumes:
  db-data:
```

### Default Credentials (Wiki.js)

- Username: `admin@admin.com`  
- Password: `password`  

> Change these credentials immediately after first login.

---

## Resource Usage

During my tests I saw the following resource consumption values, although these will increase with scale:

### BookStack
- App: ~56-134 MB RAM  
- DB: ~85-158 MB RAM  

### Wiki.js
- App: ~246 MB RAM  
- DB: ~66 MB RAM  

---

## My Final Thoughts

Both BookStack and Wiki.js are strong self-hosted documentation platforms, and I would encourage experiencing both systems.

For my use case I believe BookStack would be a better fit due to its structuring of pages, simplicity and well rounded editors.
---
layout: post
title: "Media Request Management for Media Servers"
description: "A comparison of popular media request management services including Overseerr, Ombi, and Seerr, with a focus on Emby-based media servers."
date: 2026-02-15
assets: /assets/post/2026/media-requests
featured: false
tags:
  - homelab
  - media
  - self-hosted
  - docker
  - emby
excerpt: >
  Managing a self-hosted media library is easier with a request management service. This article compares Overseerr, Ombi, and Seerr, highlighting features, resource usage, and suitability.
---

## What Is a Media Request Management Service?

Setting up a media server is often the first step toward owning your content, reducing reliance on streaming services, and improving privacy. However, as your library grows and other users gain access, managing requests for new content quickly becomes a challenge.

A media request management service solves this by allowing users to:

- Search for movies, TV shows, or music  
- Submit requests without direct access to backend tools  
- Track request approval and availability  

This removes friction for users while keeping control firmly with the server owner.

---

## What Are Your Options?

The available options depend largely on which media server you run. The most common platforms are:

- Emby  
- Jellyfin  
- Plex  

In my setup, I run **Emby**, so I’m primarily interested in solutions that integrate well with it.

The three most common media request management tools are:

- [**Overseerr**](https://overseerr.dev/){:target="_blank"}
- [**Seerr**](https://seerr.dev/){:target="_blank"} *(previously known as Jellyseerr)*
- [**Ombi**](https://ombi.io/){:target="_blank"}

---

## Feature Comparison

| Feature | Overseerr | Seerr | Ombi |
|------|----------|------|------|
| **Supported Media Servers** | Plex | Emby, Jellyfin, Plex | Emby, Jellyfin, Plex |
| **User Import / Sync** | ✅ | ✅ | ✅ |
| **Reverse Proxy Support** | ✅ | ✅ | ✅ |
| **Custom Branding** | ❌ | ❌ | ✅ (CSS & branding) |
| **Database Options** | SQLite | SQLite, PostgreSQL | SQLite, MySQL/MariaDB, PostgreSQL |
| **Mobile App** | ❌ | ❌ | ✅ (iOS, Android) |
| **Docker Image Size** | ~747 MB | ~1.3 GB | ~302 MB |
| **RAM Usage** | ~300–800 MB | ~300–800 MB | ~250–500 MB |

All three services are commonly deployed via Docker, making them easy to integrate into an existing homelab stack.

---

## Overseerr

Overseerr is a well-designed request platform, but it is **Plex-only**. Because my environment is based on Emby, this immediately rules it out for my use case.

Example Docker Compose:

```yaml
volumes:
  config:

services:
  overseerr:
    image: sctx/overseerr:latest
    container_name: overseerr
    environment:
      - LOG_LEVEL=debug
      - TZ=Etc/UTC
    ports:
      - 5055:5055
    volumes:
      - config:/app/config
    restart: unless-stopped
```

---

## Seerr

Previously known as Jellyseerr, Seerr is a fork of Overseerr that extends support to Emby and Jellyfin.

Docker Compose example:

```yaml
volumes:
  config:

services:
  seerr:
    image: ghcr.io/seerr-team/seerr:latest
    init: true
    container_name: seerr
    environment:
      - LOG_LEVEL=debug
      - TZ=Etc/UTC
      - PORT=5055 # optional
    ports:
      - 5055:5055
    volumes:
      - config:/app/config
    restart: unless-stopped
```

Seerr supports the following DVR Integrations:

| Media Type | Intgration |
| ---------- | ---------- |
| TV | Sonarr |
| Movies | Radarr |

---

## Ombi

Ombi is one of the most mature and feature-rich request management platforms available. It supports Emby, Jellyfin, and Plex, and offers official mobile applications.

Docker Compose example:

```yaml
volumes:
  config:

services:
  ombi:
    image: lscr.io/linuxserver/ombi:latest
    container_name: ombi
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Etc/UTC
      - BASE_URL=/ # optional
    ports:
      - 3579:3579
    volumes:
      - config:/config
    restart: unless-stopped
```

Seerr supports the following DVR Integrations:

| Media Type | Intgration |
| ---------- | ---------- |
| TV | Sonarr, Sickrage |
| Movies | Radarr, CouchPotato |
| Music | Lidarr |

Ombi also provides:

- Bulk user importing and configuration  
- Music library requests  
- Advanced searching  
- Newsletters and notifications  
- Issue reporting  

---

### Using MariaDB

For larger deployments, Ombi recommends migrating from SQLite to MySQL or MariaDB for improved performance and stability, as it:

- Handles multiple concurrent users more effectively
- Avoids database locking issues common with SQLite
- Scales far better as request volume grows

We can configure this within a single Docker Compose file:

```yaml
volumes:
  config:
  db:

services:
  ombi:
    image: lscr.io/linuxserver/ombi:latest
    container_name: ombi
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Etc/UTC
      - BASE_URL=/ # optional
    ports:
      - 3579:3579
    volumes:
      - config:/config
    restart: unless-stopped
    depends_on: 
      - db

  db:
    image: mariadb:latest
    container_name: ombi-db
    environment:
      - MARIADB_ROOT_PASSWORD=Super!SecretPa55word
      - PGID=1000
      - PUID=1000
      - TZ=Etc/UTC
    volumes:
      -  db:/var/lib/mysql
    restart: unless-stopped
```

After starting the stack, create the database and user:

```bash
mariadb -u root -p
```

```bash
CREATE DATABASE IF NOT EXISTS `ombi` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
CREATE USER 'ombi'@'%' IDENTIFIED BY 'ombi';
GRANT ALL PRIVILEGES ON `ombi`.* TO 'ombi'@'%' WITH GRANT OPTION;
```

Within the Ombi web interface, select MariaDB during the setup wizard. A container restart will be required.

Once confirmed, remove the SQLite database files:

```bash
rm Ombi.db OmbiExternal.db OmbiSettings.db
```

Continue through the web interface wizard, then verify the DB configuration within Settings.

---

## Conclusion

Each request management platform targets a slightly different audience:

- **Overseerr** is ideal for Plex-only environments, but is effectively superseded by Seerr
- **Seerr** brings Overseerr’s workflow to Emby and Jellyfin
- **Ombi** offers the most complete feature set, broad DVR support, and mobile applications

For an Emby-based media server, **Ombi** stands out as the most flexible and mature choice, particularly in multi-user environments where long-term scalability matters.
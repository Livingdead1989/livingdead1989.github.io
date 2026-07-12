---
layout: post
title: "Emby on Debian"
description: "Install a Emby media server on Debian Linux."
date: 2026-07-12
featured: false
tags:
  - emby
  - debian
  - linux
  - self-hosting
  - media
excerpt: >
  Learn how to install and maintain a lightweight Emby media server on Debian Linux with a minimal installation.
---

# Self-Hosting an Emby Media Server on Debian

Setting up an Emby server on Debian Linux is straightforward and can be completed in just a few minutes. This guide focuses on a lightweight, self-hosted installation using a minimal Debian deployment.

For this deployment I do **not** use transcoding, as all client devices are capable of playing the media directly (Direct Play). This significantly reduces the hardware requirements.

## Server Specifications

The following virtual machine specifications have proven more than adequate for a Direct Play-only Emby server.

| Component | Specification | Notes |
|-----------|--------------|------|
| CPU | 4 vCPU | Typically 0–5% utilisation |
| Memory | 8 GB RAM | Around 4 GB idle |
| Operating System Disk | 32 GB | Approximately 5 GB used after installation |
| Media Storage | 4 × 4 TB | Configured separately from the OS |


> **Note**
>
> If you intend to use media transcoding, particularly 4K content or multiple simultaneous streams, you should add a supported GPU that supports hardware acceleration.

---

## Install Debian

A minimal Debian installation reduces resource usage and minimises the attack surface.

During installation, select only:

- SSH Server
- Standard System Utilities

Do **not** install:

- Desktop Environment

Once installation is complete, update the operating system:

```bash
sudo apt update
sudo apt upgrade -y
```

---

## Installing Emby

Download the latest Debian package from the Emby releases page.

```bash
wget https://github.com/MediaBrowser/Emby.Releases/releases/download/4.9.5.0/emby-server-deb_4.9.5.0_amd64.deb
```

Install the package:

```bash
sudo dpkg -i emby-server-deb_4.9.5.0_amd64.deb
```

Verify the service is running:

```bash
sudo systemctl status emby-server
```

Enable the service to start automatically after reboot:

```bash
sudo systemctl enable emby-server
```

Remove the installation package once installation has completed:

```bash
rm emby-server-deb_4.9.5.0_amd64.deb
```

---

## Initial Configuration

Open your browser and navigate to:

```
http://<server-ip>:8096
```

The setup wizard will guide you through:

- Creating an administrator account
- Selecting your preferred language
- Adding media libraries
- Configuring metadata providers
- Setting remote access preferences

Once complete, your Emby server is ready to use.

---

## Updating Emby

Updating Emby is identical to the installation process.

1. Download the latest Debian package.
2. Install it using `dpkg`.
3. Remove the downloaded package.

Verify the installed version from the Emby web interface under **Dashboard**.

---

## Useful Plugins

Emby includes a plugin catalogue that can extend the functionality of your media server.

1. Open the **Emby Dashboard**.
2. Navigate to **Plugins**.
3. Select the **Catalog** tab.

While the default installation is suitable for most users, the following plugins are worth considering.

| Plugin | Purpose |
|---------|---------|
| **Webhook** | Sends notifications to external services such as Home Assistant.
| **Kodi Companion** | Emby for Kodi Addon uses this plugin to allow for a faster startup sync. Change data is stored in the Emby data folder and queried by the Addon at a specific API Entry Point.
| **Chapter API** | Downloads community-generated chapter markers, allowing you to skip directly to key scenes within movies and TV episodes. |
| **MusicBrainz** | Improves music metadata by identifying artists, albums and tracks using the MusicBrainz database. Essential for well-organised music libraries. |
| **Open Subtitles** | Automatically searches for and downloads subtitles from OpenSubtitles, helping improve accessibility and support for foreign language content. |
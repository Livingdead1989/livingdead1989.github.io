---
title: "From Frankenstein to Focused: The 2026 Homelab"
layout: project
status: active # active / updated / archived
featured: true
homepage: https://networkingdream.com

description: >
  A reflection on my homelab’s evolution and a plan to refocus it in 2026 while exploring new computing challenges.

excerpt: >
  As 2026 begins, I’m stepping back to review my homelab—what’s worked, what hasn’t, and how it can evolve to support a new year of focused learning, exploration, and efficient computing.

tags:
  - learning

started: 2026-01-08
archived: false
og_image: /assets/og/projects/site.png

assets: /assets/projects/homelab-2026

mermaid: true
---

## Overview: My Homelab and Self-Hosting Journey

A homelab is a deeply personal project. We all invest time, money, and effort into building systems that reflect our curiosity—whether that curiosity is driven by learning, self-hosting, or simply understanding how things work.

This series is a deliberate pause and reset. As 2026 begins, I’m stepping back to review my homelab as it exists today—what it does well, where it has accumulated unnecessary complexity, and how it can evolve into a more focused platform for learning and experimentation.

Over the course of this series, I’ll be covering:

- What has worked well in the past, and where there’s room for improvement  
- The technologies and problem spaces I want to explore in 2026  
- How to maximise the value of my existing homelab hardware  
- What to retire, what to keep, and what to rebuild or migrate   

---

### Why I’m Revisiting My Homelab in 2026

Over the years, my homelab has evolved from a classic Frankenstein’s monster into more conventional server-grade hardware. More recently, I’ve intentionally scaled things back—prioritising energy efficiency, simplicity, and clearly defined responsibilities for each system.

Despite this shift, the homelab still runs the core self-hosted services my household depends on every day.

At the start of 2026, I want to reignite the exploratory side of computing—the part that originally drew me into homelabs. This feels like the right time to reassess whether my current setup still aligns with my goals, or whether it has quietly drifted into “just keeping things running.”

---

### What Self-Hosting Means in My Homelab Today

Self-hosting gives me freedom: the freedom to explore computing in a safe, controlled environment and to develop skills without imposed direction or ongoing subscription costs.

My homelab also provides critical household services, alongside convenience services such as media streaming. By hosting these services myself, I retain control over my data while prioritising privacy and flexibility.

Because these services are relied upon day to day, stability is essential. I intentionally separate production workloads from experimental systems so I can learn, break things, and experiment without impacting the household.

---

## Current State of My Homelab Setup

### Network Diagram

<div class="mermaid">
flowchart TD
    isp((Internet)) --> openWRT(RPI 
            openWRT 
            Router)

    subgraph Switch Core
        openWRT --> switchCore[\Switch Managed\]
        omv(RPI 
        Open Media Vault
        Storage) --> switchCore
        proxmox(N100 
        Proxmox 
        Hypervisor) --> switchCore
        hassio(RPI 
        Home Assistant 
        Zigbee) --> switchCore
    end

    disk[(DAS 
        Storage)] --- omv

    subgraph PoE Switch
        switchPoE[\Switch PoE Unmanaged\] ---> switchCore
        doorbell(Doorbell) --> switchPoE
        wifi(Wi-Fi AP) --> switchPoE
        camera(Camera) --> switchPoE
    end
</div>

---

### Hardware Philosophy

The homelab is intentionally compact, energy-efficient, and role-driven. Each device exists for a clear purpose—nothing is running “just in case.”

The house is fully wired with Cat6A Ethernet, providing a strong foundation for future upgrades and enough headroom to introduce 10 GbE where it makes sense.

---

### Hardware Inventory

I’ve installed Cat6A Ethernet cabling throughout the home. This provides a solid foundation for future upgrades and ensures the network is ready for 10 GbE when needed.

My current homelab is intentionally compact, with a focus on low power usage and clearly defined roles for each device.

<details>
  <summary>Primary Compute</summary>
  <ul>
    <li>Intel N100 CPU</li>
    <li>32 GB RAM</li>
    <li>500 GB internal NVMe storage</li>
    <li>200 GB external SSD</li>
  </ul>
</details>

<details>
  <summary>Storage</summary>
  <ul>
    <li>Raspberry Pi 4</li>
    <li>2 Bay Direct Attached Storage</li>
    <li>2 × 4 TB HDDs configured as a mirrored RAID array</li>
  </ul>
</details>

<details>
  <summary>Firewall and Router</summary>
  <ul>
    <li>Raspberry Pi 4</li>
    <li>Secondary network via USB</li>
  </ul>
</details>

<details>
  <summary>Networking</summary>
  <ul>
    <li>16-port 1 GbE smart managed switch</li>
    <li>5-port 1 GbE PoE unmanaged switch</li>
  </ul>
</details>

<details>
  <summary>Home Automation</summary>
  <ul>
    <li>Raspberry Pi 4</li>
    <li>USB Zigbee coordinator</li>
  </ul>
</details>

---

### Core Self-Hosted Services I Rely On

The homelab has become a critical part of daily life. While individual products may change during this review, these capabilities must remain available.

<div class="mermaid">
  flowchart TD
    subgraph Key Services
        openWRT
        PiHole
        NPM
        Omada
        HA[Home Assistant]
        Emby
        NextCloud 
    end
    
</div>

- **OpenWRT**
  - Firewall
  - VPN
  - Dynamic DNS (DDNS)
- **PiHole**
  - DNS
  - DHCP
- **NPM** (Nginx Proxy Manager)
  - Reverse Proxy
  - Let's Encrypt Certificates
- **Omada**
  - Wi-Fi Management
- **Home Assistant**
- **Emby**
  - Media Server
- **NextCloud**
  - File Sync and Sharing

---

## Homelab Goals and Learning Priorities for 2026

Rather than a rigid roadmap, these are guiding themes I want the homelab to support throughout 2026:

- **Resiliency** — Designing systems that fail gracefully
- **Security** — Improving network and service-level security practices
- **Automating** — Reducing repetitive and manual operational work
- **Monitoring** — Observability that answers meaningful questions
- **Electronics** — Combining hardware experimentation with software systems

Many of these areas intentionally overlap.

---

## Planning the 2026 Homelab Refresh

This project will evolve as the 2026 homelab takes shape. Check back soon.

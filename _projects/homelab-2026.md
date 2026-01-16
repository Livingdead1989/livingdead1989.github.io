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
  - homelab
  - server
  - hardware

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
flowchart TB
  isp((Internet)) --> fw
  switchServer[\Switch Managed\] --- switchPoE[\Switch PoE Unmanaged\]

  fw(Firewall) --> switchServer
  hassio(Home 
  Assistant) --> switchServer
  proxmox(Compute
  Proxmox) --> switchServer
  omv(Storage
  Open Media Vault) --> switchServer

  das[(DAS)] -- USB --- omv
  ssd[(SSD)] -- USB --- proxmox
  zigbee[Zigbee 
  Coordinator] -- USB --- hassio

  doorbell(Doorbell) --> switchPoE
  camera(Camera) --> switchPoE

  subgraph WiFi
    wifi1(Wi-Fi AP)
    wifi2(Wi-Fi AP)
  end
  WiFi --> switchPoE
</div>

---

### Hardware Inventory

The house is fully wired with Cat6A Ethernet, providing a strong foundation for future upgrades and enough headroom to introduce 10 <abbr title="Gigabit Ethernet">GbE</abbr> where it makes sense.

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
  - <abbr title="Virtual Private Network">VPN</abbr>
  - <abbr title="Dynamic Domain Name System">DDNS</abbr>
- **PiHole**
  - <abbr title="Domain Name System">DNS</abbr>
  - <abbr title="Dynamic Host Configuration Protocol">DHCP</abbr>
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

## Pinch Points and Responses

Running my own servers over time has highlighted a number of practical weaknesses in the current setup. These lessons—mostly learned the hard way—directly inform how the 2026 homelab will be redesigned. Each pinch point is paired with a response.

In no particular order:

<details>
  <summary>1. Power Outages (Rare, but Impactful)</summary>
  <p><strong>Problem</strong></p>
  <p>The homelab currently has no <abbr title="Uninterruptible Power Supply">UPS</abbr>. As a result, it cannot tolerate short power outages or perform a graceful shutdown, risking filesystem corruption and service instability.</p>
  <p><strong>Resolution</strong></p>
  <p>Introduce a <abbr title="Uninterruptible Power Supply">UPS</abbr> capable of sustaining the homelab during short outages and providing sufficient runtime for an orderly, automated shutdown when battery capacity is low. Integration with hosts and critical services will be required to avoid abrupt power loss.</p>
</details>

<details>
  <summary>2. Automatic Power-On Dependencies</summary>
  <p><strong>Problem</strong></p>
  <p>Media storage is hosted on a USB <abbr title="Direct Attached Storage">DAS</abbr> that does not automatically power on after a power loss. When this occurs, OpenMediaVault starts without its backing storage, leading to failed mounts and cascading failures in media-related containers.</p>
  <p><strong>Resolution</strong></p>
  <p>Replace the existing USB <abbr title="Direct Attached Storage">DAS</abbr> with storage hardware that supports automatic power-on after an outage. This removes a single point of failure and ensures storage-dependent services can recover cleanly without manual intervention.</p>
</details>

<details>
  <summary>3. Proxmox CPU I/O Delay Spikes</summary>
  <p><strong>Problem</strong></p>
  <p>Occasional spikes in <abbr title="Central Processing Unit">CPU</abbr> <abbr title="Input Output">I/O</abbr> wait within Proxmox lead to noticeable performance degradation. This is most likely caused by slow or overwhelmed storage. Tools such as `iotop` help identify disk-heavy workloads, but they do not address the underlying storage bottleneck.</p>
  <p><strong>Resolution</strong></p>
  <p>Migrate to faster storage with higher sustained <abbr title="Input Output">I/O</abbr> throughput and lower latency. The storage layer must be capable of absorbing bursty workloads without pushing the hypervisor into prolonged <abbr title="Input Output">I/O</abbr> wait states.</p>
  <p>Where appropriate, introduce a secondary compute node to distribute workloads, reduce contention, and smooth performance during peak activity, while providing fault tolerance through automatic failover or workload migration.</p>
</details>

<details>
  <summary>4. Network Performance Ceilings</summary>
  <p><strong>Problem</strong></p>
  <p>Although the house is wired with Cat6A, most active networking equipment is limited to 1 <abbr title="Gigabit Ethernet">GbE</abbr>. While the physical infrastructure is ready for higher speeds, the hardware currently caps throughput.</p>
  <p><strong>Resolution</strong></p>
  <p>Incrementally upgrade network interfaces and switching to support 2.5 <abbr title="Gigabit Ethernet">GbE</abbr> or 10 <abbr title="Gigabit Ethernet">GbE</abbr> where it provides measurable benefit. Existing cabling allows this to be done selectively rather than through a full network replacement.</p>
</details>

<details>
  <summary>5. Storage Capacity Growth</summary>
  <p><strong>Problem</strong></p>
  <p>When initially deployed, 4 TB disks felt generous. Over time—particularly with media and backups—capacity has filled faster than expected, resulting in reactive rather than intentional expansion.</p>
  <p><strong>Resolution</strong></p>
  <p>Redesign the storage layout around higher-capacity modern disks with deliberate room for expansion. Capacity planning should balance redundancy, power consumption, and future growth.</p>
</details>

<details>
  <summary>6. Remote Access Limitations</summary>
  <p><strong>Problem</strong></p>
  <p>On rare occasions, remote management of the homelab is required. While front-end services are accessible externally, management interfaces are intentionally not exposed to the <abbr title="Wide Area Network">WAN</abbr>. This improves security but limits the ability to respond to issues when off-site.</p>
  <p><strong>Resolution</strong></p>
  <p>Introduce secure, authenticated, and encrypted entry point for remote administration, enabling off-site management without exposing internal interfaces directly to the internet. Access should remain tightly scoped, logged, and auditable.</p>
</details>

<details>
  <summary>7. No Backup</summary>
  <p><strong>Problem</strong></p>
  <p>As my homelab has grown, new services have been deployed and the household has become increasingly dependent on it. Despite this, little consideration has been given to backups beyond the use of a mirrored <abbr title="Redundant Array of Independent Disks">RAID</abbr> array, which provides redundancy but is not a substitute for a proper backup strategy.</p>
  <p><strong>Resolution</strong></p>
  <p>Introduce a backup strategy that protects critical application data and configuration. Backups should run regularly to independent storage, with retention policies that allow recovery from both recent failures and historical data corruption. The entire backup process should be automated to ensure consistency and reliability.</p>
</details>


---

## New Design

With a few tweaks, I can achieve all of my targets:  

- By adding a <abbr title="Uninterruptible Power Supply">UPS</abbr> to my <abbr title="Power Distribution Unit">PDU</abbr>, I can provide battery power to all hardware simultaneously.  
- Adding another Proxmox compute node will enable me to transition to a <abbr title="High Availability">HA</abbr> Proxmox cluster. This not only improves resiliency but also reduces the impact of bursty workloads.  
- Transition from a USB to a networked Zigbee coordinator, ensuring that Home Assistant can access it reliably within a <abbr title="High Availability">HA</abbr> Proxmox cluster.  
- Transitioning to a <abbr title="Network Attached Storage">NAS</abbr> allows me to remove automatic power-on dependencies completely, accommodate additional drives for future growth, and provide a repository for backups.  
- Ensuring that any new hardware supports at least 2.5 <abbr title="Gigabit Ethernet">GbE</abbr> will enable me to leverage improved network capabilities, while existing hardware can be upgraded as needed.  
- Incorporating a <abbr title="Virtual Private Network">VPN</abbr> server will provide secure remote access for network management.  


---

### Hardware

This is a concept diagram of what my hardware network would look like after the additions.

<div class="mermaid">
flowchart TB
  isp((Internet)) --- fw
  switchServer[\Switch Managed\] --- switchPoE[\Switch PoE Unmanaged\]

  fw(Firewall) --- switchServer
  data[(NAS)] --- switchServer
      
  subgraph cluster[Proxmox Cluster]
    c1(Proxmox 1) -.- c2
    c2(Proxmox 2)
  end
  cluster --- switchServer

  zigbee(Zigbee 
    Coordinator) --- switchPoE
  doorbell(Doorbell) --- switchPoE
  camera(Camera) --- switchPoE

  subgraph WiFi
    wifi1(Wi-Fi AP)
    wifi2(Wi-Fi AP)
  end
  WiFi --- switchPoE
</div>

---

### Services

Using a two-node Proxmox cluster provides the ability to consolidate services into the cluster. This not only makes the services highly available but also allows for load balancing of certain services.

<div class="mermaid">
flowchart
  subgraph c1[Proxmox 1]
    dns1(DNS)
    dhcp1(DHCP)
    proxy1(Proxy)
    nc(NextCloud)
    emby(Emby)
    uptime(Uptime-Kuma)
  end

  subgraph c2[Proxmox 2]
    dns2(DNS)
    dhcp2(DHCP)
    proxy2(Proxy)
    ha(Home Assistant)
    omada(Omada)
  end

  proxy1 <-.-> proxy2
  dns1 <-.-> dns2
  dhcp1 <-.-> dhcp2

</div>

---

This project will evolve as the 2026 homelab takes shape. Check back soon.
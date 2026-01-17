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
  isp((Internet
  Modem)) --> fw
  switchServer[\Switch Managed\] --- switchPoE[\Switch PoE Unmanaged\]

  fw(Firewall) --> switchServer
  hassio(Home 
  Assistant) --> switchServer
  proxmox(Proxmox) --> switchServer
  omv(Open Media Vault) --> switchServer

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

| Service | Primary Function(s) | Notes |
|---------|------------------|-------|
| **[OpenWRT](https://openwrt.org/){:target="_blank"}** | Firewall, <abbr title="Virtual Private Network">VPN</abbr>, <abbr title="Dynamic Domain Name System">DDNS</abbr> | Core network routing and security |
| **[Pi-hole](https://pi-hole.net/){:target="_blank"}** | <abbr title="Domain Name System">DNS</abbr>, <abbr title="Dynamic Host Configuration Protocol">DHCP</abbr> | Network-level ad blocking |
| **[Portainer](https://www.portainer.io/){:target="_blank"}** | Docker Management | Web GUI simplifies container deployment |
| **[Nginx Proxy Manager](https://nginxproxymanager.com/){:target="_blank"}** | Reverse Proxy, Let's Encrypt Certificates | Centralized HTTPS and internal routing |
| **[Omada](https://www.tp-link.com/en/business-networking/omada/){:target="_blank"}** | Wi-Fi Management | Wireless AP controller and monitoring |
| **[Home Assistant](https://www.home-assistant.io/){:target="_blank"}** | Automation & Control | Household automation and monitoring |
| **[Emby](https://emby.media/){:target="_blank"}** | Media Server | Video & Audio streaming to devices |
| **[Nextcloud](https://nextcloud.com/){:target="_blank"}** | File Sync & Sharing | Centralized storage with external access |
| **[Uptime-Kuma](https://uptime.kuma.pet/){:target="_blank"}** | Service Monitoring & Notifications | Tracks uptime and sends alerts |

---

## Software and Services Review

It’s important to look beyond hardware and critically review the software and services that make up the homelab.

This review focuses on how well each service fits its intended purpose—what has worked well, where friction or pinch points exist, and what changes may be worthwhile to better support continued learning and experimentation.

---

### Infrastructure Services

<details>
  <summary>Proxmox</summary>
  <p><span class="tag">Keep</span></p>
  <p><a href="https://www.proxmox.com/en/" target="_blank">Proxmox</a> has been reliable as a single-node hypervisor and has enabled rapid experimentation with virtual machines and containers. The performance issues I’ve encountered are largely attributable to underlying hardware limitations rather than Proxmox itself. At this point, I have no concerns with the platform and am happy to continue using it as the foundation of my homelab.</p>
  <p><strong>Possible Alternative:</strong> <a href="https://xcp-ng.org/" target="_blank">XCP-ng</a> an open-source virtualization with enterprise features, high availability, and clustering support.</p>
</details>

<details>
  <summary>OpenWRT</summary>
  <p><span class="tag">Replace</span></p>
  <p><a href="https://openwrt.org/" target="_blank">OpenWRT</a> has proven to be a stable and capable firewall and routing platform, offering flexibility through additional services such as VPN routing. While I have no issues with its reliability or feature set, migrating to an alternative solution could help broaden my understanding of networking and firewall architectures.</p>
  <p><strong>Possible Alternatives:</strong> <a href="https://opnsense.org/" target="_blank">OPNsense</a> or <a href="https://www.pfsense.org/" target="_blank">pfSense</a> provides a similar feature set with a modern interface and more enterprise-grade options, while also supporting HA configurations.</p>
</details>

<details>
  <summary>Pi-hole</summary>
  <p><span class="tag">Replace</span></p>
  <p><a href="https://pi-hole.net/" target="_blank">Pi-hole</a> has been a dependable service within the homelab, handling DNS sinkholing, local DNS resolution, and <abbr title="Dynamic Host Configuration Protocol">DHCP</abbr> for the network. Its GUI is convenient and lightweight, making management easy.</p>
  <p>However, Pi-hole abstracts many of the underlying systems. To gain deeper understanding of DNS and DHCP while maintaining manageability, a more native approach is desirable.</p>
  <p><strong>Possible Alternative:</strong> <a href="https://www.webmin.com/" target="_blank">Webmin</a> provides a web-based interface to manage Bind9, dnsmasq, and DHCP directly on the host. This allows full visibility into configurations and control over the native services, giving hands-on experience with the core DNS/DHCP systems while retaining a GUI for convenience.</p>
</details>

<details>
  <summary>Nginx Proxy Manager (NPM)</summary>
  <p><span class="tag">Replace</span></p>
  <p><a href="https://nginxproxymanager.com/" target="_blank">Nginx Proxy Manager</a> has significantly simplified TLS certificate management and internal service routing. Over time, it has become a central dependency for many services. Given its importance, introducing a highly available proxy solution would improve resilience and reduce the impact of a single point of failure.</p>
  <p><strong>Possible Alternatives:</strong> <a href="https://traefik.io/" target="_blank">Traefik</a> or <a href="https://www.haproxy.com/" target="_blank">HAProxy</a> provide more direct control over routing, SSL, and load balancing while supporting dynamic configurations for modern applications.</p>
</details>

<details>
  <summary><strong>Portainer</strong></summary>
  <p><span class="tag">Retire</span></p>
  <p><a href="https://www.portainer.io/" target="_blank">Portainer</a> provides a web interface to manage <a href="https://www.docker.com/" target="_blank">Docker</a> and containerized workloads, simplifying deployment and monitoring.</p>
  <p>While it has been reliable and useful during early adoption of containerization, it abstracts much of the underlying Docker workflow. This reduces direct interaction with core concepts such as container lifecycle management, networking, volumes, and image handling.</p>
  <p><strong>Possible Alternative:</strong> Managing containers directly using the Docker CLI with <code>docker compose</code> promotes hands-on interaction with native Docker components.</p>
</details>

---

### User-Facing Services

<details>
  <summary>Nextcloud</summary>
  <p><span class="tag">Review Later</span></p>
  <p><a href="https://nextcloud.com/" target="_blank">Nextcloud</a> provides centralised file storage with cross-platform access and external availability. It has been reliable and meets current needs. However, many features are unused; I can either deepen my use of Nextcloud’s capabilities or explore a more focused file sync solution.</p>
  <p><strong>Possible Alternative:</strong> <a href="https://syncthing.net/" target="_blank">Syncthing</a> provides lightweight peer-to-peer file syncing across devices without the overhead of a full platform.</p>
</details>

<details>
  <summary>Emby</summary>
  <p><span class="tag">Review Later</span></p>
  <p><a href="https://emby.media/" target="_blank">Emby</a> has been a reliable media streaming platform with steady development and consistent performance. It currently meets all of my requirements, and there are no immediate drivers to replace it.</p>
  <p><strong>Possible Alternative:</strong> <a href="https://jellyfin.org/" target="_blank">Jellyfin</a> is fully open-source, actively maintained, and offers a growing ecosystem of plugins.</p>
</details>

<details>
  <summary>Home Assistant</summary>
  <p><span class="tag">Keep</span></p>
  <p><a href="https://www.home-assistant.io/" target="_blank">Home Assistant</a> has become deeply embedded in household operations, providing reliable automation, dashboards, and device management. Acting as the central control plane, it consumes device state and events from services such as <a href="https://www.zigbee2mqtt.io/" target="_blank">Zigbee2MQTT</a> while presenting a unified interface for the household.</p>
  <p>To complement this, <a href="https://nodered.org/" target="_blank">Node-RED</a> can be introduced as a companion service for building more complex, event-driven automations, creating a clear learning path for event-driven architecture and system orchestration.</p>
  <p><strong>Deployment Options:</strong> Node-RED, MQTT, and Zigbee2MQTT can be run as separate containers to gain hands-on experience with the underlying technologies and achieve greater resilience.</p>
  <p><strong>Possible Alternative:</strong> <a href="https://www.openhab.org/" target="_blank">OpenHAB</a> – a vendor and technology agnostic open source automation software.</p>
</details>


<details>
  <summary>Uptime-Kuma</summary>
  <p><span class="tag">Keep</span></p>
  <p><a href="https://uptime.kuma.pet/" target="_blank">Uptime-Kuma</a> provides service monitoring with customizable alerts and notifications. Its lightweight design and intuitive web interface make it simple to deploy and maintain. The service has been stable and effectively meets the homelab’s monitoring needs.</p>
  <p>Future considerations include integrating Uptime-Kuma with Home Assistant automations, allowing alerts to trigger recovery actions or other automated responses.</p>
  <p><strong>Possible Alternatives:</strong>  <a href="https://prometheus.io/" target="_blank">Prometheus</a> + <a href="https://grafana.com/" target="_blank">Grafana</a> or <a href="https://www.zabbix.com/" target="_blank">Zabbix</a> – more advanced monitoring and alerting, enterprise-grade insights.</p>
</details>

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

Fundamentally, there are no issues with the software or services; instead, the homelab would benefit from architectural and hardware changes to meet all targets.  

These can be summarised as:

- **Add** a <abbr title="Uninterruptible Power Supply">UPS</abbr> to provide battery power to all hardware.  
- **Deploy** an additional Proxmox compute node to create a <abbr title="High Availability">HA</abbr> Proxmox cluster, improving resiliency and reducing the impact of bursty workloads.  
- **Replace** the USB Zigbee coordinator with a networked coordinator to ensure reliable access for Home Assistant within the <abbr title="High Availability">HA</abbr> cluster.  
- **Move** storage to a <abbr title="Network Attached Storage">NAS</abbr> to remove automatic power-on dependencies, accommodate future drive expansion, and provide a backup repository.  
- **Upgrade** network hardware to support at least 2.5 <abbr title="Gigabit Ethernet">GbE</abbr>, leveraging improved network speeds while maintaining the option to uplift existing equipment.  
- **Introduce** a <abbr title="Virtual Private Network">VPN</abbr> server to provide secure remote access for network management.


---

### Hardware

This is a concept diagram of what my hardware network would look like after the additions.

<div class="mermaid">
flowchart LR
  subgraph ups[UPS Protection Group]
    isp((Internet 
    Modem)) --- fw
    switchServer[\Switch Managed\] ---- switchPoE[\Switch PoE Unmanaged\]

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
  end
</div>

---

### Software & Services

Highly Available (HA) Services
: Designed to tolerate node or service failure. If one instance becomes unavailable, another takes over with minimal disruption.

Load-Balanced Services
: Distribute traffic across multiple active instances to improve performance and responsiveness. Only applicable to services that support concurrent operation.

Using a Proxmox cluster provides the opportunity to consolidate services that have been running a standalone hardware into the cluster. This not only makes the services highly available but also allows for load balancing of certain services.

<div class="mermaid">
flowchart LR
  subgraph c1[Proxmox 1]
    service1(DNS, DHCP, Proxy)
    nc(NextCloud)
    emby(Emby)
    uptime(Uptime-Kuma)
  end

  subgraph c2[Proxmox 2]
    service2(DNS, DHCP, Proxy)
    ha(Home Assistant)
    omada(Omada)
  end

  service1 -.- service2

</div>

<small>Dotted Links - represent synchronization, state awareness, or failover relationships rather than direct client traffic.</small>


---

## From Plan to Reality

This project will evolve as the 2026 homelab takes shape. Check back soon.

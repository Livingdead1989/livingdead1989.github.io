---
title:  "Network Design"
date:   2020-12-06 12:00:00 +0000
categories: networking
---

## Network Design

All enterprise networks must be able to do the following:

- Support critical applications
- Support converged network traffic
- Support diverse business needs
- Provide centralized administrative control

**The Cisco Borderless Network**

It allows organizations to support a borderless  network that can connect:

* anyone, 
* anywhere, 
* anytime, 
* on any device;  
* securely, 
* reliably, 
* and seamlessly.

The Cisco Borderless Network provides the framework to unify wired and  wireless access, including policy, access control, and performance  management across many different device types.

Borderless switched network design guidelines are built upon the following principles:

- **Hierarchical** - The design facilitates understanding the role of each device at every tier, simplifies deployment, operation, and management, and reduces  fault domains at every tier.
- **Modularity** - The design allows **seamless network expansion** and integrated service enablement on an on-demand basis.
- **Resiliency** - The design satisfies user expectations for keeping the network **always on.**
- **Flexibility** - The design allows intelligent traffic load sharing by **using all network resources.**

Three-Tier and Two-Tier Model

![Tiered Models](/assets/images/posts/tier_models.png)

**Core Layer**

* Network backbone
* Aggregation for Distribution Layer
* Provides fault isolation
* Provides high speed backbone

**Distribution Layer**

* Middle layer
* Aggregating Layer 2 broadcast domains
* Aggregating Layer 3 routing boundaries
* Intelligent switching, routing and network access policy functions
* High availability through redundancy
* Differentiated services, various classes of services

**Access Layer**

* The network edge

* Provides network access to user

* Next-gen switching provides converged integrated and intelligent services

  

## Design for Scalability

Using expandable, modular equipment or clustered devices that can be easily upgraded to increase capabilities.

Create an IPv4 and IPv6 address strategy that is hierarchical

Routers or L3 Switches to limit broadcast and filter traffic.

* Redundant Links
* Multiple Links
* Scalable Routing Protocol
* Wireless Connectivity

**Redundancy**

* Minimising single point of failures
  * Duplicate equipment with failover
  * Multiple paths

**Reduce Failure Domain Size**

Failure at the Core layer will have a large impact, efforts to reduce this will cost.

Its cheaper and easier to control failure at the Distribution layer 

Routers or multi-layer switches are usually deployed in pairs with access layer switches divided between them, this is referred to a building or departmental switch block.

**Increase bandwidth**

Some links between access and distribution may need to process a greater amount of traffic than others.

Link aggregation, such as EtherChannel allows to increase bandwidth by creating one logical link made up of several physical links.

EtherChannel takes advantage of load balancing between links, one or more load-balancing methods can be implemented.

**Expand the Access Layer**

Adding wireless to the access layer allows for mobility and reduced costs for flexible desks.

**Routing Protocol**

Using an advanced routing protocol such as OSPF allows for the network to grow, a fast convergence and maintained neighbour adjacencies allows for routes and best paths to change when the network expands.

<br>

## Hardware

**Switches**

LAN Switches

* Large variety from fan-less, 8 port to 13-blade switches with hundreds of ports.
* Models include: 2960, 3560, 3650, 3850, 4500, 6500 and 6800

Cloud-managed Switches

* Cloud managed with virtual stacking
* Monitor and configure over the web

Data Centre Switches 

* Promote infrastructure scalability, operational continuity and transport flexibility.
* Models include: Nexus series

Service Provider Switches

* Fall under two categories: Aggregation switches and Ethernet access switches
* Aggregation switches are carrier-grade
* Ethernet switches aggregate traffic at the edge
* Feature: application intelligence, unified services, virtualisation, integrated security and simplified management

Virtual Networking

* For virtualised networks
* Adding secure multi-tenant services by adding virtualisation intelligence to data centre networks

**Switch Form Factors**

1. Fixed configuration
2. Modular configuration - field replaceable line cards
3. Stackable configuration - interconnected and managed as a single device

**Port Density** refers to the number of ports available on a single switch.

**Forwarding Rates** define the processing capabilities of a switch, how much data can be processed per second. Example: 48-port gigabit switch at full wire speed generates 48Gbps of traffic if the forwarding gate is 32Gbps it cannot run at full wire speed.

**Frame buffer** is the ability to store frames when there is congestion.

**Power over Ethernet (PoE)** allows the switch to deliver power to a device.

<br>

### Routers

**Roles**

* Interconnecting multiple sites
* Providing redundant paths
* Connecting to ISPs
* Translator between media types and protocols
* Broadcast containment
* Security filtering through ACL

**Types**

* Branch Routers
  * Designed for 24x7x365 uptime
  * Simple network configuration and management for LANs and WANs.
  * Example: *Cisco Integrated Services Router (ISR) 4000 Series*
* Network Edge Routers
  * Designed for fast performance with high security for data centers, campus, and branch networks.
  * Example: *Cisco Aggregation Services Routers (ASR) 9000 Series*
* Service Provider Routers
  * Designed for end-to-end delivery of subscriber services.
  * Deliver next-generation internet experience across all devices and locations.
  * Example: *Cisco Network Convergence System (NCS) 6000 Series*
* Industrial
  * Designed to provide enterprise-class features in rugged and harsh environments.
  * Example: *Cisco 1100 Series Industrial Integrated Services*






















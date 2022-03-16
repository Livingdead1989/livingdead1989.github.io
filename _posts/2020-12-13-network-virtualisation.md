---
title:  "Network Virtualisation"
date:   2020-12-13 17:00:00 +0000
categories: networking
---

## Cloud Computing

Typically, an off-premise service that offers on-demand access to a shared pool of configurable computing resources. Cloud computing, with its “pay-as-you-go” model, allows organisations to treat computing and storage expenses more as a utility rather than  investing in infrastructure.

**Cloud Services**

* Software as a Service (**Sass**)
  * Example: Office 365
  * Cloud providers is responsible for access to applications and services.
  * User does not manage any aspect of the service.
* Platform as a Service (**PaaS**)
  * Cloud provider is responsible for access to development tools
* Infrastructure as a Service (**IaaS**)
  * Cloud provider is responsible for giving IT managers access to network equipment, virtualised services and supporting network infrastructure.

**Cloud Models**

* Public clouds
  * Available to the general population.
  * Free or are offered on a pay-per-use model.
* Private clouds
  * Intended for a specific organisation or entity.
  * Can be set up using the organisation's private network.
  * Can be expensive to build and maintain.
* Hybrid clouds
  * Made up of two or more clouds.
* Community clouds
  * Exclusive use by a specific community, such as healthcare or media.

## Virtualisation

Allows for multiple operating systems to exist on a single hardware platform by abstracting the Services, OS, Firmware and Hardware into layers.

**Advantages of Virtualisation**

* **Less equipment is required**
  * Server consolidation, fewer networking devices, and less supporting infrastructure. It also  means lower maintenance costs.
* **Less energy is consumed**
  * lowers the monthly power and cooling costs.
* **Less space is required**
  * Fewer servers, network devices, and racks reduce the amount of required floor space.
* **Easier prototyping**
  * Self-contained labs
* **Faster server provisioning**
  * Faster than provisioning a physical server.
* **Increased server up-time**
  * Redundant fault tolerance features, such as live migration, storage migration, high availability, and distributed resource scheduling.
* **Improved disaster recovery**
* **Legacy support**

**Type 1 - Bare Metal Hypervisor**

Type 1 hypervisors require an additional management console to be installed to manage the hypervisor nodes. Examples of type 1 hypervisors include:

* KVM
* Red Hat RHEV
* Xen
* VMware ESXi and vSphere
* Microsoft Hyper-V *(not MS Server with Hyper-V role)*

**Type 2 - Hosted Hypervisor**

Hypervisor is installed on top of the existing OS, examples include:

* Virtualbox
* VMware Workstation
* Parallels
* Microsoft Hyper-V role

Virtualised switching and routing

## Virtual Network Infrastructure

Network functions can be virtualised. Each network device can be  segmented into multiple virtual devices that operate as independent  devices.

Examples include sub-interfaces, virtual interfaces, VLANs, and  routing tables.

Virtualised routing is called virtual routing and forwarding (VRF).

## Software-Defined Networking

A network device contains the following planes:

* **Management plane**
* **Control plane**
  * Considered as the brains of the device
  * Used to make forwarding decisions
    * Layer 2 and Layer 3 routes
    * Routing protocol neighbour tables
    * Routing protocol topology tables
    * IPv4 and IPv6 routing tables
    * Spanning Tree Protocol (STP)
    * Address Resolution Protocol (ARP)
* **Data plane** *(Forwarding plane)*
  * Switch fabric connecting network ports on a device

Software-Defined Networking moves the control plane of each networking device into a single controller.

![Traditional and SDN architecture comparison](/assets/images/posts/trad_vs_sdn.png)

Two major network architectures have been developed to support network virtualization:

* **Software-Defined Networking (SDN)** - A network architecture that virtualizes the network.
* **Cisco Application Centric Infrastructure (ACI)** - A purpose-built hardware solution for integrating cloud computing and data center management.

Components of SDN may include the following:

* **OpenFlow**
  * Manage traffic between routers, switches, wireless access points and a controller
* **OpenStack**
  * Virtualisation and Orchestration platform
  * Provides IaaS (Infrastructure as a Service)
* **Other components**
  * Interface two the Routing System (**I2RS**)
  * Transparent Interconnection of Lots of Links (**TRILL**)
  * Cisco FabricPath (**FP**)
  * IEEE 802.1aq Shortest Path Bridging (**SPB**)

## Controllers

The SDN controller defines the data flows between the centralised control plane and the data planes on individual routers and switches.

1. Each flow travelling through the network must first get permission from the SDN controller,
2. Verifies that the communication is permissible according to the network policy
3. If the controller allows a flow, it computes a route for the flow to take and adds an entry for that flow in each of the switches along the path.

Within each switch, a series of tables implemented in hardware or  firmware are used to manage the flows of packets through the switch.

* **Flow Table**
  * matches incoming  packets to a particular flow and specifies the functions that are to be  performed on the packets.
  * There may be multiple flow tables that operate in a pipeline fashion.
* **Group Table**
  * A flow table may direct a flow to a Group Table, which may trigger a variety of actions that affect one or more flows
* **Meter Table**
  * This table triggers a variety of performance-related actions on a flow including the ability to rate-limit the traffic.

## Cisco's Application Centric Infrastructure (ACI)

Three core components of ACI:

1. **Application Network Profile (ANP)**
   1. Collection of end-point groups (EPG), their connections and policies
2. **Application Policy Infrastructure Controller (APIC)**
   1. Considered as the brains of ACI
   2. Centralised software controller
3. **Cisco Nexus 9000 Series switches**
   1. Application-aware switching fabric which works with the APIC

![ACI](/assets/images/posts/aci.png)

**Spine-Leaf Topology**

* Leaf switches always attach to the spine but never other leaf switch
* Spine switches only attach to the leaf switches
* Everything is one hop from everything else
* APIC and all other devices attach the the leaf switches.

![Spine-leaf topology](/assets/images/posts/spine-leaf.png)

**SDN Types**

1. **Device-based SDN**
   1. Just an application layer.
   2. Devices are programmable by applications running on the device itself or a server.
2. **Controller-based SDN**
   1. Added a controller layer under the application layer.
   2. Centralised controller that has knowledge of all devices in the network.
   3. Applications can interface with the controller.
   4. *Example*: Cisco Open SDN Controller (*commercial distribution of OpenDayLight*)
3. **Policy-based SDN**
   1. Adds a policy layer between the controller and application.
   2. Built-in applications that automate configuration tasks via a guided workflow or GUI
   3. No programming skills are required.
   4. *Example*: Cisco APIC-EM

---
title:  "WAN Concepts"
date:   2020-11-22 12:00:00 +0000
categories: networking
---

* WANs provide networking services over large geographical areas
* WANs are used to interconnect remote users, networks, and sites.
* WANs are owned and managed by internet service, telephone, cable, and satellite providers.
* WAN services are provided for a fee.
* WANs providers offer low to high bandwidth speeds, over long distances using complex physical networks.

<br>

## Private vs Public WAN

A private WAN is a connection that is dedicated to a single customer. This provides for the following:

- Guaranteed service level
- Consistent bandwidth
- Security

A public WAN connection is typically provided by an ISP or telecommunications service provider using the internet. In this case,  the service levels and bandwidth may vary, and the shared connections do not guarantee security.

<br>

## WAN Topologies

WANs are implemented using the following logical topology designs:

- Point-to-Point Topology
- Hub-and-Spoke Topology
- Dual-homed Topology
- Fully Meshed Topology
- Partially Meshed Topology

![WAN Topologies](/assets/images/posts/wan_topologies.png)

**Note**: Large networks usually deploy a combination of these topologies.

<br>

## Carrier Connections

Single carrier is when the organisation connect to single service provider, whereas dual-carrier is having multiple service providers.

Dual-carrier provides redundancy and could be used to improve network performance or load balance traffic.

<br>

---

<br>

## WAN Standards

WAN standards are defined and managed by authorities including:

- **TIA/EIA** - Telecommunications Industry Association and Electronic Industries Alliance
- **ISO** - International Organisation for Standardisation
- **IEEE** - Institute of Electrical and Electronics Engineers

<br>

## OSI Model

WAN standards focus on the first two layers in the OSI model

1. Physical
   * describes the electrical, mechanical, and operational components needed to transmit bits over a WAN
2. Data Link
   * define how data will be encapsulated into a frame

<br>

## WAN Terminology

| **WAN Term**                            | **Description**                                              |
| --------------------------------------- | ------------------------------------------------------------ |
| **Data Terminal Equipment** **(DTE)**   | This is the device that connects the subscriber LANs to the WAN communication device (i.e., DCE). Inside hosts send their traffic to the DTE device usually a router. |
| **Data Communications Equipment (DCE)** | Also called data circuit-terminating equipment, this is the device used to communicate with the provider. |
| **Customer Premises Equipment (CPE)**   | This is the DTE and DCE devices (i.e., router, modem, optical converter) located on the enterprise edge. |
| **Point-of-Presence (POP)**             | This is the point where the subscriber connects to the service provider network. |
| **Demarcation Point**                   | This is a physical location in a building that officially separates the CPE from service provider equipment. It identifies where the network operation responsibility changes from the subscriber to the service provider. |
| **Local Loop (or last mile)**           | This is the actual copper or fiber cable that connects the CPE to the CO of the service provider. |
| **Central Office (CO)**                 | This is the local service provider facility or building that connects the CPE to the provider network. |
| **Toll network**                        | This includes backhaul, long-haul, all-digital, fiber-optic communications  lines, switches, routers, and other equipment inside the WAN provider  network. |
| **Backhaul network**                    | Backhaul networks connect multiple access nodes of the service provider network. Backhaul networks are also connected to internet service providers and to the backbone network. |
| **Backbone network**                    | These are large, high-capacity networks used to interconnect service provider networks and to create a redundant network. |

![WAN Terminology Diagram](/assets/images/posts/wan_terms.png)

<br>



## Circuit-Switched and Packet-Switched

A circuit-switched network establishes a dedicated circuit (or channel) between endpoints before the users can communicate. For example, when a user makes a telephone call using a landline.

The two most common types of circuit-switched WAN technologies are:

* Public switched telephone network (PSTN) 
* Legacy Integrated Services Digital Network (ISDN).

![Circuit Switched Example](/assets/images/posts/circuit_switched.png)

In contrast to circuit-switching, packet-switching segments traffic data into packets that are routed over a shared network.

Common types of packet-switched WAN technologies are 

* Ethernet WAN (Metro Ethernet), 
* Multiprotocol Label Switching (MPLS), 
* Legacy Frame Relay
* Legacy Asynchronous Transfer Mode (ATM).

![Packet Switched Example](/assets/images/posts/packet_switched.png)



<br>

## SDH / SONET and DWDM

Service provider networks use fiber-optic infrastructures to transport  user data between destinations. 

Fiber-optic cable is far superior to copper cable for long distance transmissions due to its much lower attenuation and interference.

Two optical fiber OSI layer 1 standards available to service providers:

1. **SDH** - Synchronous Digital Hierarchy
   * Global standard
2. **SONET** - Synchronous Optical Networking
   * North American standard

Both standards are essentially the same



**Dense Wavelength Division Multiplexing** (DWDM) is a newer technology that increases the data-carrying capacity of SDH  and SONET by simultaneously sending multiple streams of data  (multiplexing) using different wavelengths of light.

![Dense Wavelength Division Multiplexing](/assets/images/posts/dwdm.png)

DWDM has the following features:

* Supports for SONET and SDH standards
* Can multiplex more than 80 different channels onto a single fiber
* Each channel is capable of carrying a 10Gbps multiplexed signal
* Assigns incoming optical signals to specific wavelengths of light (frequencies)

**Note:** DWDM circuits are used in long-haul systems and modern submarine communication cable systems.

<br>

## Modern WANs

New technologies are continually emerging.

![Modern WAN options](/assets/images/posts/modern_wan.png)

**Dark Fiber**

Many fiber-optic cable runs are not in use. Fiber-optic cable that is  not in use, and therefore, “un-lit” (i.e. dark) is referred to as dark fiber.

Leasing dark fiber is typically more expensive than any other WAN option available today. However, it provides the greatest flexibility,  control, speed, and security.

<br>

**MPLS**

Multi-protocol Label Switching (MPLS) enables the WAN provider network  to carry any protocol (e.g., IPv4 packets, IPv6 packets, Ethernet, DSL)  as payload data. This enables different sites to connect to the provider network regardless of its access technologies.

MPLS routers are label switched routers (LSRs). This means that they  attach labels to packets that are then used by other MPLS routers to  forward traffic.

<br>

**DSL**

POTS (Plain Old Telephone System) the frequency used by voice.

![ADSL Data](/assets/images/posts/adsl_data.png)

DSL are categorised as either  Asymmetric DSL (ADSL) or Symmetric DSL (SDSL). ADSL provides higher downstream bandwidth over the upload bandwidth, SDSL provides the same capacity.

an ADSL loop must be less than 5.46 km (3.39 miles) for guaranteed signal quality.

DSL connections, connect to a DSLAM (DSL Access Multiplexer) located in the CO.

DSL is not a  shared medium. Each user has a separate direct connection to the DSLAM.

<br>

**Cable**

The Data over Cable Service Interface Specification (DOCSIS) is the  international standard for adding high-bandwidth data to an existing  cable system.

Cable operators deploy hybrid fiber-coaxial (HFC)  networks to enable high-speed transmission of data to cable modems. The  cable system uses a coaxial cable to carry radio frequency (RF) signals  to the end user.

HFC uses fiber-optic and coaxial cable in  different portions of the network. For example, the connection between  the cable modem and optical node is coaxial cable

The headend contains the databases needed to provide internet access  while the CMTS is responsible for communicating with the cable modems.

<br>

**Optical Fiber**

Providers install fiber-optic cable to the user location. This is  commonly referred to as Fiber to the x (FTTx) and includes the  following:

* Fiber to the Home (FTTH)
* Fiber to the Building (FTTB)
* Fiber to the Node/Neighbourhood (FTTN)

FTTx can deliver the highest bandwidth of all broadband options.

<br>

## VPN

The following are several benefits to using VPN:

* Cost savings
* Security
* Scalability
* Compatibility with broadband technology

VPNs are commonly implemented as the following:

* Site-to-Site VPN
* Remote Access




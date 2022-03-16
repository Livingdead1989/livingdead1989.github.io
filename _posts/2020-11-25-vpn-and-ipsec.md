---
title:  "VPN and IPsec"
date:   2020-11-25 15:00:00 +0000
categories: networking
---



## Virtual Private Networks (VPN)

To secure network traffic between sites and users, organisations use virtual private networks (VPNs)

| **Benefit**       | **Description**                                              |
| ----------------- | ------------------------------------------------------------ |
| **Cost Savings**  | VPNs reduce an organisations connectivity costs while simultaneously increasing remote connection bandwidth. |
| **Security**      | VPNs provide security by using advanced encryption and authentication protocols that protect data from unauthorised access. |
| **Scalability**   | VPNs allow organisations to use the internet, making it easy to add new users without adding significant infrastructure. |
| **Compatibility** | VPNs can be implemented across a wide variety of WAN link options. Remote workers can gain secure access to their corporate networks. |

VPNs can be managed and deployed as:

**Enterprise-Managed VPNs**

Site-to-Site VPNs

* IPsec VPN
* GREover IPsec
* Cisco Dynamic Multipoint Virtual Private Network (DMVPN)
* IPsec Virtual Tunnel Interface (VTI)

Remote Access VPNs

* Client-based IPsec VPN connection
* Clientless SSL/TLS connection

**Service Provider-Managed VPNs**

Layer 2 MPLS

* Service provider is not involved in customer routing. A Virtual Private LAN Service (VPLS) is used to emulate an Ethernet multiaccess LAN segment

Layer 3 MPLS

* Service provider participates in customer routing, establishing a peering between routers.

Legacy Solutions

* Frame Relay
* Asynchronous Transfer Mode (ATM)

## SSL/TLS vs IPsec

| Feature                     | IPsec                                                        | SSL                                                          |
| --------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **Applications supported**  | **Extensive** - All IP-based applications are supported.     | **Limited** - Only web-based applications and file sharing are supported. |
| **Authentication strength** | **Strong** - Uses two-way authentication with shared keys or digital certificates. | **Moderate** - Using one-way or two-way authentication.      |
| **Encryption strength**     | **Strong** - Uses key lengths from 56 bits to 256 bits.      | **Moderate to strong** - With key lengths from 40 bits to 256 bits. |
| **Connection complexity**   | **Medium** - Because it requires a VPN client pre-installed on a host. | **Low** - It only requires a web browser on a host.          |
| **Connection option**       | **Limited** - Only specific devices with specific configurations can connect. | **Extensive** - Any device with a web browser can connect.   |

## GRE

Generic Routing Encapsulation (GRE) is a non-secure site-to-site VPN tunnelling (**Carrier**) protocol.

A standard IPsec VPN (non-GRE) can only create secure tunnels for unicast traffic. GRE supports multicast and broadcast traffic.

We can encapsulate routing protocol traffic using a GRE packet, and then encapsulate the GRE packet into an IPsec packet to forward it securely  to the destination VPN gateway.

## Dynamic Multipoint VPN (DMVPN)

Site-to-site IPsec VPNs and GRE over IPsec are adequate to use when  there are only a few sites, they are not sufficient when the enterprise adds many more sites because each site would require static configurations to all other sites.

Dynamic Multipoint VPN (DMVPN) is a Cisco software solution for building multiple VPNs in an easy, dynamic, and scalable manner.

DMVPN relies on IPsec

It uses a hub-and-spoke configuration to establish a full mesh topology.

Each site is configured using Multipoint Generic Routing Encapsulation (mGRE)**.** The mGRE tunnel interface allows a single GRE interface to dynamically support multiple IPsec tunnels.

![DMVPN Hub and Spoke Tunnels](/assets/images/posts/dmvpn_hub_spoke.png)

## IPsec Virtual Tunnel Interface (VTI)

Like DMVPNs, IPsec Virtual Tunnel Interface (VTI) simplifies the configuration process

IPsec VTI configurations are applied to a virtual interface instead of static mapping

VTI is capable of sending and receiving both IP unicast and multicast encrypted traffic.

---

## IPsec Concepts

IPsec is an IETF standard that defines how a VPN can be secured across IP networks.

IPsec can protect traffic from Layer 4 through Layer 7 of the OSI model.

IPsec provides these essential security functions:

* **Confidentiality** - encryption algorithms to prevent reading the packet contents.
* **Integrity** - hashing algorithms to ensure that packets have not been altered. (*MD5, SHA, HMAC*)
* **Origin authentication** - Internet Key Exchange (IKE) protocol to authenticate source and destination pre-shared keys (passwords), digital certificates, or RSA certificates.
* **Diffie-Hellman** - Secure key exchange typically using various groups of the DH algorithm.

![IPsec Framework](/assets/images/posts/ipsec_framework.png)

Terms

* **AH** - Authentication Header
* **ESP** - Encapsulating Security Payload
* **SA** - Security Associations
* **IKE** - Internet Key Exchange

A Security Association (SA) is the basic building block of IPsec.

the peers must share the same SA to negotiate key exchange parameters,  establish a shared key, authenticate each other, and negotiate the  encryption parameters.

![IPsec SA Example](/assets/images/posts/ipsec_sa_example.png)

AH **does not** offer confidentiality as all text is transported encrypted.

DH groups 1, 2, and 5 should no longer be used.

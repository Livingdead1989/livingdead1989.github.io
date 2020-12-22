---
title:  "Quality of Service - QoS"
date:   2020-11-26 15:00:00 +0000
categories: networking
---

## Network Transmission Quality

Quality of Service (QoS) allows devices such as Routers and Switches to prioritise traffic over others when congestion occurs.

**Where is QoS required?** 

* Aggregation (multi lines into one), 
* Speed Mismatch (Fast-Slow), 
* LAN to WAN (Fast-Slow).

![Example of Congestion Points](/assets/images/posts/congestion_points.png)

**Source of Delay**

| **Delay**               | **Description**                                              |
| ----------------------- | ------------------------------------------------------------ |
| **Code delay**          | The fixed amount of time it takes to compress data at the source before  transmitting to the first internetworking device, usually a switch. |
| **Packetization delay** | The fixed time it takes to encapsulate a packet with all the necessary header information. |
| **Queuing delay**       | The variable amount of time a frame or packet waits to be transmitted on the link. |
| **Serialization delay** | The fixed amount of time it takes to transmit a frame onto the wire. |
| **Propagation delay**   | The variable amount of time it takes for the frame to travel between the source and destination. |
| **De-jitter delay**     | The fixed amount of time it takes to buffer a flow of packets and then send them out in evenly spaced intervals. |

**Jitter** is the variation in the delay of received packets.

To compensate for the effects of jitter, a mechanism called a  playout delay buffer is used. The playout delay buffer receives and  buffers voice packets and then retransmits them in a steady stream with  the jitter removed.

![Playout Delay Buffer](/assets/images/posts/qos_playout.png)

<br>

## Traffic Characteristics

**Voice vs Video**

**Voice**

* Smooth
* Benign
* Drop sensitive
* Delay sensitive
* UDP Priority

<u>One-Way Requirement</u>

* Latency < 150ms
* Jitter < 30ms
* Loss < 1%
* Bandwidth (30-128Kbps)

**Video**

* Bursty
* Greedy
* Drop sensitive
* Delay sensitive
* UDP Priority

<u>One-Way Requirement</u>

* Latency < 200-400ms
* Jitter < 30-50ms
* Loss < 0.1-1%
* Bandwidth (384Kbps  - 20Mbps+)

**Data traffic** can consume a large portion of network capacity due to some TCP applications but is insensitive to jitter and packet loss.

<br>

## Queuing Algorithms

First In, First Out (**FIFO**) - No QoS

![FIFO](/assets/images/posts/fifo.png)

Weighted Fair Queuing (**WFQ**) - Automatic classification (no configuration) 

![WFQ](/assets/images/posts/wfq.png)

Class Based Weighted Fair Queuing (**CBWFQ**) - User-defined classes

![CBWFQ](/assets/images/posts/cbwfq.png)

Low Latency Queuing (**LLQ**) - Strict Priority Queue

![LLQ](/assets/images/posts/llq.png)

<br>

## QoS Models

**Best-effort Model**

* Not a real implementation of QoS
* All network packets are treated in the same way
* No guaranteed delivery

**Integrated Services (IntServ)**

* Very high QoS to IP Packets with Guaranteed delivery
* End-to-End Signal throughout the network required
* Resources are reserved
* Can severely limit the scalability of a network

**Differentiated Services (DiffServ)**

* Most scalable and highly flexible
* No absolute guarantee of service quality
* Network devices recognise traffic classes and provide different QoS levels

**Note**: Modern networks primarily use the DiffServ model. However, due to the increasing volumes of delay- and jitter-sensitive traffic, IntServ and RSVP are sometimes co-deployed.

<br>

## QoS Implementation Techniques

Packet loss is usually the result of congestion on an interface.

The following approaches can prevent drops in sensitive applications:

- Increase link capacity
- Guarantee enough bandwidth and increase buffer space
  - WFQ, CBWFQ, and LLQ can guarantee bandwidth and provide prioritised forwarding to drop-sensitive applications.
- Drop lower-priority packets before congestion occurs. 
  - Cisco QoS provides weighted random early detection (WRED),  that start dropping lower-priority packets before congestion occurs.



There are **three categories of QoS tools**

- Classification and marking tools
- Congestion avoidance tools
- Congestion management tools

![QoS Tools](/assets/images/posts/qos_tools.png)

**Methods of classifying**

* classifying traffic flows at Layer 2 and 3 include using interfaces, ACLs, and class maps.
* classified at Layers 4 to 7 using Network Based Application Recognition (NBAR)



### Traffic Marking for QoS

| **QoS Tools**             | **Layer** | **Marking Field**                         | **Width in Bits** |
| ------------------------- | --------- | ----------------------------------------- | ----------------- |
| Ethernet (802.1Q, 802.1p) | 2         | Class of Service (CoS)                    | 3                 |
| 802.11 (Wi-Fi)            | 2         | Wi-Fi Traffic Identifier (TID)            | 3                 |
| MPLS                      | 2         | Experimental (EXP)                        | 3                 |
| IPv4 and IPv6             | 3         | IP Precedence (IPP)                       | 3                 |
| IPv4 and IPv6             | 3         | Differentiated Services Code Point (DSCP) | 6                 |

Differentiated Services Code Point (DSCP) supersedes IP Precedence (IPP).



Marking should be done as close to the source device as possible. This establishes the **trust boundary.**

![Trust Boundaries](/assets/images/posts/qos_trust_boundaries.png)


**Congestion Avoidance**

Cisco IOS includes Weighted Random Early Detection (WRED) as a possible congestion avoidance solution.

WRED provides buffer management for TCP before buffers are exhausted and tail drops occur.

There is no congestion avoidance for UDP based traffic such as voice, methods such as queuing and compression help to reduce, even prevent UDP packet loss.

![Congestion Avoidance](/assets/images/posts/qos_congestion_avoidance.png)


**Shaping vs Policing**

Shaping is an outbound concept in contrast, policing is applied to inbound traffic on an interface.

Shaping implies the existence of a queue and of sufficient memory to buffer delayed packets, while policing does not.

Shaping requires a scheduling function for later transmission. Scheduling function allows you to organize the shaping queue into different queues. Examples of scheduling functions are CBWFQ and LLQ.

![Policing Traffic](/assets/images/posts/qos_policing.png)

Shape and police traffic flows as close to their sources as possible.

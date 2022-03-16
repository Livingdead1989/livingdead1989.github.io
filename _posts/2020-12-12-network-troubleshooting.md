---
title:  "Network Troubleshooting"
date:   2020-12-12 12:00:00 +0000
categories: networking
---

## Network Documentation

Common network documentation includes:

* Physical and Logical topology diagrams
* Network device documentation that records all pertinent device information *(Device, Model, Version)*
* Network performance baseline
* End-system documentation, the hardware and software used in servers, network management consoles and user workstations. *(Useful in troubleshooting)*

**Physical Topology**

The physical layout of the devices connected to the network.

* Device Name
* Device Location *(Address, Room number, Rack location)*
* Interface and ports used
* Cable type

**Logical Topology**

The logically connected devices in the network, how devices transfer data. You may wish to split the logical topology into IPv4 and IPv6.

* Device identifiers
* IP addresses, netmasks and prefix lengths
* Interface identifiers
* Routing protocol and static routes
* Layer 2 information (VLAN, Trunks, EtherChannel)

**Network Baseline**

A baseline is the normal network or system performance, often referred to as its personality it allows use to compare against a normal network or system condition.

*A network baseline should answer the following questions:*

* *How does the network perform during a normal or average day?*
* *Where are the most errors occurring?*
* *What part of the network is most heavily used?*
* *What part of the network is least used?*
* *Which devices should be monitored and what alert thresholds should be set?*
* *Can the network meet the identified policies?*

The baseline provides insight into whether the network meets business requirements.

Without a baseline, no standard exists to measure the optimum nature of network traffic and congestion levels.

**Steps in creating a Baseline**

1. Determine what types of data to collect
   1. To many data points can be overwhelming
   2. Start simple such as Interface and CPU utilisation
2. Identify devices and ports of interest
   1. Network device ports that connect to other networking devices
   2. Servers
   3. Key users
   4. Any other critical areas to operations
3. Determine the Baseline duration
   1. Long enough to capture a "normal" picture, including daily trends
   2. Not performed during unique traffic times
   3. Minimum of 7 days, typically no longer than 6 weeks
   4. A 2-4 week Baseline is normally adequate

Manual data collection using `show` commands is time consuming and not scalable. Network Management system (NMS) enable administrators to automatically create and review reports, compare performance and create alerts.

## Troubleshooting Process

**Seven-Step Process**

1. Define the Problem
   1. Verify there is a problem, then properly define what the problem is.
2. Gather Information
   1. Identify and secure access to targets involved, gather further information
   2. If the problem is outside of the organisations control, contact administrators from the external system before gathering additional information.
3. Analyse Information *(Identify possible causes)*
4. Eliminate Possible Causes
5. Propose Hypothesis
6. Test Hypothesis
   1. Before testing assess the impact and urgency
   2. Document all attempted solutions
7. Solve the Problem
   1. Inform relevant people
   2. Document the cause and fix

**Structured Troubleshooting Methods**

Structured methods use the OSI model layers

* Bottom-Up
  * Start at the Physical layer (0).
* Top-Down
  * Start at the Application layer (7).
* Divide-and-Conquer
  * Select a layer and test in both directions.
  * Start by collecting user experiences then make an informed guess.
* Follow-the-Path
  * Follow the traffic path.
* Substitution - "Swap-the-component"
  * Swap problematic device with a known working one.
* Comparison - "Spot-the-difference"
  * Compare against working devices.
* Educated Guess
  * Relies on knowledge and experience.

![Guidelines for selecting a troubleshooting method](/assets/images/posts/troubleshooting_select.png)

## Troubleshooting Tools

* **Network Management System (NMS) Tools**

  * [Cacti](https://www.cacti.net/)
  * [Nagios Core](https://www.nagios.com/products/nagios-core/)
  * [Icinga](https://icinga.com/)
  * [Zabbix](https://www.zabbix.com/)
  * [LibreNMS](https://www.librenms.org/)

* **Knowledge Bases**

* **Baselining Tools**

  * [Wireshark](https://www.wireshark.org/)
  * [Nmap](https://nmap.org/)
  * [Ntop](https://www.ntop.org/)
  * Traceroute
  * Netflow analyzers

* **Hardware Troubleshooting Tools**

  * Digital Multi-meter
  * Cable Tester
    * used to detect:
      * broken wires
      * crossed-over wiring
      * shorted connections
      * improperly paired connections
  * Cable Analyser
    * advanced cable tester:
      * near-end crosstalk (NEXT)
      * return loss (RL)
  * Portable Network Analyser
    * devices used for troubleshooting switched networks and VLANs
  * Cisco Prime NAM

* **Syslog server**

  * important part of network security and network troubleshooting
  * can log information regarding:
    * ACL violations
    * Interface status
    * many more...

  | **Level** | **Keyword**   | **Description**                    | **Definition** |
  | --------- | ------------- | ---------------------------------- | -------------- |
  | 0         | Emergencies   | System is unusable                 | LOG_EMERG      |
  | 1         | Alerts        | Immediate action is needed         | LOG_ALERT      |
  | 2         | Critical      | Critical conditions exist          | LOG_CRIT       |
  | 3         | Errors        | Error conditions exist             | LOG_ERR        |
  | 4         | Warnings      | Warning conditions exist           | LOG_WARNING    |
  | 5         | Notifications | Normal (but significant) condition | LOG_NOTICE     |
  | 6         | Informational | Informational messages only        | LOG_NFO        |
  | 7         | Debugging     | Debugging messages                 | LOG_DEBUG      |

Enable Syslog logging to server including messages from Emergencies (0) - Notification (5)

```
R1(config)# logging host 209.165.200.225 
R1(config)# logging trap notifications 
R1(config)# logging on
R1(config)#
```

## Network Problems

**Layer 1 - Physical**

* Power related
* Hardware faults
* Cabling faults
* Attenuation
* Noise
* Interface configuration errors
* Exceeding design limits
* CPU overload

**Layer 2 - Data Link**

* Encapsulation errors
* Address mapping errors
* Framing errors
* STP failure or loops

**Layer 3 - Network**

* Routing table
* Neighbour issues
* Topology database

**Layer 4 - Transport**

* ACL
  * Order of ACE
  * Implicit Deny any
  * Incorrect Wildcard masks
  * Use of the Established keyword
* NAT
  * IPv4 Helper feature can help solve:
    * DHCP and BOOTP
    * DNS
    * SNMP
  * Tunneling and Encryption protocols

**Layers 5-7 (Application TCP/IP model)**

* Protocols included:
  * SSH/Telnet
  * HTTP
  * FTP and TFTP
  * SMTP and POP
  * SNMP
  * DNS
  * NFS

You can use the Telnet command to test other network protocols.

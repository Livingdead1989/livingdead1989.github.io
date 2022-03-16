---
title:  "Network Security Concepts"
date:   2020-11-2 14:03:00 +0000
categories: cybersecurity
---



## Terminology

1. An **asset** is anything of value to the organisation. It includes people, equipment, resources, and data.
2. A **vulnerability** is a weakness in a system, or its design, that could be exploited by a threat.
3. A **threat** is a potential danger to a company’s assets, data, or network functionality.
4. An **exploit** is a mechanism that takes advantage of a vulnerability.
5. **Mitigation** is the counter-measure for a potential threat or risk.
6. **Risk** is the likelihood of a threat to exploit the vulnerability of an asset, with the aim of negatively affecting an organisation.

## Penetration Testing Tools

* **Password Crackers**
  * Examples of password cracking tools include John the Ripper, Ophcrack, L0phtCrack, THC Hydra, RainbowCrack, and Medusa.
* **Wireless Hacking Tools**
  * Examples of wireless hacking tools include Aircrack-ng, Kismet, InSSIDer, KisMAC, Firesheep, and NetStumbler.
* **Network Scanning and Hacking Tools**
  * Examples of scanning tools include Nmap, SuperScan, Angry IP Scanner, and NetScanTools.
* **Packet Crafting Tools**
  * Examples include Hping, Scapy, Socat, Yersinia, Netcat, Nping, and Nemesis.
* **Packet Sniffers**
  * Tools include Wireshark, Tcpdump, Ettercap, Dsniff, EtherApe, Paros, Fiddler, Ratproxy, and SSLstrip.
* **Rootkit Detectors**
  * Example tools include AIDE, Netfilter, and PF: OpenBSD Packet Filter.
* **Fuzzers to Search Vulnerabilities**
  * Examples of fuzzers include Skipfish, Wapiti, and W3af.
* **Forensic Tools**
  * Example of tools include Sleuth Kit, Helix, Maltego, and Encase.
* **Debuggers**
  * Debugging tools include GDB, WinDbg, IDA Pro, and Immunity Debugger.
* **Hacking Operating Systems**
  * Examples of specially designed hacking operating systems include Kali Linux, Knoppix, BackBox Linux.
* **Encryption Tools**
  * Examples of these tools include VeraCrypt, CipherShed, OpenSSH, OpenSSL, Tor, OpenVPN, and Stunnel.
* **Vulnerability Exploitation Tools**
  * Examples of vulnerability exploitation tools include Metasploit, Core Impact, Sqlmap, Social Engineer Toolkit, and Netsparker.
* **Vulnerability Scanners**
  * Examples of tools include Nipper, Secunia PSI, Core Impact, Nessus v6, SAINT, and Open VAS.

## Attack Types

| Attack Type                | Description                                                  |
| -------------------------- | ------------------------------------------------------------ |
| Eavesdropping Attack       | This is when a threat actor captures and “listens” to network traffic. This attack is also referred to as sniffing or snooping. |
| Data Modification Attack   | If threat actors have captured enterprise traffic, they can alter the data in the packet without the knowledge of the sender or receiver. |
| IP Address Spoofing Attack | A threat actor constructs an IP packet that appears to originate from a valid address inside the corporate intranet. |
| Password-Based Attacks     | If threat actors discover a valid user account, the threat actors have the same rights as the real user. Threat actors could use that valid  account to obtain lists of other users, network information, change  server and network configurations, and modify, reroute, or delete data. |
| Denial of Service Attack   | A DoS attack prevents normal use of a computer or network by valid users. A DoS attack can flood a computer or the entire network with traffic  until a shutdown occurs because of the overload. A DoS attack can also  block traffic, which results in a loss of access to network resources by authorized users. |
| Man-in-the-Middle Attack   | This attack occurs when threat actors have positioned themselves between a  source and destination. They can now actively monitor, capture, and  control the communication transparently. |
| Compromised-Key Attack     | If a threat actor obtains a secret key, that key is referred to as a  compromised key. A compromised key can be used to gain access to a  secured communication without the sender or receiver being aware of the  attack. |
| Sniffer Attack             | A sniffer is an  application or device that can read, monitor, and capture network data  exchanges and read network packets. If the packets are not encrypted, a  sniffer provides a full view of the data inside the packet. |

## Types of Malware

1. A **worm** executes arbitrary code and installs copies of itself in the memory of  the infected computer. The main purpose of this malware is to  automatically replicate from system to system across the network.
2. A **Trojan horse** is non-self-replicating type of malware. It often contains malicious  code that is designed to look like something else, such as a legitimate  application or file. It attacks the device from within.
3. **Spyware** is similar to adware but is used to gather information about the user  and then send it to threat actors without the user’s consent. Spyware  can be a low threat, gathering browsing data, or it can be a high threat capturing personal and financial information.
4. **Adware** is usually distributed by downloading online software. It can display  unsolicited advertising using pop-up web browser windows, new toolbars,  or unexpectedly redirect a web page to a different website.
5. **Phishing** attacks attempt to convince people to divulge sensitive information.
6. **Rootkits** are used by threat actors to gain administrator account-level access to a computer. They are very difficult to detect because they can alter  firewall, antivirus protection, system files, and even OS commands to  conceal their presence.
7. **Ransomware** typically  denies a user access to their files by encrypting the files and then  displaying a message demanding a ransom for the decryption key.

## Common Network Attacks

1. Tailgating is a **social engineering** attack where a threat actor quickly follows an authorized person into a secure location to gain access to a secure area.
2. Password attacks are a form of **access attack** in which the threat actor attempts to discover critical system  passwords using various methods. Password attacks are very common and  can be launched using a variety of password cracking tools.
3. Port scanning is a **reconnaissance attack** in which a threat actor uses a tool like Nmap to scan for open ports on discovered active IP addresses.
4. Man-in-the-Middle is an **access attack** in which the threat actor is positioned in between two legitimate  entities in order to read or modify the data that passes between the two parties.
5. Spoofing is an **access attack** in which the threat actor device attempts to pose as another device by  falsifying data. Common spoofing attacks include IP spoofing, MAC  spoofing, and DHCP spoofing.

## IP Vulnerabilities and Threats

1. An **MiTM attack** is when threat actors position themselves between a source and  destination to transparently monitor, capture, and control the  communication.
2. A **session hijacking attack** is  when threat actors gain access to the physical network, and then use an  MiTM attack to capture and manipulate traffic, hijacking a legitimate  user’s session.
3. In an **amplification attack**, the threat actor forwards ICMP echo request messages to many hosts. These  messages contain the source IP address of the victim. All of these hosts then reply to the spoofed IP address of the victim to overwhelm it,  creating a **reflection attack**.
4. In **ICMP attacks**, threat actors use pings to discover subnets and hosts on a protected  network, to generate flood attacks, and to alter host routing tables,
5. An example of an **address spoofing attack** is when a threat actor creates packets with false source IP address  information to either hide the identity of the sender, or to pose as  another legitimate user. The threat actor can then gain access to  otherwise inaccessible data or circumvent security configurations.

## TCP and UDP Vulnerabilties

1. The **TCP SYN flood attack** exploits the TCP three-way handshake.
2. A **TCP reset attack** can be used to terminate TCP communications between two hosts using a pair of FIN and ACK segments from each endpoint.
3. **TCP session hijacking** is where the threat actor spoofs the IP address of one host, predicts  the next sequence number, and sends an ACK to the other host. If  successful, the threat actor could send data to, but not receive data  from, the target device.
4. A **UDP flood attack**  sends a flood of UDP packets to the target’s closed ports causing the  target to reply with ICMP port unreachable messages. Because there are  many closed ports on the server, this creates a lot of traffic on the  segment, which uses up most of the bandwidth. The result is very similar to a DoS attack.

## Network Security Best Practices

1. A **firewall**, such as Cisco’s ASA firewall, ensures that internal traffic can go out  and come back, but external traffic cannot initiate connections to  inside hosts.
2. A **AAA server** contains a secure database of who is authorized to access and manage network devices.
3. An **ESA** and a **WSA** filter known and suspicious internet malware sites.
4. A **VPN** security device provides secure services with corporate sites and  remote access support for remote users using secure encrypted tunnels.
5. An **IPS** monitors incoming and outgoing traffic looking for malware, network  attack signatures, and more. If it recognizes a threat, it can  immediately stop it.

## Crypotography

1. **Triple DES** or 3DES repeats an algorithm process three times and is considered very trustworthy when implemented using very short key lifetimes.
2. A **stream cipher** encrypts one byte or one bit at time.
3. **Symmetric** encryption methods use the same key to encrypt and decrypt data.
4. The **Rivest cipher** is a stream cipher that is used to secure web traffic in SSL and TLS.

---
title:  "Access Control Lists"
date:   2020-11-4 15:05:00 +0000
categories: networking
---

An ACL uses a sequential list of permit or deny statements, known as access control entries (ACEs).

## Task of an ACL

* Limit network traffic to increase network performance
* Provide traffic flow control
* Provide a basic level of security for network access
* Filter traffic based on traffic type
* Screen hosts to permit or deny access to network services
* Provide priority to certain classes of network traffic



## Types of ACL

Routers support two types of ACLs:

- **Standard ACLs** - ACLs only filter at Layer 3 using the source IPv4 address only.
- **Extended ACLs** - ACLs filter at Layer 3 using the source and / or destination IPv4  address. They can also filter at Layer 4 using TCP, UDP ports, and  optional protocol type information for finer control.



![in-outbound](/assets/images/posts/in-outbound.png)

There can be a maximum of 1 inbound and 1 outbound ACL for IPv4 and another 1 of each for IPv6, totalling 4 per interface.

There is also an implicit deny statement at the end of an ACL which you do not see. Its recommended to manually configure a deny all statement at the end of your ACL for debug/troubleshooting reasons as otherwise logs will not list as expected.

A best practice for configuring an extended ACL is to ensure that the most specific ACE is placed higher in the ACL.



## Wildcard Mask

Wildcard masks use the following rules to match binary 1s and 0s:

- **Wildcard mask bit 0** - Match the corresponding bit value in the address
- **Wildcard mask bit 1** - Ignore the corresponding bit value in the address



| **Wildcard Mask** | **Last Octet (in Binary)** | **Meaning (0 - match, 1 - ignore)**                          |
| ----------------- | -------------------------- | ------------------------------------------------------------ |
| 0.0.0.0     | 00000000             | Match all octets.                                            |
| 0.0.0.63    | 00111111             | Match the first three octetsMatch the two left most bits of the last octetIgnore the last 6 bits |
| 0.0.0.15    | 00001111             | Match the first three octetsMatch the four left most bits of the last octetIgnore the last 4 bits of the last octet |
| 0.0.0.252   | 11111100             | Match the first three octetsIgnore the six left most bits of the last octetMatch the last two bits |
| 0.0.0.255   | 11111111             | Match the first three octetIgnore the last octet             |



To calculate the wildcard mask, subtract the subnet mask (i.e., 255.255.255.0) from 255.255.255.255, as shown in the table.

|                             |                      |
| --------------------------- | -------------------- |
| Starting value              |   255.255.255.255  |
| Subtract the subnet mask    | - 255.255.255.  0  |
| Resulting wildcard mask |   0.  0.  0.255 |



## Numbered and Named ACL

* ACLs number 1 to 99, or 1300 to 1999 are standard ACLs 
* ACLs number 100 to 199, or 2000 to 2699 are extended ACLs

```
R1(config)# access-list ?
```

Named ACLs is the preferred method to use when configuring ACLs. 



## Where to place an ACL

Extended ACLs should be located as close as possible to the source of the traffic to be filtered.

Standard ACLs should be located  as close to the destination as possible.



---



## Configure Standard IPv4 ACL

When configuring a complex ACL, it is suggested that you:

- Use a text editor and write out the specifics of the policy to be implemented.
- Add the IOS configuration commands to accomplish those tasks.
- Include remarks to document the ACL.
- Copy and paste the commands onto the device.
- Always thoroughly test an ACL to ensure that it correctly applies the desired policy.

These recommendations enable you to create the ACL thoughtfully without impacting the traffic on the network.



**Create a Numbered Standard ACL**

```
Router(config)# access-list access-list-number {deny | permit | remark text} source [source-wildcard] [log]
```

example:

```
R2(config)# access-list 1 deny 192.168.11.0 0.0.0.255 
R2(config)# access-list 1 permit any 

R2# show access-lists
Standard IP access list 1
    10 deny 192.168.11.0 0.0.0.255
    20 permit any
```



**Create a Named Standard ACL**

```
Router(config)# ip access-list standard access-list-name
```



**Apply a Standard ACL**

```
Router(config-if) # ip access-group {access-list-number | access-list-name} {in | out}
```

example:

```
R2(config)# int g0/0
R2(config-if)# ip access-group 1 out
```





## Modify

Two ways to modify an ACL

1. use a text editor
2. use sequence numbers



Option one is to copy everything into a text editor, make the required changes, remove the old configuration and apply the new configuration line by line.



Option two  uses the automatically assigned sequence numbers of an ACE *(Access Control Entity)*

```
R1# show access-lists Standard IP access list 1 
    10 deny 19.168.10.10 
    20 permit 192.168.10.0, wildcard bits 0.0.0.255
```

We can modify entry 10 by using the command, the below example shows a numbered list, but this works for named lists as well

```
R1# conf t
R1(config)# ip access-list standard 1
R1(config-std-nacl)# no 10
R1(config-std-nacl)# 10 deny host 192.168.10.10
```

```
R1# configure terminal
R1(config)# ip access-list standard NO-ACCESS
```



## Secure VTY 

Using an ACL and username to secure the Virtual Teletype (VTY) connections

```
R1(config)# username ADMIN secret class

R1(config)# ip access-list standard ADMIN-HOST
R1(config-std-nacl)# remark This ACL secures incoming vty lines
R1(config-std-nacl)# permit 192.168.10.10
R1(config-std-nacl)# deny any
R1(config-std-nacl)# exit

R1(config)# line vty 0 4
R1(config-line)# login local
R1(config-line)# transport input ssh
R1(config-line)# access-class ADMIN-HOST in
R1(config-line)# end

```





## Extended ACL

The main difference between standard and extended is the ability to configure protocol and port.

```
Router(config)# access-list access-list-number {deny | permit | remark text} protocol source source-wildcard [operator {port}] destination destination-wildcard [operator {port}] [established] [log]
```



| **Parameter**          | **Description**                                              |
| ---------------------- | ------------------------------------------------------------ |
| *access-list-number*   | Extended ACL number range is 100 to 199 and 2000 to 2699.    |
| **deny**               |                                                              |
| **permit**             |                                                              |
| **remark** *text*      |                                                              |
| *protocol*             | Name or number of an internet protocol. Common keywords include **ip**, **tcp**, **udp**, and **icmp**. The **ip** keyword matches all IP protocols. |
| *source*               | This identifies the source network or host address to filter. |
| *source-wildcard*      | (Optional) A 32-bit wildcard mask that is applied to the source. |
| *destination*          | This identifies the destination network or host address to filter. |
| *destination-wildcard* | (Optional) This is a 32-bit wildcard mask that is applied to the destination. |
| *operator*             | (Optional) This compares source or destination ports. Some operators include **lt** (less than), **gt** (greater than), **eq** (equal), and **neq** (not equal). |
| *port*                 | (Optional) The decimal number or name of a TCP or UDP port.  |
| **established**        | (Optional) For the TCP protocol only. This is a 1st generation firewall feature. |
| **log**                | (Optional) This keyword generates and sends an informational message whenever the ACE is matched. Only implement for troubleshooting or security reasons. |



The **established** keyword can be used to permit only the return HTTP traffic from requested websites, while denying all other traffic.

```
R1(config)# ip access-list extended SURFING
R1(config-ext-nacl)# Remark Permits inside HTTP and HTTPS traffic 
R1(config-ext-nacl)# permit tcp 192.168.10.0 0.0.0.255 any eq 80
R1(config-ext-nacl)# permit tcp 192.168.10.0 0.0.0.255 any eq 443
R1(config-ext-nacl)# exit

R1(config)# ip access-list extended BROWSING
R1(config-ext-nacl)# Remark Only permit returning HTTP and HTTPS traffic 
R1(config-ext-nacl)# permit tcp any 192.168.10.0 0.0.0.255 established
R1(config-ext-nacl)# exit

R1(config)# interface g0/0/0
R1(config-if)# ip access-group SURFING in
R1(config-if)# ip access-group BROWSING out
R1(config-if)# end

R1# show access-lists
Extended IP access list SURFING
    10 permit tcp 192.168.10.0 0.0.0.255 any eq www
    20 permit tcp 192.168.10.0 0.0.0.255 any eq 443 (124 matches) 
Extended IP access list BROWSING
    10 permit tcp any 192.168.10.0 0.0.0.255 established (369 matches) 
```

The **SURFING** ACL permits HTTP and HTTPS traffic from inside users to exit the G0/0/1 interface connected to the internet. Web traffic returning  from the internet is permitted back into the inside private network by  the **BROWSING** ACL.

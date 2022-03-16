---
title:  "Network Address Translation (NAT)"
date:   2020-11-18 15:05:00 +0000
categories: networking
---

## NAT Concepts

NAT primary use is to conserve public IPv4  addresses by using private IPv4 addresses internally and providing translation to a public address only when needed.

![Concept of NAT](/assets/images/posts/nat_concept.png)

NAT terminology is always applied from the perspective of  the device with the translated address:

- **Inside address** - The address of the device which is being translated by NAT.
- **Outside address** - The address of the destination device.

NAT also uses the concept of local or global with respect to addresses:

- **Local address** - A local address is any address that appears on the inside portion of the network.
- **Global address** - A global address is any address that appears on the outside portion of the network.

## Static

Static NAT uses a one-to-one mapping of local and global addresses.  These mappings are configured by the network administrator and remain  constant.

Static NAT requires that **enough public addresses** are available to satisfy the total number of simultaneous user sessions.

## Dynamic

Dynamic NAT uses a pool of public addresses and assigns them on a first-come, first-served basis.

Dynamic NAT requires that **enough public addresses** are available to satisfy the total number of simultaneous user sessions.

## PAT

Port Address Translation (PAT), also known as NAT overload.

PAT maps multiple private IPv4 addresses to a single public IPv4 address or a few addresses.

![Concept of PAT](/assets/images/posts/pat_concept.png)

PAT attempts to preserve the original source port. However, if the  original source port is already used, PAT assigns the first available  port number starting from the beginning of the appropriate port group  0-511, 512-1,023, or 1,024-65,535.

When there are no more ports available and there is more than one  external address in the address pool, PAT moves to the next address to  try to allocate the original source port.

---

## Advantage and Disadvantages

NAT provides many benefits, including the following:

- NAT conserves the legally registered addressing scheme by allowing the privatisation of intranets.
- NAT conserves addresses through application port-level multiplexing with NAT overload (PAT).
- NAT increases the flexibility of  connections to the public network. Multiple pools, backup pools, and load-balancing pools can be implemented to ensure reliable public network connections.
- Changing the public IPv4 address scheme requires the  readdressing of all hosts on the existing network. NAT allows the existing private  IPv4 address scheme to remain while allowing for easy change to a new  public addressing scheme.
- NAT hides the IPv4 addresses of users and other devices this does not provide security though.

NAT does have drawbacks.

- The fact that hosts on the internet appear to  communicate directly with the NAT-enabled device, rather than with the  actual host inside the private network, creates a number of issues.
- Network performance,  particularly for real time protocols such as VoIP.
- Many ISPs are having to assign customers a private IPv4 address instead of a public IPv4 address. Two layers of NAT translation is known as Carrier Grade NAT (CGN).
- End-to-end  addressing is lost. This is known as the end-to-end principle.
- End-to-end IPv4 traceability is  also lost making troubleshooting challenging.
- Complicates the use of tunnelling protocols, such as IPsec, because NAT modifies values in the  headers, causing integrity checks to fail.
- Services that require the initiation of TCP connections from the outside network, or stateless protocols, such as those using UDP, can be disrupted.

---

## Configure Static NAT

Create a mapping between the inside local address and the inside global addresses.

```text
R2(config)# ip nat inside source static 192.168.10.254 209.165.201.5
```

Configure the interfaces with an inside and outside

```text
R2(config)# interface serial 0/1/0
R2(config-if)# ip address 192.168.1.2 255.255.255.252
R2(config-if)# ip nat inside

R2(config)# interface serial 0/1/1
R2(config-if)# ip address 209.165.200.1 255.255.255.252
R2(config-if)# ip nat outside
```

## Verify NAT is working

To show active sessions

```text
R2# show ip nat translations
```

Best to clear statistics from any past translations using `clear ip nat statistics` then you can view counters to ensure NAT is working.

```text
R2# show ip nat statistics
```

## Configure Dynamic NAT

Define the pool of addresses

```text
R2(config)# ip nat pool NAT-POOL1 209.165.200.226 209.165.200.240 netmask 255.255.255.224
```

Configure a standard ACL to identify addresses that are to be translated

```text
R2(config)# access-list 1 permit 192.168.0.0 0.0.255.255
```

Bind the ACL to the pool

```text
R2(config)# ip nat inside source list 1 pool NAT-POOL1
```

Set the inside and outside interfaces

```text
R2(config)# interface serial 0/1/0
R2(config-if)# ip nat inside

R2(config)# interface serial 0/1/1
R2(config-if)# ip nat outside
```

## Verify Dynamic NAT is working

To show active sessions

```text
R2# show ip nat translations
```

adding a verbose with show more details about that translation

```text
R2# show ip nat translations verbose
```

Clearing translations

| **Command**                                                  | **Description**                                              |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| clear ip nat translation                                     | Clears all dynamic address translation entries from the NAT translation table. |
| clear ip nat translation insideglobal-ip local-ip [outside local-ip global-ip] | Clears a simple dynamic translation entry containing an inside translation or both inside and outside translation. |
| clear ip nat translation protocolinsideglobal-ip global-port local-ip local-port [ outsidelocal-ip local-port global-ip global-port] | Clears an extended dynamic translation entry.                |

## What happens if there isn't enough addresses?

With both static and dynamic NAT you need to have enough addresses otherwise you could have internal machine fail.

Below is a configuration of dynamic NAT using 2 external addresses. The first 2 clients are successful in pinging out of the internal network whereas the third will fail as dynamic NAT is based on first come first serve.

![Dynamic NAT out of address client fails](/assets/images/posts/dynamic_nat_not_enough_addresses.png)

## Configure PAT

To configure PAT to use a single IPv4 address, simply add the keyword **overload** to the **ip nat inside source** command.

This configuration will allow anyone within the 192.168.0.0/16 range use PAT on interface serial 0/1/0

```text
R2(config)# ip nat inside source list 1 interface serial 0/1/0 overload

R2(config)# access-list 1 permit 192.168.0.0 0.0.255.255

R2(config)# interface serial0/1/0
R2(config-if)# ip nat inside

R2(config)# interface Serial0/1/1
R2(config-if)# ip nat outside
```

To use a pool of addresses instead of an interface

```text
R2(config)# ip nat pool NAT-POOL2 209.165.200.226 209.165.200.240 netmask 255.255.255.224

R2(config)# ip nat inside source list 1 pool NAT-POOL2 overload
```

PAT in action

![PAT working](/assets/images/posts/pat_working.png)

## NAT for IPv6 - NAT64

IPv6 does include its own IPv6 private address space, unique local addresses (ULAs).

ULA addresses are meant for only local communications within a site. ULA addresses are not meant to provide additional IPv6 address space, nor  to provide a level of security.

IPv6 does provide for protocol translation between IPv4 and IPv6 known as NAT64.

The varieties of NAT for IPv6 are used to transparently provide access between IPv6-only and IPv4-only networks.

![NAT64 Concept](/assets/images/posts/nat64.png)

IETF has developed several transition techniques

- Dual-stack
  - when the devices are running protocols associated with both IPv4 and IPv6
- Tunneling
  - process of encapsulating an IPv6 packet inside an IPv4 packet.
- Translation (NAT-PT)
  - NAT-PT has been deprecated by IETF in favor of its replacement, NAT64.

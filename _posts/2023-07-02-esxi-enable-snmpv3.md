---
title: "ESXi Enable SNMPv3"
date: 2023-07-02 10:00:00 +0000
categories: server
tags: vmware esxi snmp 
description: >- # this means to ignore newlines until "baseurl:"
  In this short article I will demonstrate how to enable SNMPv3 on a VMware ESXi host.
---

In this short article I will demonstrate how to enable SNMPv3 on a VMware ESXi host.

The first step is to enable SSH on ESXi host, this is similar on all versions of ESXi. From the vSphere Client, select the **host**, expand the **configure** tab and **system**. Now click into **services** and enable **SSH**.

I have shown this in the screenshot below using version 7.

![esxi-snmp-01](/assets/images/posts/esxi-snmp-01.png)

With SSH enabled, we can now open a SSH connection to the ESXi host.

```bash
ssh root@esxiIP
```

![esxi-snmp-02](/assets/images/posts/esxi-snmp-02.png)

To view the current SNMP configuration, use the command below. If your configuration is default, then it should be empty, as illustrated below.

```bash
esxcli system snmp get
```

![esxi-snmp-03](/assets/images/posts/esxi-snmp-03.png)



All of the commands used can be found within the help manual, this can be accessed via the below command.

```bash
esxcli system snmp set --help
```

Below is a copy of the help menu.

```bash
Usage: esxcli system snmp set [cmd options]

Description:
  set                   This command allows the user to set up ESX SNMP agent.

Cmd options:
  -a|--authentication=<str>
                        Set default authentication protocol. Values: none, MD5, SHA1
  -c|--communities=<str>
                        Set up to ten communities each no more than 64 characters. Format is:
                        community1[,community2,...] (this overwrites previous settings)
  -e|--enable=<bool>    Start or stop SNMP service. Values: [yes|no, true|false, 0|1]
  -E|--engineid=<str>   Set SNMPv3 engine id. Must be at least 10 to 32 hexadecimal characters. 0x or 0X is stripped
                        if found as well as colons (:)
  -y|--hwsrc=<str>      Where to source hardware events from IPMI sensors or CIM Indications. One of:
                        indications|sensors
  -s|--largestorage=<bool>
                        Support large storage for hrStorageAllocationUnits * hrStorageSize. Values: [yes|no,
                        true|false, 0|1]. Control how the agent reports hrStorageAllocationUnits, hrStorageSize and
                        hrStorageUsed in hrStorageTable. Setting this directive to 1 to support large storage with
                        small allocation units, the agent re-calculates these values so they all fit Integer32 and
                        hrStorageAllocationUnits * hrStorageSize gives real size of the storage ( Note:
                        hrStorageAllocationUnits will not be real allocation units if real hrStorageSize won't fit
                        into Integer32 ). Setting this directive to 0 turns off this calculation and the agent reports
                        real hrStorageAllocationUnits, but it might report wrong hrStorageSize for large storage
                        because the value won't fit into Integer32.
  -l|--loglevel=<str>   System Agent syslog logging level: debug|info|warning|error
  -n|--notraps=<str>    Comma separated list of trap oids for traps not to be sent by agent. Use value 'reset' to
                        clear setting
  -p|--port=<long>      Set UDP port to poll snmp agent on. The default is udp/161. May not use ports 32768 to 40959
  -x|--privacy=<str>    Set default privacy protocol. Values: none, AES128
  -R|--remote-users=<str>
                        Set up to five inform user ids. Format is: user/auth-proto/-|auth-hash/priv-proto/-|priv-
                        hash/engine-id[,...] Where user is 32 chars max. auth-proto is none|MD5|SHA1, priv-proto is
                        none|AES. '-' indicates no hash. engine-id is hex string '0x0-9a-f' up to 32 chars max.
  -r|--reset            Return agent configuration to factory defaults
  -C|--syscontact=<str> System contact string as presented in sysContact.0. Up to 255 characters
  -L|--syslocation=<str>
                        System location string as presented in sysLocation.0. Up to 255 characters.
  -t|--targets=<str>    Set up to three targets to send SNMPv1 traps to. Format is: ip-or-
                        hostname[@port]/community[,...] The default port is udp/162. (this overwrites previous
                        settings)
  -u|--users=<str>      Set up to five local users. Format is: user/-|auth-hash/-|priv-hash/model[,...] Where user is
                        32 chars max. '-' indicates no hash. Model is one of (none|auth|priv).
  -i|--v3targets=<str>  Set up to three SNMPv3 notification targets. Format is: ip-or-hostname[@port]/remote-
                        user/security-level/trap|inform[,...].
```



To setup our ESXi host, I will use the following commands, please remember that you need to provide your own variables such as authentication/privacy password to generate your own hash values.

Take note of the generated hash values as well as the passwords, you may need them later.

```bash
esxcli system snmp set --communities public
esxcli system snmp set --port 161
esxcli system snmp set --syscontact admin@example.com
esxcli system snmp set --syslocation "location"

# SNMPv3
# the engine ID must be a hexadecimal string between 5 and 32 characters long
esxcli system snmp set --engineid 0000000000000000
esxcli system snmp set --authentication SHA1
esxcli system snmp set --privacy AES128

# raw-secret allows direct password input
esxcli system snmp hash --auth-hash authPassword --priv-hash privPassword --raw-secret

# configure user - priv enables both auth and priv
esxcli system snmp set --users username/authHash/privHash/priv

# Enable the service
esxcli system snmp set --enable true
```

The screenshot below is an example of the completed setup, ready to add to our NMS. 

![esxi-snmp-04](/assets/images/posts/esxi-snmp-04.png)

If you have enabled the firewall, you'll need to add a rule to allow traffic.

To check the firewall we can use the `get` keyboard.

```bash
esxcli network firewall get
```

We can filter through the firewall rules by listing then using `grep` to filter for SNMP.

```bash
esxcli network firewall ruleset rule list  | grep snmp
```

If you wanted to limited SNMP access to a specific IP address, then the command below will achieve this. You'll need to replace `NMSIP` with your Network Monitoring Server IP address.

```bash
esxcli network firewall ruleset allowedip add --ruleset-id snmp --ip-address NMSIP
```

This completes this short article, I hope you found this useful.

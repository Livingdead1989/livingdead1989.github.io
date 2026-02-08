---
layout: post
title: "Deploying a TP-Link Omada Software Controller"
description: "A walkthrough for installing and running the TP-Link Omada Software Controller on Debian using Proxmox."
date: 2026-02-08
featured: true
tags:
  - tp-link
  - omada
  - wifi
  - networking
  - debian
  - proxmox
excerpt: >
  A guide to deploying a TP-Link Omada Software controller on Debian.
---

## TP-Link Omada Controllers

TP-Link offers three ways to deploy an Omada controller:

<details>
  <summary>Cloud-based controller</summary>
  <p>There are two options, each with a free tier.</p>
  <ol>
    <li>Omada Central</li>
    <li>Omada Cloud-Based Controller</li>
  </ol>
  <p>Omada Central is a upgraded product from the Omada Cloud-Based Controller.</p>
  <p>Cloud-based controllers support <strong>zero-touch provisioning</strong>, allowing access points to automatically register and configure themselves once connected to the internet.</p>
  <p>However, paid cloud tiers introduce per-device licensing.</p>
</details>

<details>
  <summary>Hardware controller appliance</summary>
  <p>Hardware controllers are dedicated appliances that run the Omada controller software, the current models include:</p>
  <table>
    <thead>
        <tr>
            <th>Model</th>
            <th>Max Devices*</th>
            <th>Form Factor</th>
            <th>Power</th>
            <th>Typical Use Case</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><strong>OC400</strong></td>
            <td>~1,000</td>
            <td>Rack-mount</td>
            <td>AC</td>
            <td>Larger deployments, campus or multi-site environments</td>
        </tr>
        <tr>
            <td><strong>OC300</strong></td>
            <td>~500</td>
            <td>Rack-mount</td>
            <td>AC</td>
            <td>Medium deployments needing rack integration</td>
        </tr>
        <tr>
            <td><strong>OC220</strong></td>
            <td>~100</td>
            <td>Desktop</td>
            <td>USB / PoE</td>
            <td>Small business or branch offices</td>
        </tr>
        <tr>
            <td><strong>OC200</strong></td>
            <td>~100</td>
            <td>Desktop</td>
            <td>USB / PoE</td>
            <td>Small business or branch offices</td>
        </tr>
    </tbody>
  </table>
  <p>Depending on the model, hardware controllers support between <strong>100 and 1,000 devices</strong>, they have some limitations:</p>
  <ul>
    <li>No zero-touch provisioning</li>
    <li>No MSP (multi-tenant) support</li>
    <li>Less flexible than a VM-based controller</li>
  </ul>
</details>

<details>
  <summary>Software controller</summary>
  <p>The Omada Software controller provides centralized management of Omada access points, switches, and routers <strong>with no hardware or licensing costs</strong>.</p>
  <p>Why it works well:</p>
  <ul>
    <li>Runs on a Linux VM</li>
    <li>Scales well (recommended 10,000 devices or less)</li>
    <li>Supports hybrid mode with optional cloud access</li>
    <li>Keeps management traffic and data local</li>
    <li>Omada Controller Clustering</li>
  </ul>
  <p></p>
</details>

The **software controller** is the most flexible and cost-effective choice.

This guide deploys the software controller on Debian inside Proxmox, but the same approach applies to most hypervisors.

---

## Installing the TP-Link Omada Controller

At a high level, the installation consists of:

1. Creating a virtual machine
2. Installing Debian
3. Assigning a static IP address
4. Updating the OS
5. Installing required dependencies
6. Installing the Omada controller package
7. Completing the initial web-based setup

---

### Create the Virtual Machine

The recommended system specifications are below, although in this lab I will be using less:

| Omada Devices | CPU | RAM | Bandwidth | Disk |
|------|------|------|--------|--------|
| **500** | 4 | 6 GB | 100 Mbps | 50 GB |
| **1500** | 8 | 8 GB | 100 Mbps | 100 GB |
| **3000** | 16 | 16 GB | 100 Mbps | 150 GB |
| **10000** | 64 | 64 GB | 1 Gbps | 500 GB |

This deployment uses **Proxmox** as the hypervisor. Comparable steps apply to other virtualization platforms.

Create a VM with the following, if its not included I will be using the default value.

**General**
- Name: "Omada-Controller"
- Start at boot: Enabled

**OS**
- ISO image: Debian 13.3

**System**
- Qemu Agent: Checked

**Disks**
- Storage: *I will use my NAS iSCSI LUN*

**CPU**
- Cores: 2
- Type: Host

**Memory**
- Memory (MiB): 2048 (2 GB)

These resources are sufficient for managing a modest number of Omada devices.

---

### Operating System Installation

A minimal Debian installation is recommended to reduce resource usage and maintenance overhead.

Below is what I changed, everything else remains as the default values.

- Lanauge & Keyboard: English
- Hostname: "omada-controller"
- Domain: "homelab.lan"
- Root password: Skipped (leave blank)
- User: *Username and Password of your account*
- Partition disks: 
    - Guided - use entire disk
    - All files in one partition
- Software selection *(keep this as minimal as possible)*:
    - Debian desktop environment: Uncheck
    - GNOME: Uncheck
    - SSH server: Check

Make sure to remove the ISO after the installation completes.

---

### Configure a Static IP & DNS

Infrastructure services should use a static IP address to avoid connectivity and device adoption issues.

Open the network interfaces configuration file:

```bash
sudo nano /etc/network/interfaces
```

Modify the file to set a static IP. Here’s an example configuration:

```text
allow-hotplug ens18
iface ens18 inet static
address 192.168.1.124
netmask 255.255.255.0
gateway 192.168.1.1
dns-nameservers 192.168.1.1
```

Edit the resolver configuration file

```bash
sudo nano /etc/resolv.conf
```

Add the following line to add a name server:

```text
nameserver 192.168.1.1
```

Restart the server

```bash
sudo shutdown -r now
```

---

### Update the OS

Ensure we are using the most up-to date packages by updating the repositories then upgrading any installed packages.

```bash
sudo apt update && sudo apt full-upgrade
```

---

### Install JSVC & OpenJDK

The Omada controller requires Java and uses JSVC for service management. Installing JSVC automatically installs `openjdk-21-jre-headless` as a dependency.

```bash
sudo apt install jsvc
```

---

### Install MongoDB

MongoDB is used as the backend database for the Omada controller.

Install the required tool using this command:

```bash
sudo apt-get install gnupg curl
```

Import the MongoDB public GPG key

```bash
curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg \
   --dearmor
```

Create the source list

```bash
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/debian bookworm/mongodb-org/8.0 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list
```

Update and Install MongoDB

```bash
sudo apt-get update
sudo apt-get install mongodb-org
```

---

### Install Omada Software Controller from package

You'll find the latest `deb` package available on the [Download Center for Omada Controller](https://support.omadanetworks.com/en/download/software/omada-controller/){:target="_blank"}.

Download the Omada package.

```bash
wget https://static.tp-link.com/upload/software/2026/202601/20260121/Omada_Network_Application_v6.1.0.19_linux_x64_20260117100106.deb
```

Install 

```bash
sudo dpkg -i Omada_Network_Application_v6.1.0.19_linux_x64_20260117100106.deb
```

---

### Initial web portal setup

Once installation completes, access the controller web interface:

```url
http://192.168.1.124:8088/
```

Follow the setup wizard. At minimum:

First page
- Owner Name (web username)
- Password
- Accept the Terms of Use

Second page
- Site Name
- Device Account Username
- Device Account Password

Remaining steps can be completed later as needed.

---

## Device Onboarding

There are a few different options to onboard devices these include:

- **Manually Add**
  - Requires device management to be enabled
  - Requires Cloud access to be enabled
- **Auto Find**
  - Devices must be on the same LAN or configured with an inform URL (MSP mode)
- **Import (CSV)**
  - Requires device management to be enabled
  - Requires Cloud access to be enabled
- **Scan to Add**
  - Usable on the mobile app
  - Requires device management to be enabled
  - Requires Cloud access to be enabled

The Omada [iOS](https://apps.apple.com/gb/app/tp-link-omada/id1327615864){:target="_blank"} or [Android](https://play.google.com/store/apps/details?id=com.tplink.omada){:target="_blank"} app allows for management and device onboarding through QR code or Auto Find.

---

## References 

- [Recommended Server Specifications for Omada Software Controller](https://www.tp-link.com/us/support/faq/2967/){:target="_blank"}
- [MongoDB documentation](https://www.mongodb.com/docs/v8.0/tutorial/install-mongodb-on-debian/){:target="_blank"}
- [Discover and manage Omada Devices](https://www.tp-link.com/us/support/faq/3387/){:target="_blank"}
- [Omada Documents - Configuration Guides for Controllers](https://support.omadanetworks.com/en/document/?documentResourceTypeIdList=1116&documentTagIdList=7){:target="_blank"}
---
layout: post
title: "Home Assistant on Proxmox"
description: "Deploy Home Assistant OS as a virtual machine on Proxmox for improved performance, flexibility, and simplified management."
date: 2026-07-17
featured: false
tags:
  - self-hosting
  - home-assistant
  - proxmox
  - virtualization
excerpt: >
  Learn how to deploy Home Assistant OS as a virtual machine on Proxmox, migrate from a Raspberry Pi, and size your VM for a growing smart home.
---

Home Assistant is one of the best self-hosted smart home platforms available. While many people begin with a Raspberry Pi, virtualising Home Assistant provides significantly more flexibility, better resilience, and makes backups and maintenance considerably easier.

This guide walks through deploying Home Assistant OS on Proxmox VE, importing the official virtual disk, and restoring an existing installation.

---

## Why virtualise Home Assistant?

Running Home Assistant inside a virtual machine has several advantages over dedicated hardware.

### Benefits

- Better performance than a Raspberry Pi
- Snapshots
- High availability options
- Centralised management with other virtual machines
- Easy migration between hosts
- Ability to expand CPU, memory and storage as your smart home grows
- Storage can reside on redundant RAID or NAS-backed storage

For me, this means Home Assistant runs alongside the rest of my self-hosted services while benefiting from redundant storage on my NAS.

---

## Home Assistant deployment options

Home Assistant is available in several deployment methods.

| Installation | Supports Add-ons | One-click updates |
|--------------|:----------------:|:----------:|
| Home Assistant OS | ✅ | ✅ |
| Home Assistant Container | ❌ | ❌ |

For these reasons I'll be deploying **Home Assistant OS**.

---

## Choosing virtual machine resources

The official minimum requirements are:

| Resource | Minimum |
|----------|---------|
| Memory | 2 GB RAM |
| CPU | 2 vCPUs |

Before sizing my virtual machine, I reviewed the resource usage on my existing Raspberry Pi 4 installation.

Current installation:

- 105 devices
- 836 entities
- 9 add-ons
- 16 automations
- ESPHome
- Zigbee2MQTT

Typical resource usage:

- CPU: 0–15%
- Memory: approximately 2.2 GB

Based on this, I allocated the following resources to the virtual machine:

| Resource | Allocation |
|----------|-----------:|
| Memory | 4 GB |
| CPU | 2 vCPUs |

This provides plenty of room for future growth while remaining lightweight.

---

## Creating the virtual machine

Create a new virtual machine in Proxmox using the following settings.

| Setting | Value |
|---------|-------|
| ID | `112` |
| Name | `home-assistant` |
| Start at boot | Enabled |
| Installation Media | Do not use any media |
| Guest OS | Linux |
| Machine | `q35` |
| BIOS | OVMF (UEFI) |
| EFI Disk | Enabled |
| Pre-enrol Keys | Disabled |
| Disk | Remove the default disk |
| CPU | 2 Cores |
| CPU Type | `host` |
| Memory | 4096 MB |
| Memory Ballooning | Enabled |
| KSM | Enabled |
| Network | VirtIO |

The default virtual disk is removed because we'll import the official Home Assistant disk image instead.

---

## Download the Home Assistant image

Open a shell on your Proxmox host.

Download the latest Home Assistant OS QCOW2 image.

> Replace the version number below with the latest release available on GitHub.

```bash
wget https://github.com/home-assistant/operating-system/releases/download/18.1/haos_ova-18.1.qcow2.xz
```

Extract the archive.

```bash
unxz haos_ova-18.1.qcow2.xz
```

---

## Import the virtual disk

I'm importing directly onto my NAS-backed storage (`nas-lun-1`).

```bash
qm importdisk 112 haos_ova-18.1.qcow2 nas-lun-1
```

If successful, Proxmox will report:

```
Successfully imported disk
```

Remove the downloaded image afterwards.

```bash
rm haos_ova-18.1.qcow2
```

---

## Attach the imported disk

In the Proxmox web interface:

1. Open the Home Assistant virtual machine.
1. Select **Hardware**.
1. Locate the **Unused Disk**.
1. Click **Edit**.
1. Attach it as a **SCSI** device.
1. Set the cache mode to **Write Through**.

Next, open:

**Options > Boot Order**

Set the imported disk (typically `scsi0`) as the primary boot device.

Finally, start the virtual machine.

---

## Initial startup

The first boot may take several minutes while Home Assistant completes its initial setup.

Once online, browse to either:

```
http://<IP Address>:8123

http://homeassistant:8123
```

---

## Restoring an existing installation

If you're migrating from another Home Assistant instance, select **Restore from Backup** during the setup wizard.

Upload your backup and, if required:

- Select all components to restore
- Enter your backup encryption key
- Allow the restore to complete

Depending on the size of your installation, this can take several minutes and the virtual machine may reboot automatically.

Once complete, your devices, integrations, dashboards, automations and add-ons should all be restored.

---

## Setting up a new installation

If this is your first Home Assistant deployment, simply follow the onboarding wizard to:

- Create an administrator account
- Configure your location
- Detect devices on your network
- Add integrations
- Begin automating your home

---
title: "Home Assistant VM on Proxmox"
date: 2021-10-6 20:30:00 +0000
categories: homeautomation
tags: proxmox homeassistant
description: >- # this means to ignore newlines until "baseurl:"
  In this article I cover how to create a Virtual Machine (VM) on top of Proxmox VE 7 and get up and running with Home Assistant.

---

In this article I cover how to create a Virtual Machine (VM) on top of Proxmox VE 7 and get up and running with Home Assistant.

Home Assistant is an "open source home automation system that puts local control and privacy first.  Powered by a worldwide community of tinkerers and DIY enthusiasts.  Perfect to run on a Raspberry Pi or a local server." - [Home Assistant](https://www.home-assistant.io/)

Home Assistant has [1000's of Integrations](https://www.home-assistant.io/integrations/) and we can add the [HACS](https://hacs.xyz/) repository for even more community integrations. We can even [use Home Assistant to monitor our Proxmox VMs](https://www.home-assistant.io/integrations/proxmoxve/).

All this sounds great but why virtualise Home Assistant using Proxmox, why not just use a Raspberry Pi? This is a good question and for me the answer is simple, I already have Proxmox so it makes sense to converge this service. There is also the added benefit of snapshotting, backing up and duplicating the VM, which makes experimenting much quicker, also the added redundancy of my Proxmox server hardware and control over the VM resources.

## Let's get started with deploying

Home Assistant recommended a minimum virtual machine resources of:

* 2GB RAM
* 32GB Storage
* 2 vCPU

When creating the VM I will be sticking to these requirements and if required at a later date we can increase.

Creating the VM I will be using the following settings, if they are not listed I did not change from the default value. You'll also need the advanced options enabled.

1. Create a new VM
   1. **Name**: vm-101-ha
   2. **Start at boot**: enabled
   3. **OS** - Do not use any media
   4. **System**, BIOS: OVMF (UEFI)
   5. **System**, Qemu Agent: Enabled
   6. **Hard disk** - This doesn't matter as we will remove the disk afterwards.
   7. **Memory Ballooning**: Disabled

Once the VM has been created go to the Hardware tab, detach and remove the Hard Disk. In the next step we will be importing the Home Assistant hard disk.

## Importing qcow2 into Proxmox

Now open a SSH connection or Shell session to our Proxmox server and download the KVM/Proxmox (.qcow2) file from the [Alternative downloads](https://www.home-assistant.io/installation/alternative) section using wget.

```bash
wget https://github.com/home-assistant/operating-system/releases/download/6.5/haos_ova-6.5.qcow2.xz
```

then extract the contents of the file.

```bash
xz -d haos_ova-6.5.qcow2.xz
```

Import the disk to a VM, which has an ID of 101 *(You may have a different ID)* and my local storage is called local-btrfs *(You may have different local storage, depending on your installation)*.

```bash
qm importdisk 101 haos_ova-6.5.qcow2 local-btrfs
```

Don't forget to clear up the old files

```bash
rm haos_ova-6.5.qcow2
```

Now go back to the Proxmox webGUI for the VM and assign the newly imported disk, enable SSD emulation and the boot options to use this disk.

There are a few extra settings we can change before starting our VM, these are:

* Hardware
  * Remove the CD/DVD Drive
  * Set Display to Spice
* Options
  * Disable use tablet for pointer
  * Remove all Hotplug selections

Now start the VM and once its booted you'll be able to visit <http://homeassistant.local:8123/> or use the IP address of the virtual machine such as <http://192.168.1.101:8123/>.

Home Assistant is now running in a Promxox virtual machine ready for the inital configuration or restore your existing installation.

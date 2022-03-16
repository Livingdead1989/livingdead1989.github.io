---
title: "pfSense migration to Virtual Machine"
date: 2021-07-10 13:30:00 +0000
categories: server
tags: router pfsense proxmox virtual VM backup restore
description: >- # this means to ignore newlines until "baseurl:"
  Creating a Virtual Machine in Proxmox for our pfSense installation, we walk through the steps involved in migrating our physical pfSense to a Virtual Machine VM.
---

I have been using pfSense for a while now, its been running on a small embedded CPU system. It started out as an experiment to gain some exposure to pfSense for my own personal study.

Since I have also dappled with Proxmox for virtualisation and containerisation. Now I would like to create a Virtual Machine for my pfSense installation and decommission the other computer system.

I already have my Proxmox setup and ready, this article will not cover how to install and setup Proxmox. This article will cover the following topics:

1. Backup the existing pfSense configuration
2. Configuring Proxmox networks for a virtual router
3. Creating a Virtual Machine for pfSense
4. Installation of pfSense
5. Restore our pfSense Backup
6. Tweaks for Virtual Machine pfSense
7. Troubleshooting

I have created a simple diagram to illustrate what I plan of doing in terms of physical and logical devices.

![proxmox-pfsense-diagram](/assets/images/posts/proxmox-pfsense-diagram.png)

Its worth mentioning that I have an [Intel PRO/1000 PT 4-port 1GB NIC](https://amzn.to/3k4sV6Q) installed in my Proxmox server ready for this project.

We'll first need the [latest copy of pfSense](https://www.pfsense.org/download/), which can be downloaded from their website. I will be installing version 2.5.2, AMD64 DVD Image (ISO).

## Backup the existing pfSense configuration

We'll need an up to date backup file for our pfSense instance, we can download a configuration XML by navigating to Diagnostics > Backup & Restore.

![proxmox-pfsense-backup-1](/assets/images/posts/proxmox-pfsense-backup-1.png)

On the Backup & Restore tab, we will check to include extra data and select Download configuration as XML.

![proxmox-pfsense-backup-2](/assets/images/posts/proxmox-pfsense-backup-2.png)

Make sure to keep this file safe and to hand as we'll need it to restore our configuration to the new virtual pfSense.

Once done, turn off the physical pfSense box.

## Configuring Proxmox Networks for a Virtual Router

[Netgate Documentation](https://docs.netgate.com/pfsense/en/latest/recipes/virtualize-proxmox-ve.html)

To configure our Proxmox server so its ready for a virtual router we need to create two bridges one for our LAN and the other for our WAN, these will have physical interfaces attached to them.

I already had the LAN bridge as you need a minimum of 1 bridge for virtual machines in Proxmox. I have also commented my interfaces so I know which port is which.

| Purpose | Interface | Bridge |
| ------- | --------- | ------ |
| LAN     | enp3s0f0  | vmbr0  |
| WAN     | enp4s0f1  | vmbr3  |

The WAN bridge does not have any IP configuration applied.

![proxmox-network-pfsense-overview](/assets/images/posts/proxmox-network-pfsense-overview.png)

## Creating a Virtual Machine for pfSense

Creating a Virtual Machine for pfSense is easy, the [Netgate Documentation](https://docs.netgate.com/pfsense/en/latest/recipes/virtualize-proxmox-ve.html#creating-a-virtual-machine) provide some guidance when creating a VM for pfSense.

I will step through the Create: Virtual Machine wizard and mention anything I changed from the default values.

On the general tab I have checked the Start at boot option, you may need to check the "Advanced" options box at the bottom. I have also added a start order of 1 with 0 delay as I want my pfSense virtual machine to start as soon as possible.

![proxmox-create-pfsense-vm-1](/assets/images/posts/proxmox-create-pfsense-vm-1.png)

On the OS tab I have changed the Guest OS type to "Other".

![proxmox-create-pfsense-vm-2](/assets/images/posts/proxmox-create-pfsense-vm-2.png)

On the System tab I have changed the Graphic card to SPICE, this provides us with more features if we wish, but will also save us some system resource.

![proxmox-create-pfsense-vm-3](/assets/images/posts/proxmox-create-pfsense-vm-3.png)

On the Hard Disk tab I have selected VirtIO Block as advised by Netgate.

![proxmox-create-pfsense-vm-4](/assets/images/posts/proxmox-create-pfsense-vm-4.png)

On the CPU tab I have selected 4 cores, this should be plenty given my host CPU and the expected pfSense workload. I have also selected the Type as host, this means our CPU type will be passed through and reported correctly by pfSense.

![proxmox-create-pfsense-vm-5](/assets/images/posts/proxmox-create-pfsense-vm-5.png)

On the Memory tab I have unchecked Ballooning (Dynamic RAM) and set the RAM to 4GB.

**EDIT**: *I have since bumped this upto 8GB as some of my services were using quite a bit of RAM*

![proxmox-create-pfsense-vm-6](/assets/images/posts/proxmox-create-pfsense-vm-6.png)

On the Network tab I have unchecked the Firewall option and set the Model to VirtIO (paravirtualised). I have also configured the Multiqueue to 8 (Max).

> Multiqueue: This option allows the guest OS to process networking packets using multiple virtual CPUs, providing an increase in the total number of packets transferred. - [PVE Proxmox](https://pve.proxmox.com/wiki/Qemu/KVM_Virtual_Machines)

![proxmox-create-pfsense-vm-7](/assets/images/posts/proxmox-create-pfsense-vm-7.png)

Complete the wizard but do not start the virtual machine.

Now we'll need to add an additional Network Device, go to the Virtual Machine > Hardware > Add > Network Device.

![proxmox-create-pfsense-vm-8](/assets/images/posts/proxmox-create-pfsense-vm-8.png)

Here we will add the other bridge, in my case VMBr3. The settings are the same as the Network Device we configured in the wizard.

![proxmox-create-pfsense-vm-9](/assets/images/posts/proxmox-create-pfsense-vm-9.png)

Our Virtual Machine is now ready to start the installation of pfSense.

## Installation of pfSense

Start the pfSense VM and open a Console.

The pfSense installation wizard is very straight forward so I will only skim over it, noting points which I needed to alter.

By default the keymap is set to US, I wanted to change mind to United Kingdom as thats where I am from an the type of keyboard I use.

![proxmox-pfsense-install-2](/assets/images/posts/proxmox-pfsense-install-2.png)

I went for a Auto (ZFS) installation, continuing with the defaults.

![proxmox-pfsense-install-3](/assets/images/posts/proxmox-pfsense-install-3.png)

With the installation complete, I selected No as I did not need a shell. The new pfSense install with now reboot.

![proxmox-pfsense-install-6](/assets/images/posts/proxmox-pfsense-install-6.png)

The pfSense will boot and ask us to assign the interfaces. The interfaces should have MAC addresses that match your Proxmox bridge MAC addresses, which makes it really easy to know the correct assignment.

![proxmox-pfsense-install-7](/assets/images/posts/proxmox-pfsense-install-7.png)

In my pfSense instance I did not require any VLAN setup, I then assigned vtnet1 as my WAN and vtnet0 as my LAN, this was based upon the MAC address given above and comparing against Proxmox.

![proxmox-pfsense-install-8](/assets/images/posts/proxmox-pfsense-install-8.png)

We should now have a fresh pfSense instance we can access via the LAN IP address. The default user credentials:

* Username: admin
* Password: pfsense

![proxmox-pfsense-install-9](/assets/images/posts/proxmox-pfsense-install-9.png)

## Restore our pfSense Backup

Before attempting to restore I ensure that I have a working base system, with a WAN address issued by my ISP modem.

**EDIT**: *I had to power off my ISP modem until the restore process completed, please see the Troubleshooting section*

![proxmox-pfsense-restore-1](/assets/images/posts/proxmox-pfsense-restore-1.png)

Now we can restore, navigate to Diagnostics > Backup & Restore.

![proxmox-pfsense-backup-1](/assets/images/posts/proxmox-pfsense-backup-1.png)

In the Restore Backup section, we will be restoring all. Browse to the configuration file we backed up earlier and begin the restore process.

![proxmox-pfsense-restore-2](/assets/images/posts/proxmox-pfsense-restore-2.png)

Once the initial restore completed my pfSense instance restarted and on my console I was prompt for assigning my interfaces again.

![proxmox-pfsense-install-8](/assets/images/posts/proxmox-pfsense-install-8.png)

The complete restore process takes a while, so be patient!

Once the restore has complete, we are finished, give it a test and check everything is okay.

## Tweaks for Virtual Machine pfSense

### Disable Hardware Offloading

When using VirtIO interfaces in Proxmox VE, hardware checksums must be disabled, otherwise the virtual machine will not pass traffic properly, accessing pfSense may be sluggish as well.

These should be disabled by default, but its worth checking, they can be found by navigating to System > Advanced > Networking.

![proxmox-pfsense-tweak-1](/assets/images/posts/proxmox-pfsense-tweak-1.png)

## Troubleshooting

### ISP Modem

I had difficulties with my ISP's modem, I found that I had to power the device off and leave it for a few minutes before I could obtain an IP address for my WAN.

During my restore process I had to leave the ISP modem off until restore completed, restore power to the ISP modem and wait until I had my WAN IP leased to me correctly, then the restore process could continue in the background.

### DNS Resolver

I have a custom .conf file listed in my DNS resolver custom options, which was not brought over with the Backup & Restore. The entry caused an issue with the Restore but after removing it, services started correctly and everything continued nicely.

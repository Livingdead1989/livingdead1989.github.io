---
title: "OMV on Proxmox"
date: 2022-04-18 08:30:00 +0000
categories: server
tags: omv proxmox
description: >- # this means to ignore newlines until "baseurl:"
  In this article I will be deploying OpenMediaVault OMV 5.6.13 as a virtual machine on Proxmox.
---

I will be deploying OpenMediaVault (OMV) 5.6.13 as a virtual machine on Proxmox. Providing a full step by step installation and some basic configuration, such as email notifications, NTP, configuring a RAID1 mirror, creating users and groups, sharing via SMB and NFS and finally how to add OMV-Extras for additional plugins and Docker support.

## OpenMediaVault

OMV is a network attached storage (NAS) solution based upon Debian with a web interface and easy to use [features](https://www.openmediavault.org/?page_id=1562). Thanks to the modular design of the framework it can be enhanced via [plugins](https://www.openmediavault.org/?page_id=2014), espcially the community OMV-Extras repository.

OMV is primarily designed to be used in small offices or home offices, but is not limited to those scenarios. It is a simple and easy to use out-of-the-box solution that will allow everyone to install and  administrate a Network Attached Storage without deeper knowledge.

At the time of writing the stable version is 5.6.13 with version 6.0 currently in testing. - Lets get started!

## Create VM

The first step is to download the latest stable ISO file from [OpenMediaVault.org](https://www.openmediavault.org/?page_id=77). Once downloaded upload this file to your ISO images repository.

![proxmox-omv-vm-1](/home/livingdead1989/Documents/website-git/Article/proxmox-omv/images/proxmox-omv-vm-1.png)

Now start the VM creation wizard. I have summarised some of the wizard steps, where I felt changes are necessary.

On the **General tab**, ensure that the "Start at boot" option is enabled. To ensure that our file server is serving content before starting other virtual machines or containers I have set a "Start/Shutdown order" of 0 with a "Startup delay" of 2 minutes.

![proxmox-omv-vm-2](/home/livingdead1989/Documents/website-git/Article/proxmox-omv/images/proxmox-omv-vm-2.png)

On the **OS tab**, select the ISO image and leave type as Linux as OMV is based upon Debian.

On the **System tab**, I have set the SCSI controller to VirtIO SCSI single, this is to leverage some features such as SSD emulation and best performance. I have also enabled the QEMU agent, which I will install at a later date.

![proxmox-omv-vm-3](/home/livingdead1989/Documents/website-git/Article/proxmox-omv/images/proxmox-omv-vm-3.png)

On the **Disks tab**, I have set the storage location and size, a minimum of 4 GB is recommended by OMV.

I have also enabled other features such as Discard, SSD emulation and IO thread.

* **Trim/Discard** - "If your storage supports *thin provisioning*, with Discard set and a *TRIM*-enabled guest OS, when the VM’s filesystem marks blocks as unused after deleting files, the controller will relay this information to the storage, which will then shrink the disk image accordingly."
* **SSD emulation** - “If you would like a drive to be  presented to the guest as a solid-state drive rather than a rotational  hard disk, you can set the SSD emulation option on that drive.”
* **IO Thread** - “Qemu creates one I/O thread per  storage controller, rather than a single thread for all I/O. This can  increase performance when multiple disks are used and each disk has its  own storage controller.”

![proxmox-omv-vm-4](/home/livingdead1989/Documents/website-git/Article/proxmox-omv/images/proxmox-omv-vm-4.png)

On the **CPU tab**, I have set 1 core and left the type as kvm64. *- A single core is perfect for light-weight usage.*

On the **Memory tab**, I have set memory and minimum memory to 1 GB and left ballooning device enabled. *- Post install this idles at 300-500MB*

* **Ballooning** - “even when using a fixed memory size, the  ballooning device gets added to the VM, because it delivers useful information such as how much memory the guest really uses.”

Lastly on the **Network tab**, I have connected to my LAN bridge and left the network model as VirtIO (paravirtualisation) as this is the recommended option for best performance.

This completes the VM creation wizard. The last alteration I am going to make is on the VM options and is to disable the "Use tablet for pointer" option.

![proxmox-omv-vm-5](/home/livingdead1989/Documents/website-git/Article/proxmox-omv/images/proxmox-omv-vm-5.png)

## Installation

Now we are ready to start the OMV installation process.

Below is each step of this process, with any notes I feel may be useful. Otherwise the process is straight forward.

![proxmox-omv-install-1](/home/livingdead1989/Documents/website-git/Article/proxmox-omv/images/proxmox-omv-install-1.png)

Set a language.

![proxmox-omv-install-2](/home/livingdead1989/Documents/website-git/Article/proxmox-omv/images/proxmox-omv-install-2.png)

Set your location.

![proxmox-omv-install-3](/home/livingdead1989/Documents/website-git/Article/proxmox-omv/images/proxmox-omv-install-3.png)

Configure the keyboard.

![proxmox-omv-install-4](/home/livingdead1989/Documents/website-git/Article/proxmox-omv/images/proxmox-omv-install-4.png)

![proxmox-omv-install-5](/home/livingdead1989/Documents/website-git/Article/proxmox-omv/images/proxmox-omv-install-5.png)

As I have a DHCP server this was assigned an IP, if this step fails you can manually configure an IP address using the install wizard.

![proxmox-omv-install-6](/home/livingdead1989/Documents/website-git/Article/proxmox-omv/images/proxmox-omv-install-6.png)

Configure a hostname for this system.

![proxmox-omv-install-7](/home/livingdead1989/Documents/website-git/Article/proxmox-omv/images/proxmox-omv-install-7.png)

Configure a domain name, I have used an internal domain called "home.lan".

![proxmox-omv-install-8](/home/livingdead1989/Documents/website-git/Article/proxmox-omv/images/proxmox-omv-install-8.png)

Set a password for the `root` user.

![proxmox-omv-install-9](/home/livingdead1989/Documents/website-git/Article/proxmox-omv/images/proxmox-omv-install-9.png)

![proxmox-omv-install-10](/home/livingdead1989/Documents/website-git/Article/proxmox-omv/images/proxmox-omv-install-10.png)

Installation begins.

![proxmox-omv-install-11](/home/livingdead1989/Documents/website-git/Article/proxmox-omv/images/proxmox-omv-install-11.png)

Configure the package manager location.

![proxmox-omv-install-12](/home/livingdead1989/Documents/website-git/Article/proxmox-omv/images/proxmox-omv-install-12.png)

Configure an archive mirror.

![proxmox-omv-install-13](/home/livingdead1989/Documents/website-git/Article/proxmox-omv/images/proxmox-omv-install-13.png)

Set a proxy if you have one, I do not therefore I can leave this blank.

![proxmox-omv-install-14](/home/livingdead1989/Documents/website-git/Article/proxmox-omv/images/proxmox-omv-install-14.png)

![proxmox-omv-install-15](/home/livingdead1989/Documents/website-git/Article/proxmox-omv/images/proxmox-omv-install-15.png)

![proxmox-omv-install-16](/home/livingdead1989/Documents/website-git/Article/proxmox-omv/images/proxmox-omv-install-16.png)

Set the device for the boot loader installation, if you have more than 1 device, select the one that contains the OS installation.

![proxmox-omv-install-17](/home/livingdead1989/Documents/website-git/Article/proxmox-omv/images/proxmox-omv-install-17.png)

![proxmox-omv-install-18](/home/livingdead1989/Documents/website-git/Article/proxmox-omv/images/proxmox-omv-install-18.png)

Installation complete.

![proxmox-omv-install-19](/home/livingdead1989/Documents/website-git/Article/proxmox-omv/images/proxmox-omv-install-19.png)

Now remove the CD/DVD drive (ide2) from the VM in Proxmox. Shutdown the VM and restart it to apply the changes.

![proxmox-omv-install-20](/home/livingdead1989/Documents/website-git/Article/proxmox-omv/images/proxmox-omv-install-20.png)

## QEMU Agent

Log into the OMV server from the shell or SSH as root, which we configured during install. Now using the command below install the QEMU agent package.

```bash
apt install -y qemu-agent-client
```

![proxmox-omv-qemu-agent-1](/home/livingdead1989/Documents/website-git/Article/proxmox-omv/images/proxmox-omv-qemu-agent-1.png)

Once that has been installed reboot the VM and Proxmox will display the IP address information in the summary panel, which is a good indicator that it is installed and working.

```bash
reboot
```

![proxmox-omv-qemu-agent-2](/home/livingdead1989/Documents/website-git/Article/proxmox-omv/images/proxmox-omv-qemu-agent-2.png)

## Configuration

With installation complete we can visit the OMV web panel, which is available via the IP address, hostname or FQDN (fully qualified domain name) of the virtual machine.

To find the IP address of the VM, either use

* the Proxmox summary panel,
* `ip addr` on the VM to list its interfaces,
* looking the value up from your DHCP server.

```http
http://192.168.1.27/
```

```http
http://omv/
```

```http
http://omv.home.lan/
```

The default login credentials for OMV are admin:openmediavault. Once logged in you'll be presented with the dashboard as shown below.

![proxmox-omv-config-dashboard](/home/livingdead1989/Documents/website-git/Article/proxmox-omv/images/proxmox-omv-config-dashboard.png)

### Change default password

To change the default password, navigate to **System** > **General Settings** and select the "**Web Administrator Password**" tab.

![proxmox-omv-config-default-password](/home/livingdead1989/Documents/website-git/Article/proxmox-omv/images/proxmox-omv-config-default-password.png)

### Misc Settings

A few other settings that are worth configuring, they are:

#### Date & Time - NTP

To configure NTP, first navigate to **System** > **Date & Time**, configure your timezone and set a time server, I have used my router by other suggestions include the [NTP Pool Project](https://www.pool.ntp.org/zone/uk).

![proxmox-omv-config-ntp](/home/livingdead1989/Documents/website-git/Article/proxmox-omv/images/proxmox-omv-config-ntp.png)

#### Email Notification

To configure email notifications first navigate to **System** > **Notification** and configure your SMTP settings, don't forget to click "Enable".

![proxmox-omv-config-email-1](/home/livingdead1989/Documents/website-git/Article/proxmox-omv/images/proxmox-omv-config-email-1.png)

Notifications topics can be configured on the **Notifications** tab, as shown below I have chosen to receive only "Filesystems", "S.M.A.R.T", "Software Raid" and "Software Update" notifications.

![proxmox-omv-config-email-2](/home/livingdead1989/Documents/website-git/Article/proxmox-omv/images/proxmox-omv-config-email-2.png)

### Create User

To create a user, navigate to **Access Rights Management** > **User**, on the **Users** tab click "Add".

Provide details such as:

* Name, this becomes the username.
* Set a password

Users can be assigned to groups using the **Groups** tab, but by default all created users become part of the "Users" group.

![proxmox-omv-config-user-1](/home/livingdead1989/Documents/website-git/Article/proxmox-omv/images/proxmox-omv-config-user-1.png)

### Create Group

To create a group, navigate to **Access Rights Management** > **Group**, and click "Add". Provide a name for the group and a comment if you wish.

![proxmox-omv-config-group-1](/home/livingdead1989/Documents/website-git/Article/proxmox-omv/images/proxmox-omv-config-group-1.png)

On the **Members** tab I have assigned users to the group, as shown in the figure below I have added my own user.

![proxmox-omv-config-group-2](/home/livingdead1989/Documents/website-git/Article/proxmox-omv/images/proxmox-omv-config-group-2.png)

### Disk Management RAID1

For demonstration purposes I have added two additional hard disks via Proxmox

![proxmox-omv-config-disks-1](/home/livingdead1989/Documents/website-git/Article/proxmox-omv/images/proxmox-omv-config-disks-1.png)

![proxmox-omv-config-disks-2](/home/livingdead1989/Documents/website-git/Article/proxmox-omv/images/proxmox-omv-config-disks-2.png)

To start I will create a RAID1, which is a mirror. Navigate to **Storage** > **RAID Management** and click "Create".

* "**RAID 1** consists of an exact copy of a set of data on two or more disks" - [Standard RAID Levels](https://en.wikipedia.org/wiki/Standard_RAID_levels#RAID_1)

Set a name for the RAID array and the appropriate level, options are listed below.

* Stripe (RAID 0)
* Mirror (RAID 1)
* Linear (no RAID)
* RAID 10
* RAID 5
* RAID 6

Lastly check which disks to include within this array.

![proxmox-omv-config-disks-3](/home/livingdead1989/Documents/website-git/Article/proxmox-omv/images/proxmox-omv-config-disks-3.png)

![proxmox-omv-config-disks-4](/home/livingdead1989/Documents/website-git/Article/proxmox-omv/images/proxmox-omv-config-disks-4.png)

Once complete the **State** will list as "clean".

![proxmox-omv-config-disks-5](/home/livingdead1989/Documents/website-git/Article/proxmox-omv/images/proxmox-omv-config-disks-5.png)

Now we can create a File System on to of our RAID, navigate to **File Systems**. The file system decision is a hard one, but I will be exploring XFS in this demonstration, I have listed a few points regarding each below.

* **BTRFS** - B-tree FS
  * Newer file system, added feature benefits over EXT4
* **EXT3** - Third Extended File system
* **EXT4** - Fourth Extended File system
  * Older file system, added benefit of its maturity is its stability and compatibility
* **F2FS** - Flash-Friendly File System
  * Log-based file system, which uses caches resulting in a fast file system but not resilient to crashes
* **XFS**
  * Excels in execution of parallel input/output operations
  * Default file system for RHEL 7
* **JFS** - Journaled File system

![proxmox-omv-config-disks-6](/home/livingdead1989/Documents/website-git/Article/proxmox-omv/images/proxmox-omv-config-disks-6.png)

Once the file system has been created click the **Mount** button.

![proxmox-omv-config-disks-7](/home/livingdead1989/Documents/website-git/Article/proxmox-omv/images/proxmox-omv-config-disks-7.png)

### Create Share

To create a shared folder, navigate to **Access Rights Management** > **Shared Folders** and click "Add".

I have created a shared folder called "OMV-Data" using the newly created "DataDisk" RAID 1 XFS file system. There are plenty of pre-set permissions, I have set the permissions to:

```text
Administrator: read/write, Users: read-only, Others: no access
```

![proxmox-omv-config-share-1](/home/livingdead1989/Documents/website-git/Article/proxmox-omv/images/proxmox-omv-config-share-1.png)

Now click the **ACL** button, which stands for Access Control List.

![proxmox-omv-config-share-2](/home/livingdead1989/Documents/website-git/Article/proxmox-omv/images/proxmox-omv-config-share-2.png)

From this window we can configure the shared folder permissions to meet our requirements.

I have set my user to have read/write access and changed the group to our previously created group "NetworkingDream".

![proxmox-omv-config-share-3](/home/livingdead1989/Documents/website-git/Article/proxmox-omv/images/proxmox-omv-config-share-3.png)

### Enable SMB/CIFS

Now that we have a shared folder we can offer this through the SMB service. Navigate to **Services** > **SMB/CIFS** and check the "**Enable**" button on the **Settings** tab.

![proxmox-omv-config-smb-1](/home/livingdead1989/Documents/website-git/Article/proxmox-omv/images/proxmox-omv-config-smb-1.png)

Next change to the **Shares** tab and click "Add". Here I will enable our shared folder called "OMV-Data". *- There are plenty of other options and its worth viewing them all, but for a basic share this is all we need.*

![proxmox-omv-config-smb-2](/home/livingdead1989/Documents/website-git/Article/proxmox-omv/images/proxmox-omv-config-smb-2.png)

We can test our share by opening the SMB location and logging in using our username.

```smb
smb://omv.home.lan/
```

### Enable NFS

To enable the NFS service, first navigate to **Services** > **NFS** and click "Enable" from within the **Settings** tab.

![proxmox-omv-config-nfs-1](/home/livingdead1989/Documents/website-git/Article/proxmox-omv/images/proxmox-omv-config-nfs-1.png)

Now switch to the **Shares** tab and click "Add". NFS does not use usernames instead it has allowed networks and clients, therefore its important to not expose the NFS share with read/write access to the whole network as shown in the figure below.

Instead only use a trusted IP address such as: 192.168.1.25

![proxmox-omv-config-nfs-2](/home/livingdead1989/Documents/website-git/Article/proxmox-omv/images/proxmox-omv-config-nfs-2.png)

### Update Management

Update are easy to perform via the web panel. First navigate to **System** > **Update Management** and click the "Check" button, this will perform a package manager repository update and then we can check which packages to update and click "Install".

This is the same as updating via SSH using `apt update && apt upgrade -y`.

![proxmox-omv-config-update-1](/home/livingdead1989/Documents/website-git/Article/proxmox-omv/images/proxmox-omv-config-update-1.png)

![proxmox-omv-config-update-2](/home/livingdead1989/Documents/website-git/Article/proxmox-omv/images/proxmox-omv-config-update-2.png)

### Plugins

To install plugins, first navigate to **System** > **Plugins** and click the "Check" button, this will update the available plugins list and display all install-able plugins.

In this demonstration I will install **NUT**, which stands for [Network UPS Tools](https://networkupstools.org/). Find the plugin in the list, check the selection box then select "Install".

![proxmox-omv-config-plugin-1](/home/livingdead1989/Documents/website-git/Article/proxmox-omv/images/proxmox-omv-config-plugin-1.png)

![proxmox-omv-config-plugin-2](/home/livingdead1989/Documents/website-git/Article/proxmox-omv/images/proxmox-omv-config-plugin-2.png)

Once installation has completed the page will reload and the appropriate new item can be found in the navigation pane.

![proxmox-omv-config-plugin-3](/home/livingdead1989/Documents/website-git/Article/proxmox-omv/images/proxmox-omv-config-plugin-3.png)

#### 3rd Party Plugins

The third party plugin list can be found at [omv-extras.org](http://www.omv-extras.org/). OMV-Extras is what allows us to easily install docker.

To install OMV-Extras either use SSH and enter

```bash
wget -O - https://github.com/OpenMediaVault-Plugin-Developers/packages/raw/master/install | bash
```

Or for OMV5 we can use the web interface, navigate to **Plugins** and click "Upload" and enter. - *for OMV6 use the above terminal command.*

```text
https://github.com/OpenMediaVault-Plugin-Developers/packages/raw/master/openmediavault-omvextrasorg_latest_all5.deb
```

Once installation has completed there will be many more plugins available for installation and the OMV-Extras menu, containing **Docker**, **Cockpit** and **Kernel**.

![proxmox-omv-config-extras](/home/livingdead1989/Documents/website-git/Article/proxmox-omv/images/proxmox-omv-config-extras.png)

That concludes this article, it is only a basic walk through but hopefully enough to get your feet wet and explore OMV.

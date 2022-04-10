---
title: "OMV on RPI4 with 4Bay USB Storage"
date: 2021-10-30 17:30:00 +0000
categories: server
tags: rpi rpi4 debian raspberrypi openmediavault omv
description: >- # this means to ignore newlines until "baseurl:"
  In this article I will be exploring Open Media Vault (OMV) on a Raspberry Pi 4 (RPI4) with a USB 4 bay IcyBox DAC. I will cover how to prepare the RPI4, Install OMV and basic configuration to enable a general purpose SMB share. I have discover OMV's Docker integration and container management Yacht and some useful plugin additions such as LVM, KVM and OpenVPN.
---

In this article I will be exploring Open Media Vault (OMV) on a Raspberry Pi 4 (RPI4) with a USB 4 bay 3.5" IcyBox DAC. I will cover how to prepare the RPI4, Install OMV and basic configuration to enable a general purpose SMB share. I have discover OMV's Docker integration and container management Yacht and some useful plugin additions such as LVM, KVM and OpenVPN.

Its worth noting that storage connected via USB is not eligible for raiding via OMV, but can still achieved using the built-in raid options and we can group disks together using LVM.

## Prepare the MicroSD card

First download the latest version of Raspberry Pi OS Lite from the [Raspberry Pi website](https://www.raspberrypi.com/software/operating-systems/). Now using Etcher flash RaspiOS on to your MicroSD card, I am using a 64GB SanDisk Extreme A2.

![rpi-nas-flash](/assets/images/posts/rpi-nas-flash.png)

Create a SSH file on the MicroSD Boot partition, this will enable the SSH server from the initial boot.

```bash
touch /media/username/boot/ssh
```

Eject the SD and insert into your Rasppberry Pi 4

## SSH & Config

SSH into the Raspberry Pi, using a username of "pi" and the password "raspberry".

*I know the IP address of my new RPI4 because I looked at my DHCP server address leases.*

```bash
ssh pi@192.168.1.50
```

First thing you want to do with any RPI4 is to set a new password.

```bash
passwd
```

Now Update and Upgrade all the packages.

```bash
sudo apt update && sudo apt upgrade -y
```

Using the raspi-config tool we will be setting an appropriate hostname and tweaking the GPU allocated memory.

```bash
sudo raspi-config
```

Navigate to System Options > Hostname and set a new name, I am using OpenMediaVault.

![rpi-nas-hostname](/assets/images/posts/rpi-nas-hostname.png)

Now go to Performance Options > GPU Memory and set it to 16, this saves a little memory as we are not using any GUI.

![rpi-nas-gpu](/assets/images/posts/rpi-nas-gpu.png)

Finish and Reboot the RPI4.

## OMV Installation

We will be using the Install Script - [GitHub Repo](https://github.com/OpenMediaVault-Plugin-Developers/installScript)

The below command will download the script and pipe it to bash for execution. Piping to bash is dangerous and should only be used if you know what will be happening and trust the author.

```bash
wget -O - https://github.com/OpenMediaVault-Plugin-Developers/installScript/raw/master/install | sudo bash
```

In the last step of the installation the eth0 network interface is added to the OMV database, which may cause the IP address to change and we could lose our SSH connection, this happened to me.

![rpi-nas-add-eth0](/assets/images/posts/rpi-nas-add-eth0.png)

You can reconnect using the new IP address or just continue to the webGUI.

## Open Media Vault

Visit the OMV webGUI

```http
http://192.168.1.50/
```

The default username is `admin` with a password of `openmediavault`.

![rpi-nas-login](/assets/images/posts/rpi-nas-login.png)

First thing is to change the default web admin password. Navigate to System > General Systems and the Web Administrator Password tab.

![rpi-nas-admin-password](/assets/images/posts/rpi-nas-admin-password.png)

That completes the initial installations of Open Media Vault.

## Storage

I have two 3TB disks within my IcyBox, to utilise them I need to create a File System. Navigate to Storage > File Systems and click the Create button.

![rpi-nas-storage-filesystem](/assets/images/posts/rpi-nas-storage-filesystem.png)

Select a disk, provide a label and select your preferred file system, I have chosen the default EXT4.

![rpi-nas-storage-filesystem-create](/assets/images/posts/rpi-nas-storage-filesystem-create.png)

**All data will be lost as the drive will be formatted.** Initialisation of the disk can take some time depending on the capacity of the disk.

Once the disk has completed Initialisation you can then mount it.

![rpi-nas-storage-filesystem-mount](/assets/images/posts/rpi-nas-storage-filesystem-mount.png)

The File System is now ready to use.

## Creating Users

I will be creating a single user for demonstration purposes. Navigate to Access Rights Management > User and click the Add button.

![rpi-nas-user-add](/assets/images/posts/rpi-nas-user-add.png)

Provide a name and password then save.

![rpi-nas-user-general](/assets/images/posts/rpi-nas-user-general.png)

## Creating a Share (SMB/CIFS)

Now lets create a Shared Folder using the initialised and mounted disk. Navigate to Access Rights Management > Shared Folders and click the Add button.

![rpi-nas-arm-shared](/assets/images/posts/rpi-nas-arm-shared.png)

Provide a name for the shared folder and which device and path.

The permissions by default will grant all administrators and users read/write access, while others (anonymous) have read only access. Use the drop down menu to change this preset.

![rpi-nas-arm-shared-create](/assets/images/posts/rpi-nas-arm-shared-create.png)

Now lets enable SMB/CIFS sharing. Navigate to Services > SMB/CIFS and enable the service.

![rpi-nas-service-smb](/assets/images/posts/rpi-nas-service-smb.png)

Now switch over the the Shares tab and Create a new share, selecting the Shared folder we just created.

I have also enabled:

* **Inherit Permissions** - This will help keep the permissions clean throughout the share.
* **Recycle Bin** - This will help prevent accidental deletion by creating a hidden folder called ".recycle" where deleted files are moved to, similar to Windows.
* Automatic Deletion after: 7 Days.

![rpi-nas-service-smb-create](/assets/images/posts/rpi-nas-service-smb-create.png)

Testing the new share, I have created a folder to test everything is working. I even deleted some files and checked the ".recycle" folder.

![rpi-nas-folder-shared](/assets/images/posts/rpi-nas-folder-shared.png)

## Docker

Now lets take a look at the Docker integration with OMV. Navigate over to System > OMV-Extras and the Docker tab.

![rpi-nas-docker](/assets/images/posts/rpi-nas-docker.png)

You can set your Docker Storage to use another path, such as an external disk.

You'll also notice that Docker is not currently installed. Install and enable Docker using the Docker drop down tab and select Install.

![rpi-nas-docker-install](/assets/images/posts/rpi-nas-docker-install.png)

Once complete the Status will change to "Installed and running". OMV comes with two options for container management the first is Portainer and the second is Yacht, I will be looking at Yacht.

### Yacht

*I have covered Portainer in other projects, its a fantastic project which makes container and stack management a breeze, its worth checking out if you haven't used it before.*

Install Yacht using the drop down menu.

![rpi-nas-yacht-install](/assets/images/posts/rpi-nas-yacht-install.png)

Once installed open the webGUI using the provided button. The default user is "admin@yacht.local" with a password of "pass".

![rpi-nas-yacht-installed](/assets/images/posts/rpi-nas-yacht-installed.png)

The first thing to do is change the default password.

Click the ADMIN@YACHT.LOCAL in the top right and select User, then Change password.

![rpi-nas-yacht-password](/assets/images/posts/rpi-nas-yacht-password.png)

#### Terminology

* **Applications** - Individual containers
* **Templates** - Container templates
* **Projects** - Docker-compose or as in Portainer, Stacks

I will not be covering how to deploy using Yacht as that is a little out of the scope of this article.

## Conclusion

To conclude, the Open Media Vault (OMV) is a powerful project, which can be easily ran of a Raspberry Pi 4 (RPI4). Although I have only covered this project very lightly, it has the ability to offer numerous services such as:

* S.M.A.R.T and Raid Management

* Flash Memory support

* File Sharing

* Backup with Time Machine support

* Access Control Lists (ACL) and User / Group permissions

* Support for FTP, NFS, Rsync and SMB/CIFS

* Docker support with container management webGUIs

* Cockpit integration for host management

* Range of additional plugins adding extra functionality including:

  * **KVM** - Ability to create and manage Kernel Virtual Machines (KVM).

    ![rpi-nas-kvm](/assets/images/posts/rpi-nas-kvm.png)

  * **OMV Downloader** - Downloader including youtube-dl through a webGUI, also the ability to upload.

    ![rpi-nas-downloader](/assets/images/posts/rpi-nas-downloader.png)

  * **LVM2** - Ability to make volume groups across disks, including USB DAC.

    ![rpi-nas-lvm2-group](/assets/images/posts/rpi-nas-lvm2-group.png)

  * **Symlinks** - Symlink management direct in the webGUI

    ![rpi-nas-symlink](/assets/images/posts/rpi-nas-symlink.png)

  * **Diskstats** - Additional performance statistics for Disks

  * **OpenVPN** - Access to OpenVPN direct in the webGUI

All behind a slick and intuitive web interface. The last note is that OMV is running on Raspberry Pi OS Lite, which is a Debian based distribution so the possibilities are limitless with what features and functions we can add.

---
title: "Proxmox Windows VM"
date: 2022-03-26 12:45:00 +0000
categories: server
tags: proxmox microsoft windows server virtio
description: >- # this means to ignore newlines until "baseurl:"
  This a quick article covering how to create a Windows VM within Proxmox with support for VirtIO.
---

This a quick article covering how to create a Windows VM within Proxmox with support for VirtIO and QEMU Agent. This is a similar process when using systems such as VMware or oVirt.

## VM Creation

Virtual Machine specification, based upon [Microsoft's hardware requirements](https://docs.microsoft.com/en-us/windows-server/get-started/hardware-requirements):

* CPU: 2 Cores
* RAM: 4096 MB (4 GB)
* Storage: 32 GB

**VM Creation wizard steps:**

Provide a name for the new Virtual Machine. Ensure the "Start at boot" option is checked, this will start the VM when Proxmox is booted.

![prox-win-vm-1](/assets/images/posts/prox-win-vm-1.png)

Change ISO image to your Microsoft Server 2022, which has been updated to your ISO images.

Change the Guest OS type to "Microsoft Windows" with a version of "11/2022", as we are using Server 2022.

![prox-win-vm-2](/assets/images/posts/prox-win-vm-2.png)

The system panel is pre-configured based on your Guest OS type and version. I have modified the SCSI controller to use the "VirtIO SCSI single" for performance and set a storage path for both EFI and TPM.

![prox-win-vm-3](/assets/images/posts/prox-win-vm-3.png)

In disks, I have changed the bus/device from IDE to SCSI for performance, setting my storage location and size of the disk.

I have also enabled Discard and SSD emulation.

* **Trim/Discard** - If the storage supports thin provisioning, when the VM’s filesystem marks blocks as unused after deleting files, the controller will relay this information to the storage, which will then shrink the disk image accordingly.
* **SSD emulation** - The drive will be presented to the guest as a solid-state drive rather than a rotational hard disk.
* **IO Thread** - Qemu creates one I/O thread per storage controller, rather than a single thread for all I/O. This can increase performance when multiple disks are used and each disk has its own storage controller.

![prox-win-vm-4](/assets/images/posts/prox-win-vm-4.png)

Set the CPU cores.

![prox-win-vm-5](/assets/images/posts/prox-win-vm-5.png)

I have configured memory ballooning (automatic allocation) with a minimum of 2048 MB (2 GB), which can scale up to 8192 MB (8 GB).

The recommendation is "even when using a fixed memory size, the ballooning device gets added to the VM, because it delivers useful information such as how much memory the guest really uses."

When using a lower minimum memory, also known as automatic allocation or dynamic memory "for Windows OSes, the balloon driver needs to be added manually and can incur a slowdown of the guest, so **we don’t recommend using it on critical systems**."

![prox-win-vm-6](/assets/images/posts/prox-win-vm-6.png)

For performance I have changed the network model to VirtIO (paravirtualized).

![prox-win-vm-7](/assets/images/posts/prox-win-vm-7.png)

That completes the VM creation wizard.

## Windows Server

The use of [VirtIO windows drivers](https://pve.proxmox.com/wiki/Windows_VirtIO_Drivers) will be required to enable many of the devices and ensure that the system can run efficiently. The latest drivers at the time of writing are [virtio-win-0.1.215](https://fedorapeople.org/groups/virt/virtio-win/direct-downloads/archive-virtio/virtio-win-0.1.215-2/).

Download the ISO and upload to your Proxmox ISO images.

![prox-win-vm-8](/assets/images/posts/prox-win-vm-8.png)

Then add an additional CD/DVD drive to your VM and select the VirtIO ISO

![prox-win-vm-9](/assets/images/posts/prox-win-vm-9.png)

Start the Virtual Machine and the Microsoft Server installation.

I will be installing the Standard edition with Desktop Experience.

![prox-win-vm-10](/assets/images/posts/prox-win-vm-10.png)

Select the "Custom" option here, as we'll now need to add the VirtIO drivers for our SCSI interface.

![prox-win-vm-11](/assets/images/posts/prox-win-vm-11.png)

As Microsoft does not have native support for VirtIO, it cannot detect any disks.

Select "Load driver".

![prox-win-vm-12](/assets/images/posts/prox-win-vm-12.png)

Accept the prompt to scan the DVD, if you mounted the VirtIO ISO file the system will detect available SCSSI controller drivers. Select the appropriate version, for MS Server 2022 we need to use "2k22".

![prox-win-vm-13](/assets/images/posts/prox-win-vm-13.png)

Now the disk can be detected and we can continue our installation.

![prox-win-vm-14](/assets/images/posts/prox-win-vm-14.png)

Once installation and the initial start wizard has been completed.

Log in to the server, mount the VirtIO ISO and install all the other drivers. This will enable all the other features such as memory ballooning.

![prox-win-vm-15](/assets/images/posts/prox-win-vm-15.png)

Accept any prompts to trust the publisher.

![prox-win-vm-16](/assets/images/posts/prox-win-vm-16.png)

Now navigate into the "guest-agent" folder and install the QEMU Guest Agent.

![prox-win-vm-17](/assets/images/posts/prox-win-vm-17.png)

Shutdown the VM, remove the CD/DVD drives, go to options and enable "**QEMU Guest Agent**" then start the VM again.

![prox-win-vm-18](/assets/images/posts/prox-win-vm-18.png)

### Windows Updates

Make sure you check for updates and install any that are available. This is important for security, bug fixes and feature updates.

![prox-win-vm-19](/assets/images/posts/prox-win-vm-19.png)

### Activate Windows

My environment does not have any automatic activation mechanisms therefore the server needs to be manually licensed.

![prox-win-vm-20](/assets/images/posts/prox-win-vm-20.png)

### Computer Name

Its important to set a computer name (hostname) for your Windows Server, this will make it easier to identify

The server can also be connected to a domain at this point if you require that.

![prox-win-vm-21](/assets/images/posts/prox-win-vm-21.png)

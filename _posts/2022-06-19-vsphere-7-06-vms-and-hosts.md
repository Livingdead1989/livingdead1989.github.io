---
title: "vSphere 7 06 VMs and Hosts"
date: 2022-06-19 11:00:00 +0000
categories: server
tags: vmware esxi vcenter
description: >- # this means to ignore newlines until "baseurl:"
  VMware vSphere is everywhere. To stay relevant, I needed to understand vSphere. I undertook a learning path, which discusses various topics for a vSphere 7 environment.
---

Resources:

* [VMware Pathfinder](https://pathfinder.vmware.com/v3/page/hands-on-labs?menu=overview)
* Lab: [Virtualisation 101](https://pathfinder.vmware.com/v3/activity/virtualization_101)

## Register and Unregister a VM

When removing a VM, there are two options:

* **Delete from Disk** - Will delete all files associated with the VM
* **Remove from Inventory** *(Unregister)* - Dissociate the VM, but leaves the files in place.

To register a VM, navigate to the storage and find the .vmx file, then use the option to "Register VM".

![vmware-vm-host-01](/assets/images/posts/vmware-vm-host-01.png)

## Working with VMX Files

Download a copy of the .VMX file from the datastore.

![vmware-vm-host-02](/assets/images/posts/vmware-vm-host-02.png)

.VMX files are editable via any text editor, as shown below.

Editing the .VMX file in this manner gives the ability to change, for example:

* A corrupt disk
* Network port group
* Snapshot directories

Once the file has been modified, use the "Upload Files" option in the screenshot above.

![vmware-vm-host-03](/assets/images/posts/vmware-vm-host-03.png)

## VM Advanced Settings

VM Advanced settings or [Configuration Parameters](https://docs.vmware.com/en/VMware-vSphere/7.0/com.vmware.vsphere.hostclient.doc/GUID-8C639077-FF16-4D5D-9A7A-E16902CE00C2.html) can be found within the VM settings > VM Options > Advanced and click the "Edit Configuration" under Configuration Parameters.

![vmware-vm-host-04](/assets/images/posts/vmware-vm-host-04.png)

Existing parameters can be modified and additional parameters can be added using the "Add Configuration Params" button.

[VMware Docs - Advanced Virtual Machine Attributes](https://docs.vmware.com/en/VMware-vSphere/7.0/com.vmware.vsphere.resmgmt.doc/GUID-F8C7EF4D-D023-4F54-A2AB-8CF840C10939.html)

![vmware-vm-host-05](/assets/images/posts/vmware-vm-host-05.png)

## vCenter Converter

*In February 2nd, 2022 the vSphere Team removed vCenter Converter as a precautionary measure - [Article here](https://blogs.vmware.com/vsphere/2022/02/vcenter-converter-unavailable-for-download.html).*

Possible usages of [vCenter Converter](https://docs.vmware.com/en/vCenter-Converter-Standalone/6.2/com.vmware.convsa.guide/GUID-D0C4114C-8A7C-42AE-AB72-A05E352CCCD2.html) are:

* Create a VM based upon a physical server
* Convert another virtual machine format, such as Hyper-V VM into a vSphere VM

In the Conversion wizard options for the source machine include:

**Powered On options:**

* Remote Windows machine
* Remote Linux machine
* Local machine *- fastest option*

**Powered Off options:**

* VMware Infrastructure virtual machine
* VMware Workstation or other VMware virtual machine
* Hyper-V Server

![vmware-vm-host-06](/assets/images/posts/vmware-vm-host-06.png)

![vmware-vm-host-07](/assets/images/posts/vmware-vm-host-07.png)

VM settings can be modified during conversion, for example disks can be changed from Thick to Thin provision.

The figure below shows a conversion progress in action.

![vmware-vm-host-08](/assets/images/posts/vmware-vm-host-08.png)

## Assignable Hardware

Modern workloads greatly benefit from using hardware accelerators such as a GPU *(Graphical Processing Unit)*.

Assignable Hardware provides a level of abstraction, that is a flexible mechanism to assign hardware accelerators to workloads.

Assignable Hardware brings back the vSphere HA capabilities to recover workloads (that are hardware accelerator enabled) if assignable devices are available in the cluster.

![vmware-vm-host-09](/assets/images/posts/vmware-vm-host-09.png)

* **DirectPath I/O**
  * Legacy feature to passthrough a PCIe
  * Uses hardware addresses, this restricts that virtual machine to that particular host.
  * No integration with vSphere DRS and HA
* **Dynamic DirectPath I/O**
  * New solution that enables the Assignable Hardware intelligence for passthrough devices.
  * Does not use hardware addresses, instead uses attributes, or capabilities, that are exposed to the virtual machine.
  * vSphere HA and DRS (initial placement) capabilities
* **NVIDIA vGPU**
  * Versatile solution that allows for partial, full, or multiple GPU allocation to workloads.
  * Allows for workload portability, even live-migrations using vMotion

## Auto Deploy

Bare-metal deployment of ESXi hosts using PXE.

1. Bare metal boots up and requests an IP address and TFTP address.
2. Request a PXE boot file.
3. HTTP request to vCenter for an ESXi image, based on the rules engine.
4. Boots up as a ESXi host.
5. Added to an inventory and applies a host configuration file.

![vmware-vm-host-10](/assets/images/posts/vmware-vm-host-10.png)

[Auto Deploy](https://docs.vmware.com/en/VMware-vSphere/7.0/com.vmware.esxi.install.doc/GUID-DC5D6EA2-2F17-4CB0-A0DB-C767F2BE2FBA.html) images are made up of a base VIB and includes other VIBS such as partner solutions and drivers.

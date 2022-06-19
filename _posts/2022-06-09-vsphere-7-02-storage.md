---
title: "vSphere 7 02 Storage"
date: 2022-06-09 12:00:00 +0000
categories: server
tags: vmware esxi vcenter
description: >- # this means to ignore newlines until "baseurl:"
  VMware vSphere is everywhere. To stay relevant, I needed to understand vSphere. I undertook a learning path, which discusses various topics for a vSphere 7 environment.
---

Resources:

* [VMware Pathfinder](https://pathfinder.vmware.com/v3/page/hands-on-labs?menu=overview)
* Lab: [Virtualisation 101](https://pathfinder.vmware.com/activity/virtualization_101)
* Lab: [VMware vSphere - Advanced Topics (Storage Features)](https://pathfinder.vmware.com/v3/activity/try_vsphere_advanced_hol)
* Lab: [What's New in vSAN - Getting Started](https://pathfinder.vmware.com/activity/vrealize_operations_vsan_hol)

Virtual Machines (VM) are not aware they are running on top of ESXi, instead a virtual storage adaptor, in this example a SCSI is presented to the VM and commands are handed from the VM to the adaptor then to the hyper-visor.

![vmware-storage-01](/assets/images/posts/vmware-storage-01.png)

A storage resource is called a "**Datastore**" and this can contain individual **Virtual Machine Disk (VMDK)** file which are presented to the VM.

This shared storage allows administrators to perform vMotion operations or move the VMDK between datastores without the VM being aware of it.

* **Thin Provisioning** - Gives the appearance of having a large resource, although the complete resource is not consumed by the VM, only what is being used. Thin provisioning can scale easier but can have a performance impact or VMs can fill the storage.
* **Thick Provisioning** - All the space is allocated to the VM.
  * **Lazy Zero** - blocks containing older data on the storage device are only cleared when the virtual machine writes new data to the disk for the first time.
  * **Eager Zeroed** *(better for write intense tasks)* - VMware pre-allocates the space and then zeroes it all out ahead of time.

## Troubleshooting

**Kernel Latency** - hypervisor is introducing latency into the storage commands. Expressed in [**ESXtop**](https://docs.vmware.com/en/VMware-vSphere/7.0/com.vmware.vsphere.monitoring.doc/GUID-D89E8267-C74A-496F-B58E-19672CAB5A53.html) as [**KAVG**](https://docs.vmware.com/en/VMware-vSphere/7.0/com.vmware.vsphere.monitoring.doc/GUID-CE9B766E-573B-4FF6-9768-8AF315542348.html?hWord=N4IghgNiBcINZgG4HMQF8g), if KAVG over 1ms would indicate a ESXi host issue.

**Switch issues** - misconfiguration of the switch or the hardware resource is over utilised. It is recommended to have more than a single switch for fail over purposes.

**Storage Issues** - overwhelmed resources, under performing disks, low spindle counts. Review ESXtop for [**Aborts**](https://docs.vmware.com/en/Management-Packs-for-vRealize-Operations-Manager/8.4/storagedevices/GUID-4DA7AD05-9D1A-42D3-919F-98F32DF6ABEE.html).

**ESXi** - suitable resources on ESXi hosts for software adaptors.

![vmware-storage-02](/assets/images/posts/vmware-storage-02.png)

## VMFS vs NFS

[**VMFS**](https://docs.vmware.com/en/VMware-vSphere/7.0/com.vmware.vsphere.storage.doc/GUID-7552DAD4-1809-4687-B46E-ED9BB42CE277.html) is raw block storage, and can include:

* **Fiberchannel** (FC)
* **FC over Ethernet** (FCoE)
* **iSCSI**
* **Local Disks** (Direct Attached Storage)

The EXSi host can own the formatted **LUN** and could even boot using iSCSI.

![vmware-storage-03](/assets/images/posts/vmware-storage-03.png)

**NFS** owns the file system, not ESXi. ESXi has access to the Shared Folder, known as an "**Export**".

Raw device mapping is also not supported using NFS.

## NFS 3 and 4.1

**Version 3**

* Traffic between ESXi host and NAS is unencrypted.
* Single connection for IO
  * IP Hash Load Balancing
  * Single physical adaptor
* ESXi required root level access to NFS. (less secure)
  * Have to configure no root squash

**Version 4.1**

* Headers are encrypted on the network
* Multi-pathing using multiple IP addresses
* No longer require root access
* Kerberos support, credentials must match on all hosts.
* Leverages Active Directory (AD) Domain Controller (DC) and key distribution center

## iSCSI

* All iSCSI devices use a iSCSI Qualified Name (**IQN**) to identify themselves.
* Uses **CHAP** (Challenge Handshake Authentication Protocol)
* Uses Discoveries to learn about available LUNs.
  * Storage must be configured with appropriate **LUN Masking**.

## Storage Port Bindings and Multipathing

Using the storage adaptor **multipath** plugin achieves, load balancing and fault redundancy through using two VMNIC, as shown in the figure below.

![vmware-storage-04](/assets/images/posts/vmware-storage-04.png)

This approach is better than using a single VMNIC as it is more likely to equally load balance to an iSCSI storage when using IP Source Hash, as there are multiple IP addresses.

![vmware-storage-05](/assets/images/posts/vmware-storage-05.png)

Network Port Bindings are configured within the ESXi host > Storage > Storage Adaptors and Network Port Binding.

The multipathing plugin is configured on the Datastore, under Configure > Connectivity and Multipathing.

![vmware-storage-06](/assets/images/posts/vmware-storage-06.png)

Each storage array will be different and it is worth reviewing its documentation to find the optimum option.

## Storage vMotion

Using multiple storage arrays and being able to migrate data between the storage arrays without downtime.

**SDRS** stands for Storage Dynamic Resource Scheduler, which is the automatic movement of storage based upon rules and conditions. A benefit of this feature is the ability to place storage into maintenance, automatically drain VM disks and restore after maintenance without downtime.

**Automation levels**

* Manual mode
* Partially Automated mode
* Fully Automated mode

## vSAN vs Traditional Storage Array

Traditional Storage Arrays are shared storage, typically a SAN (Storage Area Network), having a shared storage enables the use of:

* High Availability
* Fault Tolerance
* **vMotion** - Migration and Live Migration of VM disks.
* **DRS** - Dynamic Resource Scheduler

The figure below shows a traditional storage concept.

![vmware-storage-07](/assets/images/posts/vmware-storage-07.png)

**vSAN** is different because it splits a VM into objects and distributed the objects on to the local storage on each ESXi host.

Data is stripped and mirrored to other hosts to provide fault tolerance. A read and write buffer (SSD Cache Tier) is used to improve performance.

ESXi hosts must be part of a host cluster and have a **VMkernel port** marked for vSAN traffic.

A useful resource is the [VMware vSAN Design Guide](https://core.vmware.com/resource/vmware-vsan-design-guide).

This is similar to other technologies such as Ceph, where distributed host storage is used as a shared medium, removing the requirement for a dedicated storage array.

![vmware-storage-08](/assets/images/posts/vmware-storage-08.png)

**Note**: *When configuring vSAN, vSphere Availability host monitor must be turned off and once vSAN has been configured, vSphere High Availability can be configured again.*

### Disk Groups

Maximum of 7 capacity devices per disk group and up to 5 disk groups per host.

The recommendation is at least 10% cache, for example 1 TB of capacity and 100 GB of cache.

Typically, hosts configurations are equal to one another, this keeps hosts work load balanced.

![vmware-storage-09](/assets/images/posts/vmware-storage-09.png)

## Virtual Volumes

**VVOLs** (Virtual Volumes) support common storage networks and VM objects are exposed to the storage array.

When using VMFS, the storage array does not understand it and cannot dig in to find individual VM files.

VVOLs use a storage container, this removes the restrictions presented from a datastore and LUN.

Protocol Endpoint (PE) handles all the storage traffic.

Benefits of VVOLs are tasks can be off-loaded to the storage array, instead of sending data between the ESXi host and storage.

![vmware-storage-10](/assets/images/posts/vmware-storage-10.png)

## Storage I/O Control

Storage I/O Control is used to prioritise traffic, using shares, limits and reservations.

Navigate to a Datastore > Configure > General > Configure Storage I/O Control.

 ![vmware-storage-11](/assets/images/posts/vmware-storage-11.png)

In conjunction, a host based service VM Storage Policy can be created to configure share allocations when congestion is detected. These policies can be assigned to VMs or specific disks within a VM.

![vmware-storage-12](/assets/images/posts/vmware-storage-12.png)

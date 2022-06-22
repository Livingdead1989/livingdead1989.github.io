---
title: "vSphere 7 07 Resource Management"
date: 2022-06-22 21:00:00 +0000
categories: server
tags: vmware esxi vcenter vsphere
description: >- # this means to ignore newlines until "baseurl:"
  VMware vSphere is everywhere. To stay relevant, I needed to understand vSphere. I undertook a learning path, which discusses various topics for a vSphere 7 environment.
---

Resources:

* [VMware Pathfinder](https://pathfinder.vmware.com/v3/page/hands-on-labs?menu=overview)

* Lab: [Introduction to vSphere 7 Performance](https://pathfinder.vmware.com/v3/activity/try_intro_to_vsphere)

* Lab: [vSphere Performance Testing of Workloads](https://pathfinder.vmware.com/v3/activity/try_vsphere_testing_workloads)

## Resource Reservations and Limits

Storage I/O Control in [vSphere 7 02 Storage](https://networkingdream.com/server/vsphere-7-02-storage/) discusses aspects of using shares, limits and reservations within storage. These topics were also discussed in [vSphere 7 03 Monitoring](https://networkingdream.com/server/vsphere-7-03-monitoring/) in regards to Memory.

**Reservations** grant resources to a VM, this guarantees that the VM will have resources, but these could be wasted when not used as no other VM will be able to utilise the resource. Also if an offline system with a reservation cannot be satisfied it will not boot up, this includes vMotion.

**Limits** are a hard cap on resources, that cannot be consumed. An example is limit a VM's CPU to 500 Mhz.

Both Reservations and Limits are quite restrictive and should be strongly considered before using.

![vmware-vm-resource-01](/assets/images/posts/vmware-vm-resource-01.png)

**Shares** are built to be flexible and are only used in times of **contention** / **congestion**. They provide a mechanism for prioritising resources based upon share profiles and their entitlement.

Shares are based upon the resource values configured for each VM.

Default options include:

* Low
* Normal
* High
* Custom

## CPU Hot Plug and RAM Hot Add

Typically a VM's resource cannot be altered when powered on; for example 2 CPUs and 4 GB of RAM cannot be altered, unless powered off.

If the VM has a supporting operating system the options for "**Hot Plug**" can be enable when powered off, once enabled these values can be altered even when the VM is powered on.

![vmware-vm-resource-02](/assets/images/posts/vmware-vm-resource-02.png)

## Resource Pools and vApp

A resource pool is a container object, or grouping VMs or other resource pools. They are used to assign shares, limits and reservations or even access controls and permissions.

For example creating a "Dev" resource pool and limiting all VMs inside to a total of 16 GB of RAM, or creating production shares based groups for mission critical and non-essential VMs.

Shares are granted to the resource pool and VMs contains will split those shares.

![vmware-vm-resource-03](/assets/images/posts/vmware-vm-resource-03.png)

Child resource pools as a group will contend with other VMs within the resource group.

**Expandable reservation**, if a VM cannot boot due to limitations, it will reach out to the parent pool and see if it can provide the resources.

Resource pools can be created on either a standalone host or a cluster.

To create a resource pool, right click the ESXi host and select "New Resource Pool".

![vmware-vm-resource-06](/assets/images/posts/vmware-vm-resource-06.png)

Below is an example, creating a High resource pool, using the default profiles.

![vmware-vm-resource-07](/assets/images/posts/vmware-vm-resource-07.png)

VMs can then be moved to the appropriate pool.

![vmware-vm-resource-08](/assets/images/posts/vmware-vm-resource-08.png)

## Scalable Shares

This feature is part of DRS.

[Scalable shares](https://www.yellow-bricks.com/2020/03/12/introducing-scalable-shares-vsphere-7/) helps resolve the issue of having to many VMs within a share based resource pool, resulting in the High shares actually having less resource.

The High group has 4 VMs whereas the Normal has 1.

![vmware-vm-resource-05](/assets/images/posts/vmware-vm-resource-05.png)

[YouTube video showing Scalable Shares](https://www.youtube.com/watch?v=EVWjcr6tzzM).

Scalable shares requires a cluster with DRS and needs to be manually enabled via the Cluster Settings pane.

![vmware-vm-resource-09](/assets/images/posts/vmware-vm-resource-09.png)

## vApps

**[vApp](https://docs.vmware.com/en/VMware-vSphere/7.0/com.vmware.vsphere.vm_admin.doc/GUID-E6E9D2A9-D358-4996-9BC7-F8D9D9645290.html)** is a container object that has the abilities of resource pools, plus power on/off order, for example a DB and App, the DB needs to be available before the App.

![vmware-vm-resource-04](/assets/images/posts/vmware-vm-resource-04.png)

To create a new vApp, right click on an ESXi host and select "New vApp", step through the wizard.

![vmware-vm-resource-10](/assets/images/posts/vmware-vm-resource-10.png)

![vmware-vm-resource-11](/assets/images/posts/vmware-vm-resource-11.png)

![vmware-vm-resource-12](/assets/images/posts/vmware-vm-resource-12.png)

![vmware-vm-resource-13](/assets/images/posts/vmware-vm-resource-13.png)

Once the new vApp container has been created, drag the appropriate VMs into that container.

Then we can edit the vApp settings and configure options such as; Start Order and Shutdown actions, such as a graceful shutdown (Guest Shutdown).

![vmware-vm-resource-14](/assets/images/posts/vmware-vm-resource-14.png)

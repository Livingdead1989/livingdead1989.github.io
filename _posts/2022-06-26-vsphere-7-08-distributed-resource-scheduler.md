---
title: "vSphere 7 08 Distributed Resource Scheduler"
date: 2022-06-26 12:00:00 +0000
categories: server
tags: vmware esxi vcenter vsphere
description: >- # this means to ignore newlines until "baseurl:"
  VMware vSphere is everywhere. To stay relevant, I needed to understand vSphere. I undertook a learning path, which discusses various topics for a vSphere 7 environment.

---

Resources:

* [VMware Pathfinder](https://pathfinder.vmware.com/v3/page/hands-on-labs?menu=overview)
* Lab: [vSphere Performance Testing of Workloads](https://pathfinder.vmware.com/v3/activity/try_vsphere_testing_workloads) - Provides a full cluster to experiment with DRS settings.

## Distributed Resource Scheduler (DRS)

[vSphere High Availablity](https://docs.vmware.com/en/VMware-vSphere/7.0/com.vmware.vsphere.avail.doc/GUID-33A65FF7-DA22-4DC5-8B18-5A7F97CCA536.html) (HA) allows VMs, in the event of a failure, the virtual machines on a failed host are restarted on alternate hosts.

VMware vSphere Distributed Resource Scheduler (DRS) is a feature included in the [vSphere Enterprise Plus](https://www.vmware.com/content/dam/digitalmarketing/vmware/en/pdf/products/vsphere/vmw-edition-comparison.pdf).

* Guaranteeing appropriate resources to virtual machines.
* Deploy new capacity to a cluster without service disruption.
* Automatically migrate virtual machines during maintenance without service disruption.
* Monitor and manage more infrastructure per system administrator.

**Requirements of DRS:**

* Cluster must have shared storage
* Cluster must be part of a storage vMotion network
* Enterprise Licence

## vSphere 7 enhancements

Before vSphere 7, the focus was on the cluster and the ESXi hosts, ensuring that hosts are evenly balanced with their VMs and workloads.

After vSphere 7, the focus is now on the workloads of individual VMs. Each VM is calculated a score out of 100 *(higher is better)* based upon the following:

* CPU percentage ready value
* CPU cache value
* Memory swap activity
* Headroom *(expanding workloads)*
* vMotion cost

![vmware-vm-drs-01](/assets/images/posts/vmware-vm-drs-01.png)

[vSphere 7 - Improved DRS blog article](https://blogs.vmware.com/vsphere/2020/03/vsphere-7-improved-drs.html), below is a walkthrough GIF of DRS.

![vmware-vm-drs-02](/assets/images/posts/vmware-vm-drs-02.gif)

## DRS Settings

DRS can be set up in a cluster either during or after initial setup.

DRS can be configured to be in one of the following modes:

* **Manual** - VMs never automatically move using vMotion, instead recommendations are provided.
* **Partially automated** - Powered off VMs will be initially placed using DRS, powered on VMs will not be migrated.
* **Fully automated** - Full control to DRS for vMotion migrations.

**Predictive DRS** uses a combination of DRS and vRealize Operations Manager to predict future demand and determine when and where hot spots will occur.

**Virtual Machine Automation** allows for specific VM migration configuration for example vCenter.

![vmware-vm-drs-03](/assets/images/posts/vmware-vm-drs-03.png)

**VM Distribution** allows for even distribution of VMs across all hosts within a cluster. low intensity workloads may end up being grouped and if a failure occurs the fall out could be massive, even distribution attempts to reduce this.

**CPU Over-Commitment** sets a limit of virtual cores against physical cores. This rule does not apply during times of high availability.

**Scalable Shares** are new to vSphere 7, this topic was discuss on the [Resource Management article](https://networkingdream.com/server/vsphere-7-07-resource-management/).

![vmware-vm-drs-04](/assets/images/posts/vmware-vm-drs-04.png)

**Distributed Power Management (DPM)** will consolidate VMs into a set of hosts and power off hosts that are not required. When the workload increases the offline hosts will be powered on and vMotion VMs.

[IPMI or iLO Settings](https://docs.vmware.com/en/VMware-vSphere/7.0/com.vmware.vsphere.resmgmt.doc/GUID-D247EC2C-92C5-4B9B-9305-39099F30D3B5.html) need to be configure along side [Wake-on-LAN (WoK)](https://docs.vmware.com/en/VMware-vSphere/7.0/com.vmware.vsphere.resmgmt.doc/GUID-A23C0FED-603A-4B51-8E13-DBD162F7107B.html) to utilise DPM.

![vmware-vm-drs-05](/assets/images/posts/vmware-vm-drs-05.png)

The Advanced Options tab allows for custom parameters.

## Monitoring DRS

Monitoring is performed under the vSphere cluster using the Monitor tab and vSphere DRS.

![vmware-vm-drs-06](/assets/images/posts/vmware-vm-drs-06.png)

## VM Host Groups

Navigate to Cluster > Configure > Configuration.

Groups can be created to group either VMs or Hosts together and name them, these can then be used in other rules.

Concepts include:

* Development Hosts or VMs
* Production Hosts or VMs

Rules can then be created to restrict Development VMs to Development Hosts.

![vmware-vm-drs-09](/assets/images/posts/vmware-vm-drs-09.png)

## VM Host Rules

Navigate to Cluster > Configure > Configuration.

New rules can be created to perform tasks such as:

* Keep Virtual Machines Together *(Affinity)*
* Separate Virtual Machines *(Anti-Affinity)*
* Virtual Machines to Hosts
  * Affinity rules can be set to "Must run", "Should run", "Must Not Run" or "Should Not Run".
* Virtual Machines to Virtual Machines

![vmware-vm-drs-07](/assets/images/posts/vmware-vm-drs-07.png)

## VM Overrides

Navigate to Cluster > Configure > Configuration.

VM Overrides allows for specific VMs to be configured to override global / cluster settings such as DRS automation levels, restart priorities etc.

![vmware-vm-drs-08](/assets/images/posts/vmware-vm-drs-08.png)

## Maintenance Mode

When entering maintenance mode there will be a prompt for moving powered-off and suspended VMs, this is the first step when decommissioning an ESXi host, otherwise the VMs will become unregistered.

If the DRS cluster is in manual or partial only DRS recommendations will be generated, if the cluster is in fully automatic mode the VMs will be migrated using vMotion and the host will enter maintenance mode.

![vmware-vm-drs-10](/assets/images/posts/vmware-vm-drs-10.png)

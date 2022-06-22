---
title: "vSphere 7 03 Monitoring"
date: 2022-06-11 12:00:00 +0000
categories: server
tags: vmware esxi vcenter vsphere
description: >- # this means to ignore newlines until "baseurl:"
  VMware vSphere is everywhere. To stay relevant, I needed to understand vSphere. I undertook a learning path, which discusses various topics for a vSphere 7 environment.
---

Resources:

* [VMware Pathfinder](https://pathfinder.vmware.com/v3/page/hands-on-labs?menu=overview)
* Lab: [Introduction to vSphere 7 Performance](https://pathfinder.vmware.com/v3/activity/try_intro_to_vsphere)
* Lab: [vSphere Performance Testing of ESXi Host Subsystems - Module 1](https://pathfinder.vmware.com/v3/activity/vsphere_testing_hosts_hol)
* [The CPU Scheduler in VMware vSphere 5.1](https://www.vmware.com/content/dam/digitalmarketing/vmware/en/pdf/techpaper/vmware-vsphere-cpu-sched-performance-white-paper.pdf)
* [vSphere Resource Management - VMware 7.0](https://docs.vmware.com/en/VMware-vSphere/7.0/vsphere-esxi-vcenter-server-70-resource-management-guide.pdf)
* [ESXTOP Cheatsheet](https://www.running-system.com/wp-content/uploads/2015/04/ESXTOP_vSphere6.pdf)

## vSphere CPU Scheduler

CPU scheduler spreads virtual machines across multiple physical processor cores.

**Terms**

* A **world** is a thread of execution (processes that an ESXi host are running expressed as **NWLD**)
* A VM includes multiple worlds
* **Symmetric Multi-Processor (SMP)** - Allows ESXi hosts to support VMs with multiple CPUs.
* **CPU Affinity** - Bonds a VM to a specific processor, removing vMotion and HA.
* **ESXTOP** - Command line tool used to analyse performance.

VMs are allocated vCPUs and multiple VMs can share the EXSi host physical CPU cores.

Under the hood the ESXi host will load balance the cores, which optimises the use of the physical cores.

![vmware-monitoring-01](/assets/images/posts/vmware-monitoring-01.png)

[Hyper-Threading](https://www.intel.com/content/www/us/en/gaming/resources/hyper-threading.html) is a form of parallelisation. Threads are processed in parallel by different CPU cores to save time.

The figure below is an illustration of a CPU clock time. The top diagram shows a non-hyper-threading CPU, each request is processed one after anther.

Whereas the hyper-threaded CPU can split the CPU into threads and start processing the requests, resulting in a shorter completion time.

![vmware-monitoring-02](/assets/images/posts/vmware-monitoring-02.png)

### Right sizing Virtual Machines

Based on vCPU utilisation, having correctly sized VMs allows for a more efficient use of the physical CPU cores and improve clock time usage.

In the figure below, if the first VM, which has 4 vCPU and only utilises 25% is reduced to 2 vCPU, the utilisation would increase to 50% but the CPU clock would be in a better place and typically improving performance of both VMs.

![vmware-monitoring-03](/assets/images/posts/vmware-monitoring-03.png)

* **vCPU ready** - ready to process, but queued. This is expressed as "**%RDY**" in ESXTOP.
* **CoStop** - Threshold of CPU skew reached, CPUs being placed on hold. This is expressed as "**%CSTP**" in ESXTOP.

## Memory Virtualisation

Memory in Virtual Machines is thin provisioned and can be over provisioned. Memory pages are mapped between the VM and the physical host but requires a reclaim mechanism when memory is no longer used.

A memory reservation can be created, and will guarantee the physical memory. Reservations often cause wasted memory on the physical host.

## Performance Charts

Navigate to **VM** > **Monitor** > **Performance** > **Overview**.

The overview graphs provide a high level view, and can be extremely useful to understand if the resources are being utilised efficiently or if there are bottle necks, such as CPU Ready.

![vmware-monitoring-04](/assets/images/posts/vmware-monitoring-04.png)

The advanced charts provide more details, allowing us to focus on a specific set of data for example the "Readiness".

![vmware-monitoring-05](/assets/images/posts/vmware-monitoring-05.png)

## ESXTOP

ESXTOP is a command line tool used to analyse performance, similar to [top](https://linux.die.net/man/1/top) for Linux.

![vmware-monitoring-06](/assets/images/posts/vmware-monitoring-06.png)

**Switch display:**

* c - CPU
* i - interrupt
* m - memory
* n - network
* d - disk adaptor
* u - disk device
* v - disk VM
* p - power management
* x - vSAN

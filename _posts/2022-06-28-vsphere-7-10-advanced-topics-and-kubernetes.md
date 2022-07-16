---
title: "vSphere 7 10 Advanced Topics and Kubernetes"
date: 2022-06-28 12:00:00 +0000
categories: server
tags: vmware esxi vcenter vsphere
description: >- # this means to ignore newlines until "baseurl:"
  VMware vSphere is everywhere. To stay relevant, I needed to understand vSphere. I undertook a learning path, which discusses various topics for a vSphere 7 environment.

---

Resources:

* [VMware Pathfinder](https://pathfinder.vmware.com/v3/page/hands-on-labs?menu=overview)
* Lab: [Containers and Kubernetes 101 on VMware Tanzu](https://pathfinder.vmware.com/v3/activity/containers_k8s_101_hol)
* Lab: [Tanzu Mission Control - Manage Kubernetes Across Clouds: Self-guided Workshop](https://pathfinder.vmware.com/v3/activity/tmc-manage-kubernetes-self-guided)
* Lab: [VMware Tanzu Kubernetes Grid Integrated (TKGI) with Management Console Simulation](https://pathfinder.vmware.com/v3/activity/tanzu_kubernetes_lightning_grid_hol)

## Advanced vSphere

### Multi-homing

The ability to configure vCenter with multiple vNICs, this can make it accessible to multiple networks without routing.

The maximum number of vNICs per VM is 4, their roles are as follows:

* NIC 0 is the default,
* NIC 1 is reserved for vCenter HA (vCHA)
* NIC 2 and 3 are for multi-homing.

To add additional network adaptors, edit the settings of a VM.

![vmware-vm-advanced-01](/assets/images/posts/vmware-vm-advanced-01.png)

### PNID & FQDN

Primary Network Identifier (**PNID**) is how vCenter identifies itself and is formed by the Fully Qualified Domain Name (**FQDN**).

vCenter 7 changes the behaviour to whenever the FQDN is changed the PNID is also changed, therefore all custom certificates need to be regenerated. Furthermore, vCenter HA will also need to be reconfigured and if vCenter is connected to Active Directory that to will need to be rejoined.

It is recommended to create a snapshot and file based backup.

![vmware-vm-advanced-02](/assets/images/posts/vmware-vm-advanced-02.png)

### vCenter Server Profiles

Server profiles are similar to Host profiles. It allows for a standard configure between vCenter server appliances. The server profiles are written in a JSON format and can be configured with the following settings:

* Backups
* Patching
* Syslog
* Mail Server
* NTP
* DNS
* Proxy
* Firewall
* Global Permissions
* Roles
* Password Complexity
* and more...

Possible use cases for server profiles include:

* Export the configuration in a JSON file, as a backup.
* Resolving incorrect configurations in other vCenter server appliances
* Validate vCenter configurations
* Import vCenter configurations
* Central configure, which can be modified and pushed.

### Dynamic DNS

Dynamic DNS (DDNS) is a method of automatically updating a name server in the Domain Name System. vSphere once every 24 hours sends a keepalive to the DNS server updating its record.

Use cases include:

* Changing vCenter IP and want the DNS records to reflect the changes automatically
* Keepalive messages to remove the chance of DNS cleaning up stale records.

### Precision Time Protocol

Home timing options available are:

* **Manually** configuring
* **NTP** - Easier to deploy and in most cases will work fine.
* **PTP** - Requires additional hardware, but is extremely accurate (sub micro second).

Time configuration and the PTP need to be configured.

![vmware-vm-advanced-03](/assets/images/posts/vmware-vm-advanced-03.png)

Then the VM can add a new precision clock.

![vmware-vm-advanced-04](/assets/images/posts/vmware-vm-advanced-04.png)

### vSphere Cluster Quickstart

Allow to easily create a cluster with additional configurations, which include:

* vSAN
* VMKernal Ports

**Warning**: When creating a cluster all ESXi hosts will be placed into Maintenance Mode, make sure that vCenter is running outside of these ESXi hosts, otherwise it will become unavailable.

Create a new cluster, then navigate to Quick Start. The Quick Start process is split into 3 stages.

1. Cluster basics
2. Add hosts *- validates hosts*
3. Configure Cluster *- applies changes*

![vmware-vm-advanced-05](/assets/images/posts/vmware-vm-advanced-05.png)

A cluster is created in accordance with a [VMware Validated Design](https://docs.vmware.com/en/VMware-Validated-Design/index.html).

The following steps are include within the "Configure Cluster" wizard:

1. Distributed Switches
   1. Port groups
   2. vSAN
   3. vMotion
2. vMotion Traffic
3. Storage Traffic
4. Advanced Options
   1. vSphere HA
   2. vSphere DRS
   3. vSAN options
5. Claim Disks
6. Proxy Settings

![vmware-vm-advanced-06](/assets/images/posts/vmware-vm-advanced-06.png)

## Kubernetes

**Monolithic Application** describes a single-tiered software  application in which the user interface and data access code are  combined into a single program from a single platform.

**Microservices** arranges an Monolithic application as a collection of loosely-coupled services, which communicate together using APIs. The benefits of Microservices over Monolithic include:

* Resilient and easier to debug.
* Easier to allocate resources to specific components.
* Easier to deploy and/or upgrade components.
* Scalable

**Containers** include the complete runtime environment including; Applications, Dependencies, Libraries, Configuration Files etc. Benefits of using containers include:

* Share the host kernel.
* Light weight with better performance.
* Version controlled through images,
* Uses [VMware Harbor](https://docs.vmware.com/en/VMware-Harbor-Registry/services/vmware-harbor-registry/GUID-using.html) for the image registry.

VMware suggests the follow user application stack for each section of Kubernetes.

![vmware-vm-advanced-07](/assets/images/posts/vmware-vm-advanced-07.png)

* **Kubernetes Worker Nodes** are the Kubernetes Hosts, these are similar to ESXi hosts and perform the workloads.
* **Kubernetes Master Nodes** - Controls placement and HA of pods and acts as the API server.
* **Pod** is a light-weight machine that runs 1 or more containers.

Containers are temporary in nature, they can start and stop on demand due to their performance compared to VMs. Containers are also destroyed and re-created when updating, as the images are updated and redeployed.

**Supervisor cluster** - A cluster that has Kubernetes configured.

**Spherelets** are based on Kubelets and manage the ESXi host by polling for changes.

![vmware-vm-advanced-08](/assets/images/posts/vmware-vm-advanced-08.png)

**Automation**

* vSAN Storage Policies to utilise vSAN capacity.
* Network Connection.
* NSX-T Firewall Rules - microsegmentation between pods.
* DRS can balance workload across ESXi Hosts.
* DRS can move controller VMs and pods.

**Kubernetes Namespace**

They are similar to resource pools and can provide a "sandbox" environment to a team. Available resources are configured and compute can be isolated using NSX-T for microsegmentation.

Each namespace can have unique configurable permissions.

![vmware-vm-advanced-09](/assets/images/posts/vmware-vm-advanced-09.png)

**Tanzu Kubernetes Grid Cluster**

Automatic deployment of Kubernetes cluster, running Photon OS container host.

Tanzu runs VMs on an ESXi host, they do not run directly on top of vSphere.

Use cases of Tanzu:

* Open-source Kubernetes deployment
* Root level access to control plane and worker nodes
* Temporary Kubernetes cluster

---
title: "vSphere 7 04 Securing vSphere"
date: 2022-06-18 12:00:00 +0000
categories: server
tags: vmware esxi vcenter
description: >- # this means to ignore newlines until "baseurl:"
  VMware vSphere is everywhere. To stay relevant, I needed to understand vSphere. I undertook a learning path, which discusses various topics for a vSphere 7 environment.
---

Resources:

* [VMware Pathfinder](https://pathfinder.vmware.com/v3/page/hands-on-labs?menu=overview)
* Lab: [Security Getting Started](https://pathfinder.vmware.com/v3/activity/vsphere_security_getting_started)

VMware suggests the use of Identify Provider Federation, this requires Active Directory integration and supports features such as **MFA** (Multi Factor Authentication). Guidance to [setup ADFS](https://docs.vmware.com/en/VMware-vSphere/7.0/com.vmware.vsphere.authentication.doc/GUID-C5E998B2-1148-46DC-990E-A5DB71F93351.html) is available on the VMware Docs site.

## Single Sign-on

In vSphere 7.0 all "Platform Services Controller" services were consolidated into vCenter Server. - [VMware Docs](https://docs.vmware.com/en/VMware-vSphere/7.0/com.vmware.vsphere.vcenter.configuration.doc/GUID-135F2607-DA51-47A5-BB7A-56AD141113D4.html?hWord=N4IghgNiBcIA4TAFwGYHsBOBbABAZwFMMA3ASwGMC8dy0A7JDNCCIkAXyA)

The single sign-on process at a high level is:

1. User logs into vSphere web panel
2. Credentials are passed to the Platform services controllers
3. Verified against an Identity Source
4. Confirmed
5. User is able to access vCenter servers or other VMware solutions.

![vmware-secure-01](/assets/images/posts/vmware-secure-01.png)

Available Identity Sources

* **vSphere.local** - local domain.
* **Active Directory** - vSphere has to be an AD member.
* **LDAP** - no requirement for membership.
* **OpenLDAP**
* **Local Operating System Users**

### Setup Active Directory

When configuring SSO, you'll need to use a user with SSO administrator permissions.

Administration > Single Sign on > Configuration > Add

![vmware-secure-02](/assets/images/posts/vmware-secure-02.png)

To utilise Active Directory vSphere will need to join the domain, use the link provided.

![vmware-secure-03](/assets/images/posts/vmware-secure-03.png)

Provide your credentials to join the domain.

Once complete the vSphere server will need to be rebooted.

![vmware-secure-04](/assets/images/posts/vmware-secure-04.png)

After the reboot, go back to add identity source and continue to add.

![vmware-secure-05](/assets/images/posts/vmware-secure-05.png)

![vmware-secure-06](/assets/images/posts/vmware-secure-06.png)

Users can be seen via the Single Sign On > Users and Groups menu.

![vmware-secure-07](/assets/images/posts/vmware-secure-07.png)

VMware has built-in roles via the Access Control menu, or custom roles can be created.

Its recommended to use groups, instead of targeting users. This method helps with management.

## Roles

Roles are a collection of privileges.

Built-in roles include; Administrator, Read-only, No Access and more. Additional sample roles can be used as templates when creating custom roles for specific purposes.

The samples can be cloned, then edited add or remove fine-grained permissions.

![vmware-secure-08](/assets/images/posts/vmware-secure-08.png)

## Using Permissions

To add a permission to vCenter, navigate to the vCenter data center, select Permissions and click "+" to add.

When using the Propagate to children option, all servers within the data center will have this permission added to them.

![vmware-secure-09](/assets/images/posts/vmware-secure-09.png)

## VM Hardening

### Virtual Disk Encryption

[VMware Docs](https://docs.vmware.com/en/VMware-vSphere/7.0/com.vmware.vsphere.security.doc/GUID-9035D542-B76B-4244-966D-2A8D92ABF54C.html?hWord=N4IghgNiBcIKIDsDGAnAngBwC4EsD2CABAMJ4C2GBApglgM4gC+QA) for vSphere Virtual Machine Encryption Components.

Components include:

* Key Management Server (KMS) *(not required for vSphere Native Key Provider)*
* vCenter Server
* ESXi Hosts

Is it important to have multiple KMS servers, with keys being synchronised between them. Any single points of failure need to be removed because if we lose access to the KMS our disks will not be able to be unencrypted.

Add a KMS instance through the vCenter, configure tab.

![vmware-secure-13](/assets/images/posts/vmware-secure-13.png)

On the ESXi host, navigate to Configure and Security Profile.

Edit Host encryption mode and enable

![vmware-secure-11](/assets/images/posts/vmware-secure-11.png)

Now we are ready to review the VM storage policies, the VM encryption policy will enable encryption of VM virtual disks.

Editing this policy, under Policy structure enable the host based rules. Then continue to Host based services > Encryption > Use Storage Policy Component.

Any VM that has this policy assigned to it will have their disks encrypted.

![vmware-secure-10](/assets/images/posts/vmware-secure-10.png)

On a VM, right click select VM policies and Edit VM storage policies and enable the encryption policy.

This can be configured for the whole VM or on a per disk basis.

![vmware-secure-12](/assets/images/posts/vmware-secure-12.png)

### Secure Boot

The purpose is to ensure the VM has a valid operating system running on it, that has not been compromised. This is managed through certificates.

Some prerequisites include:

* The virtual machine hardware version must be 13 or later
* The virtual machine is using EFI firmware
* The operating system must support EFI secure boot

To enable EFI and secure boot, go to a VM settings, under the VM options tab and Boot Options, select EFI for firmware and check the secure boot box.

![vmware-secure-14](/assets/images/posts/vmware-secure-14.png)

### VMware Tools

VMware Tools is a set of services and components that enable several features in guest operating systems.

To ensure that VMware Tools are always the current version, the option to "check and upgrade before each power on" option is available via the VM settings.

Some upgrades will require a reboot, therefore enabling this option will save on potential downtime.

![vmware-secure-15](/assets/images/posts/vmware-secure-15.png)

### Encrypted vMotion

vMotion enables live migration of workloads from one server to another.

The contents of a VM is being transferred over the network, this may include an untrusted network, especially with long distance vMotion.

Within the VM settings, under Encryption. The administrator can configure 3 different options for Encrypted vMotion

* **Disabled** - Not encrypted.
* **Opportunistic** - If both source and destination support encryption, otherwise fail back to unencrypted.
* **Required** - Only encrypted.

![vmware-secure-16](/assets/images/posts/vmware-secure-16.png)

## ESXi Firewall

The firewall for each host can be configured via the Configure tab.

It is extremely important to know that this firewall does not control or have any impact upon VM traffic, it is only for the ESXi host itself.

![vmware-secure-17](/assets/images/posts/vmware-secure-17.png)

If a service is not required for example SSH or ESXi Shell, they can be stopped and have their startup configuration modified via the Services tab.

## Lockdown Mode

Ensure that management traffic to ESXi hosts is coming from a vCenter *(vSphere goes through vCenter)*, which gives permissions, roles and an audit trail.

ESXi hosts can be managed in other ways, such as the host client or SSH, which is direct host management bypassing vCenter.

Lockdown Mode can be configured on the ESXi host, under the Configure tab and Security Profile.

![vmware-secure-18](/assets/images/posts/vmware-secure-18.png)

Possible options include:

* **Disabled**
* **Normal** - DCUI *(Direct Console UI)* or vCenter
  * This prevents the host client and SSH options.
  * Exception users can be added for example root.
* **Strict** - vCenter only
  * DCUI is disabled (prevents physical access)
  * Exception users can be added.

Be careful with strict and ensure an exception has been added, otherwise there is potential for full system lock-out, resulting in rebuilding from scratch.

![vmware-secure-19](/assets/images/posts/vmware-secure-19.png)

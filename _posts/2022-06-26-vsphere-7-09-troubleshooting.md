---
title: "vSphere 7 09 Troubleshooting"
date: 2022-06-26 13:00:00 +0000
categories: server
tags: vmware esxi vcenter vsphere
description: >- # this means to ignore newlines until "baseurl:"
  VMware vSphere is everywhere. To stay relevant, I needed to understand vSphere. I undertook a learning path, which discusses various topics for a vSphere 7 environment.

---

Resources:

* [VMware Pathfinder](https://pathfinder.vmware.com/v3/page/hands-on-labs?menu=overview)
* Lab: [vSphere Performance Testing of ESXi Host Subsystems](https://pathfinder.vmware.com/v3/activity/vsphere_testing_hosts_hol) - Module 4 and 5.

## Restart Management Agent

Management Agents are important because vCenter uses them to communicate to the ESXi host.

Connect via SSH to an ESXi host.

```bash
/etc/init.d/hostd restart
```

```bash
/etc/init.d/vpxa restart
```

![vmware-vm-troubleshoot-01](/assets/images/posts/vmware-vm-troubleshoot-01.png)

If you need to restart all the management agents on the ESXi host, you can do so by using the following command:

```bash
services.sh restart
```

The shell can be accessed via the Direct Console User Interface (DCUI), although it needs to be enabled first.

1. Press F2 and enter the root password
2. Navigate to Troubleshooting Options
3. Select ESXi Shell
4. Press ESC twice to exit.
5. Access the ESXi Shell by pressing ALT + F1 from the ESXi console screen.

## Export System Logs

vCenter > Export System Logs

![vmware-vm-troubleshoot-02](/assets/images/posts/vmware-vm-troubleshoot-02.png)

Select the hosts and whether you want to include the vCenter Server and vSphere UI client logs.

Select the appropriate logs and export.

![vmware-vm-troubleshoot-03](/assets/images/posts/vmware-vm-troubleshoot-03.png)

This will download the log files, which can be uploaded as part of a service request.

Navigate to vSphere Client > Support > Upload File to Service Request for VMware support.

![vmware-vm-troubleshoot-04](/assets/images/posts/vmware-vm-troubleshoot-04.png)

If vCenter is down, logs can be exported directly from the ESXi host either through:

* SSH
* DCUI
* ESXi Client

Using the ESXi client, selecting Actions > Generate Support Bundle.

![vmware-vm-troubleshoot-05](/assets/images/posts/vmware-vm-troubleshoot-05.png)

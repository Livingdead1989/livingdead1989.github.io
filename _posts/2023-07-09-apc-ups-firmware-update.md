---
title: "APC UPS Firmware Update"
date: 2023-07-09 09:00:00 +0000
categories: misc
tags: apc ups firmware
description: >- # this means to ignore newlines until "baseurl:"
  In this article I will be exploring the possible ways of updating the firmware on APC Uninterruptible Power Supply units, furthermore I will demonstrate how I update remotely without having to bypass or turn off the outlet groups.
---

In this article I will be exploring the possible ways of updating the firmware on APC Uninterruptible Power Supply (UPS) units, furthermore I will demonstrate how I update remotely without having to bypass or turn off the outlet groups.

With UPS units being connected to the network for control, management and monitoring, its important to ensure they are updated with the latest firmware for the latest features, bug fixes and security updates.

In this article I will be updating two different units:

* [APC Smart-UPS SRT 5000VA](https://www.apc.com/ae/en/product/SRT5KRMXLI/apc-smartups-srt-5000va-rm-230v/)
* [APC Smart-UPS 2200VA](https://www.apc.com/ae/en/product/SMT2200RMI2U/apc-smartups-line-interactive-2200va-rackmount-2u-230v-8x-iec-c13+1x-iec-c19-outlets-smartslot-avr-lcd/)

APC offer at least 5 possible ways of updating the UPS's firmware, depending upon its model. These include:

1. Web Firmware Update *(off)*
2. NMC Firmware Update Utility
3. FTP or SCP
4. Firmware Upgrade Wizard *(off)*
5. Console / Serial *(off): note, the outlet group will power down as soon as the cable is connected*

*(off)* - Outlet groups must be powered off.

I will show how to use the NMC firmware update utility and how to transfer using FTP or SCP.

## View the UPS firmware version

Lets start by viewing the current firmware version information. Navigate to About > Network, you'll notice that we have three different modules to update for the unit.

1. Application Module
2. APC Operating System (AOS)
3. APC Boot Monitor

These three modules also form the basis of the updating process.

![ups-apc-firmware-11](/assets/images/posts/ups-apc-firmware-11.png)

## Web Firmware Update

Although I will not be using the web firmware update tool, if you wanted to utilise this you need to navigate to the Configuration tab and select Firmware Update.

First click the linked "The UPS is not off. it must be turned off to update the firmware" button, and turn off the outlet groups.

Once off, you can click the 'choose file' button and select the firmware file and then begin the firmware update.

Lastly once complete, turn on the outlet groups again.

![ups-apc-firmware-06](/assets/images/posts/ups-apc-firmware-06.png)

## NMC Firmware Update Utility

I will be using the NMC firmware update utility to perform the updates, although this tool is only available for Windows operating systems, for Linux we can use the FPT/SCP option.

Firstly Open the web interface for the UPS and navigate to About, from the UPS page take note of the SKU and from the Network page, note the model number.

The ID number is contained within the Firmware Revision, in this example below its ID 18, this ID number can be used to see if your device is supported or compatible.

![ups-apc-firmware-01](/assets/images/posts/ups-apc-firmware-01.png)

![ups-apc-firmware-02](/assets/images/posts/ups-apc-firmware-02.png)

You'll need to ensure that SSH is enabled on the UPS, this can also be an opportunity to turn off Telnet, which is on by default. This can be found via the Configuration tab, under Network and Console Settings.

By default APC UPS units have the FTP server turned on.

![ups-apc-firmware-08](/assets/images/posts/ups-apc-firmware-08.png)

Now search for the UPS on APC's website, and scroll down to the "Software and Firmware" section.

Using the Network Module Card model number, identify the correct files to download.

![ups-apc-firmware-03](/assets/images/posts/ups-apc-firmware-03.png)

Download and extract the files.

![ups-apc-firmware-04](/assets/images/posts/ups-apc-firmware-04.png)

Read the included PDF, which provides information about new features, fixes and known issues.

Run the APC application, which will ask to extract files, do this, and after they have been extracted the application will open.

Notice the Boot monitor, Operating System and Application binary files in the top right, these are the actual firmware binary files that will be transferred to the UPS.

Populate the required fields with your UPS information, as shown in the screenshot below.

![ups-apc-firmware-05](/assets/images/posts/ups-apc-firmware-05.png)

The installer should connect and update the device, the process will upload 3 files and perform 3 network management card restarts, the process can take roughly 5-10 minutes.

![ups-apc-firmware-09](/assets/images/posts/ups-apc-firmware-09.png)

Once complete, the UPS will have been updated to the latest firmware. You can now log into the web portal and review.

## FTP or SCP

**Linux users will need to utilise this option as the update utilities are for Windows only.**

*SCP relies upon SSH being enabled.*

File Transfer Protocol (FTP) or Secure Copy (SCP) can be useful for either a manual update or if you manage to break the device with a failed update.

**Windows users** - The suggested tool for SCP is to use [WinSCP](https://winscp.net/eng/index.php)

**Linux users** - SCP command

```bash
scp file.bin apc@192.168.37.109:/
```

Open a FTP or SCP connection to the network management card, then move over the correct firmware files, one at a time into the root directory. After each upload the network management card will reboot.

1. apc_hw05_bootmon_109.bin (Boot Monitor)
2. apc_hw05_aos_712.bin (APC Operating System)
3. apc_hw05_sumx_712.bin (Application)

After the final upload, we should now be able to access the web interface.

Navigating to About > Network, we can see each files version.

![ups-apc-firmware-10](/assets/images/posts/ups-apc-firmware-10.png)

I noticed that restoring from a broken device caused the Date and Time settings such as NTP to reset.
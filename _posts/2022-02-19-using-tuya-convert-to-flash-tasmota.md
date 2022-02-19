---
title: "Using Tuya-Convert to flash Tasmota"
date: 2022-02-19 22:30:00 +0000
categories: iot
tags: smart iot tuya flash tasmota rpi 
description: >- # this means to ignore newlines until "baseurl:"
  Tuya-convert is a method of flashing Tuya devices without opening the device. In this article I will be using a Raspberry Pi to flash various Tuya devices such as Gosund UP111 smart plug with power monitoring.
---



Tuya-convert is a method of flashing Tuya devices without opening the device. In this article I will be using a Raspberry Pi to flash various Tuya devices such as Gosund UP111 smart plug with power monitoring.

To complete this task a Raspberry Pi with Ethernet and Wireless support is required. Raspberry Pi models that support this are:

* RPI 3 Model B
* RPI 3 Model B+
* RPI 4 Model B
* RPI 400

Take a look at the community for supported Devices and Templates before you flash, we'll be using [templates.blakadder.com](https://templates.blakadder.com/) later in this guide.



**WARNING!!** - Use this software at your own risk!. The fact that you can flash Tasmota on your device does not mean all of its features are currently supported. Please research before purchasing to see if other users have successfully flashed the device and are able to use it fully.



If you are happy to take the risk, lets crack on!



## Flashing the MicroSD

Using the Raspberry Pi Imager tool, flash "Raspberry Pi OS Lite (32-BIT)" on to an MicroSD card.

![rpi-tuya-convert-rpi-flash-1](/assets/images/posts/rpi-tuya-convert-rpi-flash-1.png)

Using the Cog for Advanced Options, set a hostname, enable SSH and provide a password for the default account Pi.

![rpi-tuya-convert-rpi-flash-2](/assets/images/posts/rpi-tuya-convert-rpi-flash-2.png)

Then proceed by clicking the "Write" button.

Remove once complete.

![rpi-tuya-convert-rpi-flash-3](/assets/images/posts/rpi-tuya-convert-rpi-flash-3.png)



## Raspberry Pi Prep

Plug the Raspberry Pi into power and Ethernet then SSH into it.

You'll need its IP address or host name.

```bash
ssh pi@192.168.1.100
```

```bash
ssh pi@tuya-convert
```



Once logged in set your Wi-Fi country via the Raspi-Config tool

```bash
sudo raspi-config
```

Navigate to "**Localisation Options**" > "**L4 WLAN Country**", I have configured **GB** for Britain (UK).

Finish using the Raspi-Config tool and reboot.

Then log back in and make sure to update the repositories and upgrade any existing packages using the below command.

```bash
sudo apt update && sudo apt upgrade -y
```

![rpi-tuya-convert-rpi-update](/assets/images/posts/rpi-tuya-convert-rpi-update.png)

Install Git as its required to pull the Tuya-Convert repo.

```bash
sudo apt install -y git
```



## Tuya-Convert Install

Clone the [GitHub repository](https://github.com/ct-Open-Source/tuya-convert) and run the install prerequisite script.

```bash
git clone https://github.com/ct-Open-Source/tuya-convert
cd tuya-convert
./install_prereq.sh

```

![rpi-tuya-convert-install-1](/assets/images/posts/rpi-tuya-convert-install-1.png)

The script will take a minute to complete as it downloads all the prerequisites required to make Tuya-Convert work.

![rpi-tuya-convert-install-2](/assets/images/posts/rpi-tuya-convert-install-2.png)



Run Flashing script by using the following command.

Make sure to have your devices ready to complete the flash.

```bash
./start_flash.sh
```



![rpi-tuya-convert-instructions](/assets/images/posts/rpi-tuya-convert-instructions.png)

The script will prompt to terminate:

* DNSMASQ as its requires UDP port 53,
* Mosquitto as it requires TCP port 1883.

Accept both. *- I noticed that I had to re-run the script after terminating DNS*

The script will pause at the following screen

![rpi-tuya-convert-instructions-2](/assets/images/posts/rpi-tuya-convert-instructions-2.png)

The Raspberry Pi will now be broadcasting its own Wi-Fi called "vtrust-flash" **connect your mobile device** to this Wi-Fi and ensure to continue using this network even without an internet connection.

Next place the Tuya device into pairing mode or flashing mode, to place most devices into EZ mode do the following:

* **Devices with a button**, power on and hold the button for 5 seconds.
* **Devices without a button**, turn on, off, on, off, on.

You'll know when its in pairing mode as the LED or bulb will flash. Continue by pressing "Enter".

Tuya-Convert will then complete the pairing and automatically creating a locally stored backup of the device's firmware.

![rpi-tuya-convert-pairing](/assets/images/posts/rpi-tuya-convert-pairing.png)

Next a menu will appear with the following options:

* Return to stock
* Flash espurna.bin
* Flash tasmota.bin
* Quit; do nothing

I'll be flashing Tasmota, so I'll select option 2) flash tasmota.bin.

Give Tuya-Convert a few seconds to flash the device. A success message should appear and we can then flash another device or quit.

![rpi-tuya-convert-iot-flash](/assets/images/posts/rpi-tuya-convert-iot-flash.png)

The flash has been completed and we can power down the Raspberry Pi and save the MicroSD card for later use.



## Setting up Tasmota

The Tuya IoT device, flashed with Tasmota should now be broadcasting a new Wi-Fi called "Tasmota-xxxx".

![rpi-tuya-convert-tasmota-setup-1](/assets/images/posts/rpi-tuya-convert-tasmota-setup-1.png)

Once connected a pop up window will appear.

Fill the AP1 SSId and AP1 Password fields with your network Wi-Fi credentials.

![rpi-tuya-convert-tasmota-setup-2](/assets/images/posts/rpi-tuya-convert-tasmota-setup-2.png)

Save the configuration and the IoT device will restart and connect to our Wi-Fi.

You'll see the device in your DHCP server with a new address, which you can connect too.



### Tasmota Template

Now we will apply our Tasmota Template. Find the template which is applicable to your device on https://templates.blakadder.com/.

I will be using the Gosund UP111 template, copy the Configuration.

![rpi-tuya-convert-template-1](/assets/images/posts/rpi-tuya-convert-template-1.png)

Open Tasmota and navigate to "**Configuration**" > "**Configure Other**", and past the Configuration into the Template field and check the activate button.

![rpi-tuya-convert-template-2](/assets/images/posts/rpi-tuya-convert-template-2.png)

Upon saving the device will restart with the appropriate configuration, as shown in the screenshot below.

![rpi-tuya-convert-template-3](/assets/images/posts/rpi-tuya-convert-template-3.png)

This device is now ready to be added into your preferred Home Automation system, such as Home Assistant.

Finally add a password to the device to secure against unwanted tinkering. Navigate to "**Configuration**" > "**Configure Other**" and enable "**Web Admin Password**" and provide a password.



## Accurate Power Monitoring

I will briefly cover calibrating a device, although details of this process can be found on the [Tasmota GitHub](https://tasmota.github.io/docs/Power-Monitoring-Calibration/). To complete this you'll need a Kill-a-meter or calibrated multi-meter and a resistive load device, which draws a constant amount of power such as a light bulb.



**Steps**

1. Plug the kill-a-meter into your smart plug
2. Plug the load device (light bulb) into the kill-a-meter
3. Open Tasmota web UI
4. Turn on the light bulb, allow readings to stabilise.



Before are the readings from the Kill-a-meter.

![rpi-tuya-convert-kill-a-meter-readings](/assets/images/posts/rpi-tuya-convert-kill-a-meter-readings.png)



### Calibration

Commands are issued through the console on Tasmota Web UI.

**Power**

1. Verify the **Power** reading in the Web UI.
2. Adjust power offset, if required.
3. `PowerSet 9.4` *- enter your load's power rating in Watts or reading from kill-a-meter*

**Voltage**

1. Verify the **Voltage** reading in the Web UI.
2. Adjust voltage offset, if required.
3. `VoltageSet 237.7` *- enter the standard voltage or reading from kill-a-meter*

**Current**

1. Verify the **Current** reading
2. calculating current value (amperage) using this formula: `P(W)/V(V)=I(A)`
3. Adjust current offset, if required. 
4. `CurrentSet 65` - enter the calculated current in milliAmps)

**Confirm**

1. Verify the Power Factor in the Web UI is as close as possible to 1.00
2. If not 1.00, repeat the calibration process.



In the figure below the commands can be seen.

![rpi-tuya-convert-socket-console](/assets/images/posts/rpi-tuya-convert-socket-console.png)



### Before and After Calibration

Before is a figure showing the Gosund plug before calibration.

![rpi-tuya-convert-socket-stats-before](/assets/images/posts/rpi-tuya-convert-socket-stats-before.png)

Although there wasn't much of a difference between the before and after, there was a current difference which can be seen, and the Power Factor is closer to 1.0.

![rpi-tuya-convert-socket-stats-after](/assets/images/posts/rpi-tuya-convert-socket-stats-after.png)
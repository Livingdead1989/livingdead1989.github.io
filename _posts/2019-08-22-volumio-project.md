---
title:  "Volumio - Buttons, Screen, Multiroom"
date:   2019-08-22 12:00:00 +0000
categories: volumio, project, raspberry pi
---

## Aims:

* Button control for playback
* LCD display for current song information
* Multi-room playback
* Custom 3D printed enclosure

## Steps

* [Install Volumio](#install-volumio)
* [Wiring buttons](#wiring-buttons)
* [Wiring LCD](#wiring-lcd)
* [Button Plugin and Configuration](#button-plugin-and-configuration)
* [LCD Configuration](#lcd-configuration)
* [Multiroom Plugin and Configuration](#multiroom-plugin-and-configuration)
	* Server
	* Clients
* [Unoffical Plugin Installation](#unoffical-plugin-installation)

## Install Volumio

Download the Raspberry Pi image from [Volumio](https://volumio.org/get-started/) and burn on your microSD using a program such as [Etcher](https://www.balena.io/etcher/).

Once the MicroSD card has been prepared, plug it into the Raspberry Pi ensuring that it has a wired network connection, this is for the inital wireless configuration.

Allow the Raspberry Pi to finish the inital setup (2-5 minutes) then navigate to `http://volumio.local` in a browser and complete the setup wizard.

## Wiring Buttons

## Wiring LCD

## Button Plugin and Configuration

## LCD Configuration

### Install lcdproc

*[LCDproc](http://lcdproc.net/) is a piece of open source software that displays real-time system information from your Linux/BSD box on a LCD.*

```
sudo apt update
sudo apt install lcdproc
```

I choose to have the package manager maintain my configuration file.

Once installed plug in your LCD.

*[dmesg](https://en.wikipedia.org/wiki/Dmesg) is a command that prints the message buffer of the kernel. The output of this command typically contains the messages produced by the device drivers.*

```
dmesg
```

We are looking for the lcd tty, could be easier to `dmesg | grep tty`

```
[    3.437084] 20201000.serial: ttyAMA0 at MMIO 0x20201000 (irq = 81, base_baud = 0) is a PL011 rev2
```

### Turn off terminal serial connection

__This step may not need to be completed__

Normally the serial connection on the header is used to log in with a terminal. This needs to be turned off in order to allow use with the LCD (the terminal function is then unavailable — you need to use a USB keyboard or a wireless network connection to log in). Two files need to be edited:

`sudo nano /boot/cmdline.txt`

delete the references to ttyAMA0 in this line (use CTRL + W to find)

```
dwc_otg.lpm_enable=0 console=ttyAMA0,115200 kgdboc=ttyAMA0,115200 console=tty1 root=/dev/mmcblk0p2 rootfstype=ext4 elevator=deadline rootwait
```

The second the to edit is `sudo nano /etc/inittab` comment out the following:

```
T0:23:respawn:/sbin/getty -L ttyAMA0 115200 vt100
```


### Configure lcd daemon

Find the driver path by issuing `sudo find / -name lcdproc -print` then edit the configuration file, you may need to find that as well using `sudo find / -name LCDd.conf -print`.

```
sudo nano /etc/LCDd.conf
```

Change the configure to match the following:

```
[server]
#DriverPath=/usr/lib//lcdproc/
DriverPath=/usr/lib/arm-linux-gnueabihf/lcdproc
Driver=MtxOrb

ReportToSyslog=yes

Bind=127.0.0.1
Port=13666
User=nobody

Foreground=yes

[MtxOrb]
Device=/dev/ttyAMA0
#Speed=9600
Size=16x2
Tpye=lkd
Contrast=750
Brightness=1000
OffBrightness=0
hasAdjustableBacklight=yes
```

Test using `sudo LCDd`.


## Multiroom Plugin and Configuration

## Unoffical Plugin Installation

_RaspDac is a sample plugin which is not available on the offical plugin store_

1. Visit `http://volumio.local/dev`
	2. Enable SSH access
1. SSH into the Raspberry Pi
	* Username: `volumio`
	* Password: `volumio`
1. Download the plugin `wget https://github.com/JedS/Raspdac/releases/download/v0.0.3/Raspdac0.0.3.zip`
1. Create a temporary folder mkdir `./raspdac`
1. Unzip the downloaded file `miniunzip Raspdac0.0.3.zip -d ./raspdac`
1. Change directory to this folder `cd ./raspdac`
1. Install the plugins `volumio plugin install` and wait. It can last several minutes if a lot of packages need to be download. Then :
1. Remove all temporary files : cd .. `rm -Rf raspdac Raspdac0.0.3.zip`
1. In the webUI, go to installed plugins section and enable the plugin.


### References

* https://forum.volumio.org/mypiamp-project-volumio-rpi-dac-remote-lcd-t3543.html
* https://learn.adafruit.com/character-lcd-system-monitor/linux
* https://andypi.co.uk/2013/09/19/andypi-lcd-with-raspyfi/


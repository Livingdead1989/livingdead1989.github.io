---
title: "Flash D1 Mini with Tasmota"
date: 2021-01-15 22:14:00 +0000
categories: iot
tags: d1mini flash tasmota
image: 4-plug_in_d1.jpg
description: >- # this means to ignore newlines until "baseurl:"
  How to use Ubuntu 20.10 to flash Tasmota 9.2.0 to a D1 Mini using nothing more than a USB cable.
---

In this walk through I will be using Ubuntu 20.04 to flash the [Wemos D1 Mini](https://www.wemos.cc/en/latest/d1/d1_mini.html) to Tasmota 9.2.0 using a USB cable.

*Tasmota is designed to be controlled and communicate via [MQTT](http://mqtt.org/). To use it to its fullest potential you need an MQTT broker.*

**Shopping List**

* Wemos [D1 Mini](https://amzn.to/3lWvYRV) - ESP8266 Micro Controller

## Prerequisites

Start by ensuring you have python and pip installed

![check python3 and pip3 versions](/assets/images/posts/1-python_pip_install.png)

If they are not installed you can install both python 3 and pip for python 3 using the command below.

```bash
sudo apt install -y python3 python3-pip pipx
```

We will then install the esptool using pipx

```bash
pipx install esptool
pipx ensurepath
```

Next download the tasmota.bin *(english)* from the official repository on [Github](https://github.com/arendst/Tasmota/releases/tag/v9.2.0)

![download tasmota bin file](/assets/images/posts/3-download_tasmota.png)

## Flashing the D1 Mini

Plug your D1 mini into your computer using a micro USB cable.

![plug the d1 mini in to usb](/assets/images/posts/4-plug_in_d1.jpg)

Find the device by looking for a TTYUSB device, if you are unsure unplug the D1 Mini to compare listings.

Remember its: `/dev/ttyUSB0`

![find d1 mini in the dev directory](/assets/images/posts/5-find_d1_dev.png)

Change directory to esptool

```bash
cd ~/.local/lib/python3.8/site-packages/
```

You'll need to change the permission to allow execution of the `esptool.py` file, there are many ways to grant this permission.

```bash
sudo chmod a+x esptool.py
```

```bash
sudo chmod 775 esptool.py
```

Without the correct permission you have an error if you try to execute the erase.

![grant execute permission to esptool.py](/assets/images/posts/6-grant_execute_permission.png)

Erase existing flash on the device by using the command

```bash
sudo ./esptool.py --port /dev/ttyUSB0 erase_flash
```

![erase the existing d1 mini flash](/assets/images/posts/7-erase_flash.png)

Then flash the device with your tasmota.bin file you downloaded.

```
sudo ./esptool.py --port /dev/ttyUSB0 write_flash -fm dout 0x0 ~/Downloads/tasmota.bin
```

![flash tasmota to the d1 mini](/assets/images/posts/8-flash_tasmota.png)

## First Connect

If the flash was successful the device will be reset and start broadcasting its own Wi-Fi SSID, connect to the D1 wifi

![connect to d1 mini wifi](/assets/images/posts/9-d1_wifi_connect.png)

Connect to the Tasmota web gui using your browser to address <http://192.168.4.1/>

![tasmota main page](/assets/images/posts/10-d1_login_page.png)

Add your Wi-Fi credentials and save the configuration. The D1 Mini will then restart, stop broadcasting its own Wi-Fi and instead connect to your existing Wi-Fi.

![enter wifi credentials](/assets/images/posts/11-wifi_details.png)

Find the assigned IP address to the D1 Mini using your DHCP server leased addresses

![view dhcp lease to find new ip address](/assets/images/posts/12-tasmota_dhcp_lease.png)

If you do not have access to your DHCP server then you can use a network mapper such as [nmap](https://nmap.org/) to ping your network range.

```
nmap -sn 192.168.1.0/24
```

![using nmap to ping scan the network](/assets/images/posts/13-nmap_tasmota_scan.png)

Visit the IP address in your browser, from here you can configure the device further including changing the default board type from Sonoff Basic Module to Generic 18 - [Tasmota D1 Mini](https://tasmota.github.io/docs/devices/Wemos-D1-Mini/)

*WebUI **does not** and **can not** have all the features and commands implemented. For precise and complete control use Console or MQTT commands! - [Tasmota WebUI](https://tasmota.github.io/docs/WebUI/)*

![tasmota main page](/assets/images/posts/14-tasmota_main_page.png)

### Other Flashing Tools

* [**Tasmotizer**](https://github.com/tasmota/tasmotizer) - NEW flashing and firmware download tool just for Tasmota. (Windows, Linux or Mac)
* [**Tasmota PyFlasher**](https://github.com/tasmota/tasmota-pyflasher) - flashing tool intended for Tasmota. (Windows or Mac)
* [**NodeMCU PyFlasher**](https://github.com/marcelstoer/nodemcu-pyflasher) - easy to use GUI flasher based on esptool.py. (Windows or Mac)
* [**Esptool executable**](https://github.com/igrr/esptool-ck) - Esptool in executable form, no Python required. (Windows, Linux or Mac)

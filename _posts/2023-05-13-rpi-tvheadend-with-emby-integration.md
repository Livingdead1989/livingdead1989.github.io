---
title: "RPI Tvheadend with Emby integration"
date: 2023-05-13 10:30:00 +0000
categories: server
tags: media tv tvheadend emby 
description: >- # this means to ignore newlines until "baseurl:"
  Using a old Raspberry Pi to create a live TV video streamer, then integrate it with Emby.
---

In this article I will explore using a old Raspberry Pi to create a live TV video streamer, which will provide live TV streams across the network. I will achieve this by using Tvheadend software. This can then be used in conjunction with a media streamer such as Emby, Jellyfin or Plex to record or watch TV, which I will demonstrate by setting up Emby to utilise Tvheadend.

## Hardware used

* [Raspberry Pi](https://amzn.to/3BmhrDa) 2 Model B
* [Micro USB Power Supply](https://amzn.to/3MmjM7i)
* [MicroSDHC](https://amzn.to/3pzRz42) *- MicroSD High Capacity*
* [Case](https://amzn.to/42POWcF) *- I cut a hole in the case myself for the antenna cable*
* [Raspberry Pi TV HAT](https://amzn.to/3I81Evj)

## RPI Tvheadend setup

Start by flashing your microSD with Raspberry Pi OS Lite (32-bit), I like to use the [Raspberry Pi Imager tool](https://www.raspberrypi.com/software/) as it provides a list of operating systems without having to manually download.

I also configured some "Advanced options", by using the Cog icon.

* Set hostname: tvheadend
* Enable SSH
* Set username and password
* Set locale settings

![rpi-tvheadend-1](/assets/images/posts/rpi-tvheadend-1.png)

After flashing the MicroSD disconnect it and plug it in to the Raspberry Pi.

Boot the Raspberry Pi, then connect via SSH using the obtained IP address or host name.

```bash
ssh pi@192.168.1.100
```

```bash
ssh pi@tvheadend
```

Now we can start to configure the Raspberry Pi and install Tvheadend.

First start by ensuring your repositories and packages are updated by running the command below

```bash
sudo apt update && sudo apt full-upgrade -y
```

Now install Tvheadend by using apt to install the package

```bash
sudo apt install -y tvheadend
```

![rpi-tvheadend-2](/assets/images/posts/rpi-tvheadend-2.png)

During installation you will be prompted for a username and password for the Tvheadend administrator

![rpi-tvheadend-3](/assets/images/posts/rpi-tvheadend-3.png)

After the installation of Tvheadend, it can be accessed via HTTP either using IP or host name on port 9981.

```http
http://tvheadend:9981
```

We'll progress through the Welcome wizard

Set your languages

![rpi-tvheadend-4](/assets/images/posts/rpi-tvheadend-4.png)

Set Access Control, here I will be allowing all of the 192.168.1.0 255.255.255.0 address space. I have set an admin and user account credential. You can bypass the login by using * in both the username and password fields, but this is not recommended.

![rpi-tvheadend-5](/assets/images/posts/rpi-tvheadend-5.png)

Configure the tuner, look for the Sony CXD2880, which is the RPI TV HAT and set the network type to "DVB-T Network".

![rpi-tvheadend-6](/assets/images/posts/rpi-tvheadend-6.png)

Use a predefined MUXes

"**MUX** is short for Multiplex, which is technology that allows a broadcaster to compress or ‘zip’ TV content so that several channels can be distributed using the same bandwidth that used to be required for a single analogue channel." - [encodedmedia](https://www.encodedmedia.com/blog/what-is-a-mux-and-why-does-it-matter/)

Pick the digital TV transmitter closest to you, I have selected "United Kingdom: uk-Rowridge", you can find your closest by using various sites such as; [Freeview transmitter information ](https://www.freeview.co.uk/corporate/detailed-transmitter-information).

![rpi-tvheadend-7](/assets/images/posts/rpi-tvheadend-7.png)

Let the scan complete, you should find muxes and services.

![rpi-tvheadend-8](/assets/images/posts/rpi-tvheadend-8.png)

Service Mapping

We'll check all three options to allow Tvheadend to map the discovered channels, and we'll create provider and network tags as well.

![rpi-tvheadend-9](/assets/images/posts/rpi-tvheadend-9.png)

This completes the Welcome wizard and at this point restart the Raspberry Pi.

```bash
sudo shutdown -r now
```

I thought I'd take a `htop` capture at this point to ensure the Raspberry Pi 2 Model B can handle the load, as shown by the screenshot below.

![rpi-tvheadend-10](/assets/images/posts/rpi-tvheadend-10.png)

A few maintenance tasks, which you may be interested in.

**Force Scan** - navigate to Configuration > DVB Inputs > Networks > Select your network and "Force Scan".

![rpi-tvheadend-11](/assets/images/posts/rpi-tvheadend-11.png)

**Map services** - navigate to Configuration > DVB Inputs > Services and select "Map services". 

![rpi-tvheadend-12](/assets/images/posts/rpi-tvheadend-12.png)

**Remove unseen services** - navigate to Configuration > DVB Inputs > Services and select "Maintenance".

![rpi-tvheadend-13](/assets/images/posts/rpi-tvheadend-13.png)

## Emby Integration

Firstly the Live TV & DVR features in Emby **require an active premiere subscription**.

Install the TVHeadEnd plugin via the "Plugins Catalogue".

![rpi-tvheadend-14](/assets/images/posts/rpi-tvheadend-14.png)

Restart your Emby server to apply the changes.

Now navigate to "Live TV" and click "Add TV Source", Tvheadend should now be listed here.

![rpi-tvheadend-15](/assets/images/posts/rpi-tvheadend-15.png)

The next window will request the following information; server address, username and password.

Click "Save" to complete the setup.

![rpi-tvheadend-16](/assets/images/posts/rpi-tvheadend-16.png)

You'll be returned to the Live TV screen, but this time we'll see our newly added Tvheadend server.

Continue by adding a guide data source.

![rpi-tvheadend-17](/assets/images/posts/rpi-tvheadend-17.png)

I've configured my country and set the guide source to be "Emby Guide Data".

![rpi-tvheadend-18](/assets/images/posts/rpi-tvheadend-18.png)

Lastly you'll need to provide the first part of your postcode for example; SO41 or PO6. Then configure the "lineup".

![rpi-tvheadend-19](/assets/images/posts/rpi-tvheadend-19.png)

This completes the basic setup and integration, now Live TV will be available for you to enjoy.

![rpi-tvheadend-20](/assets/images/posts/rpi-tvheadend-20.png)

Some useful tips in Emby would be to cherry pick the channels you want to include or exclude via the "Channels" tab. This can be useful to trim what you see, simply check or unchecked the boxes where you see fit.

You can also select channels and see different guide data sources, add tags and set parental ratings.

![rpi-tvheadend-21](/assets/images/posts/rpi-tvheadend-21.png)

Under the advanced tab you can configure recording paths, recording settings and post processing.

![rpi-tvheadend-22](/assets/images/posts/rpi-tvheadend-22.png)

While watching a stream the Raspberry Pi 2 Model B was handling the load quite well, with quick response times, as shown by the screenshot below.

![rpi-tvheadend-23](/assets/images/posts/rpi-tvheadend-23.png)

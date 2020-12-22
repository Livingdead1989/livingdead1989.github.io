---
title: "AMD FirePro 3x3 Video Wall experiment"
date: 2020-10-30 09:00:00 +0000
categories: videowall
---



The journey started by another project failing, another solution was purchased and never really took off so we were left with 9 Samsung 32" displays and 2 video mixer matrix.

I wanted to pull all the HDMI connected down to the closer comms cabinet so I installed 9 HDMI-to-Ethernet adaptor boxes with a direct Ethernet line down to the cabinet.

I then purchased a custom 2U rack case from xcase and populated that with the following hardware:

* CPU: AMD FX 6100 Six-Core
* RAM: 16GB
* SSD: 240GB WD Green
* GFX: 3x AMD FirePro W4100

I installed a copy of **Windows 10 pro** and found that only 8 screens would ever be "active" at any given time, the other screen was also un-usable and greyed out. I wasted to many hours trying to learn why and ended up troubleshooting by running a copy of Ubuntu from a USB flash drive and to my surprise every worked straight out of the box all 9 display screens and my local screen, total of 10 screens.

I looked up the graphic card on AMD's website to find any only **Ubuntu 18.04** was supported so I had to back track from 20.04 this time installing the operating system over the Windows 10 copy.

After a quick update

```bash
sudo apt update && sudo apt upgrade -y
```

I visited AMD's website and downloaded the **Radeon Pro Software for Enterprise on Ubuntu 18.04.4** rev 20.Q3, extracted the contents and ran the install through terminal.

```bash
./amdgpu-pro-install
```

This took a couple of minutes to complete as it needed to total roughly 1GB of extra packages and looked like it crashed at 98% but it finally completed. I then restarted the system.

After restarting I found that the system didn't load into the desktop instead sat on a black screen with 

```
[ OK ] Started User Manager for UID 1000.
```

After some research and advice from a tech forum, I tried a few things such as disabling Wayland by editing the GDM3 custom.conf file and uncommenting the WaylandEnable=false

```bash
sudo nano /etc/gdm3/custom.conf

WaylandEnable=false
```

and rebooting the system, this workaround didn't work for me so I tried enabling wayland by setting it to true, but this didn't work either, I also tried using lightdm instead.

```bash
sudo apt install lightdm
```

Selecting 'lightdm' as the default display manager and rebooting the system, this resulted in a similar black screen which appears to refresh/flicker every few seconds.

At this point I'm thinking that the AMD drivers did more than expected causing all these issues. Anyways it is the end of the day so i'll continue this little adventurer tomorrow.



---



Today I will be installing a **CentOS 8** operating system and attempting the AMD W4100 drivers.

I visited AMD's website and downloaded the **Radeon Pro Software for Enterprise on RHEL  8.1/ CentOS 8.1** rev 20.Q3, extracted the contents and ran the install through terminal.

```bash
./amdgpu-pro-install
```

Again this took a while, appearing to be stuck at 38/41 but did finally complete after about 5 minutes. I restarted the system and like the Ubuntu attempt I did not get a desktop again the system just say flashing every few seconds.

```
[ OK ] Started GNOME Display Manager
```

Clearly the AMD drivers do not work as expected.



---



## Next Steps & Conclusion (for now...)



I reinstalled Ubuntu 20.04 and investigated using `xrandr` and manually configuring the `xorg.conf` with use of `xcinerama` to create the spanned 3x3 displays.

I figured out how to combine outputs into a single monitor and how to fix resolution issues using `xrandr`  but then I simply ran out of time, I would like to pickup this project again but for now we have purchased a cheap video matrix.



### Combined Outputs

HDMI-A-0 and HDMI-A-1 can be combined into one virtual display with the command:

```bash
xrandr --setmonitor NameOfDisplay auto HDMI-A-0,HDMI-A-1
```

Production looked like this:

```bash
xrandr --setmonitor Videowall auto DisplayPort-1,DisplayPort-2,DisplayPort-3,DisplayPort-2-9,DisplayPort-2-10,DisplayPort-2-11,DisplayPort-1-5,DisplayPort-1-6,DisplayPort-1-7
```

```bash
xrandr --listmonitors
```



### Using xrandr to fix resolution issues

using the `gtf` tool we can create a string for use in `xrandr`, the below example will generate a modeline string for a 1280x720 resolution at 60MHz.

```bash
gtf 1280 720 60
```

Add the custom modeline.

```bash
xrandr --newmode <string>
```

Example:

```bash
xrandr --newmode "1280x720_60.00" 74.48 1280 1336 1472 1664 720 721 724 746 -HSync +Vsync
```

Attach the new mode to a display.

```bash
xrandr --addmode DisplayPort-2-11 "1280x720_60.00"
```

Apply that mode to the output (display).

```bash
xrandr --output DisplayPort-2-11 --mode "1280x720_60.00"
```


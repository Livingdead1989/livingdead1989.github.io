---
title:  "GNS3 Ubuntu 20.04 Installation"
date:   2020-11-25 15:00:00 +0000
categories: software

---

**GNS3 Installation**

Following the official documentation on https://docs.gns3.com

```bash
sudo add-apt-repository ppa:gns3/ppa
sudo apt update  
sudo apt install gns3-gui gns3-server
```

Select `yes` for non-root users being able to run GNS3.

**IOU support**

IOU stands for IOS on Unix, this allows for Cisco IOS images to run on Unix/Linux systems.

```bash
sudo dpkg --add-architecture i386
sudo apt update
sudo apt install gns3-iou
```

**Docker Installation**

Install the prerequisites

```bash
sudo apt-get install apt-transport-https ca-certificates curl software-properties-common
```

Import the official Docker GPG key

```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
```

Add the Docker repo

```bash
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
```

Install Docker

```bash
sudo apt update
sudo apt install docker-ce
```

Add your user to the following groups, we can use the **$USER** environment variable which gives the username of the user executing.

```bash
sudo usermod -aG ubridge $USER
sudo usermod -aG libvirt $USER
sudo usermod -aG kvm $USER
sudo usermod -aG wireshark $USER
sudo usermod -aG docker $USER
```

**First Start**

On first start cancel the wizard and check that your computer is appearing as available in the "Servers summary" pane on the right side.

You can also run the GNS3 doctor via Help > GNS3 Doctor

![GNS3 Doctor](/assets/images/posts/gns3_doctor.png)

To test everything is working as expected drag a switch and a few computers into the work space and press the play button.

![GNS3 First Start](/assets/images/posts/gns3_firststart.png)

**Marketplace**

Install an appliance from the GNS3 Marketplace. The GNS3 appliances are using GNS3 recommended settings and have been thoroughly tested.

https://gns3.com/marketplace

---
title: "Rocky LXC and Podman"
date: 2023-06-24 15:00:00 +0000
categories: server
tags: podman rocky proxmox lxc 
description: >- # this means to ignore newlines until "baseurl:"
  In this article I will be deploying a Podman instance with Portainer for a management and web interface.
---

In this article I will be deploying a Podman instance with Portainer for a management and web interface. Below is a list of the software used:

* **Proxmox Virtual Environment** is a hyper-converged infrastructure open-source software.
* **Rocky Linux** is a downstream Linux distribution, complete binary-compatible release using the Red Hat Enterprise Linux operating system source code.
* **Podman** is an open source tool for developing, managing, and running containers on your Linux systems. Originally developed by Red Hat engineers along with the open source community.
* **Portainer** is an open-source application container management platform with a friendly web interface.



I have already setup a Proxmox VE server therefore I will only cover the creation of a new LXC (**L**inu**X** **C**ontainer).



## Proxmox LXC

Download the Rocky Linux 9 image from CT templates in Proxmox.

Navigate to your storage, CT templates and click Templates.

Select and download Rocky Linux 9

![1](/assets/images/posts/rocky-podman-1.png)



Create a new container (CT)

![2](/assets/images/posts/rocky-podman-2.png)



### General Tab

Set a host name and password.

Also uncheck the 'Unprivileged container' box as we need this for NFS and CIFS capabilities.

![3](/assets/images/posts/rocky-podman-3.png)



### Template Tab

Select the downloaded Rocky Linux 9 image.

![4](/assets/images/posts/rocky-podman-4.png)



### Disks Tab

Set a root disk, I have configured 32 GB.

![5](/assets/images/posts/rocky-podman-5.png)



### CPU Tab

Add additional cores, I have configured 2 vCPUs, for my requirements this will be plenty.

![6](/assets/images/posts/rocky-podman-6.png)



### Memory Tab

I will be allocating 2 GB of RAM (2048 MB), again, for my requirements this will be plenty.

![7](/assets/images/posts/rocky-podman-7.png)



### Network Tab

Its recommended to have a fixed IP address for servers, this can be achieved by setting a static address, like I have in the screenshot below or create a DHCP reservation.

![8](/assets/images/posts/rocky-podman-8.png)



### DNS Tab

Finally I have left the DNS domain and server as the host values.

![9](/assets/images/posts/rocky-podman-9.png)



Complete the container creation.

Navigate to the container Options > Features and Enable features for Nesting, NFS/CIFS and FUSE.

![17](/assets/images/posts/rocky-podman-17.png)

Now start the container and open a console to it.

![10](/assets/images/posts/rocky-podman-10.png)



## Rocky Linux

Check for package updates and upgrade them all.

I have included the commands to automatically remove no longer required packages and cleanup temporary files.

```bash
# Non-interactively checks if updates of packages are available.
dnf check-update

# Updates each package to the latest version that is both available and resolvable.
dnf upgrade -y

# Removes all "leaf" packages from the system that were originally installed as dependencies of user-installed packages, but which are no longer required by any such package.
dnf autoremove -y

# Performs cleanup of temporary files kept for repositories.
dnf clean all
```



### SSH

I will also be installing OpenSSH for remote access

```bash
dnf install -y openssh-server
```

Root is not granted access by default, therefore you'll need to edit the config file

```bash
vi /etc/ssh/sshd_config
```

Uncomment the line `PermitRootLogin` and change `prohibit-password` to `yes`.

Restart the SSHD service

```bash
systemctl restart sshd
```



## Podman

[Install podman](https://podman.io/docs/installation)

```bash
# Search the repositories
dnf search podman

# Install
dnf install podman -y
```

Start the podman service

```bash
# Enable
systemctl enable --now podman
```



## Portainer CE

[Install portainer CE](https://docs.portainer.io/start/install-ce/server/docker/linux) (Community Edition).

Create a data volume

```bash
podman volume create portainer_data

# List volumes
podman volume list
```

Create the container with elevated privileges

```bash
sudo podman run -d -p 9443:9443 --name portainer --restart=always -v /run/podman/podman.sock:/var/run/docker.sock:Z -v portainer_data:/data docker.io/portainer/portainer-ce:latest

# List containers
podman ps
```



Access the Portainer web interface via the container's IP address

```http
https://192.168.1.93:9443/
```

The welcome screen provides an option to start a new installation or restore from backup.

![14](/assets/images/posts/rocky-podman-14.png)

This completes the installation and we are ready to start deploying micro-services.

![15](/assets/images/posts/rocky-podman-15.png)

Lastly you may need to install CIFS and NFS utilities if you plan of using external Volumes.

```bash
dnf install -y cifs-utils
dnf install -y nfs-utils
```

To wrap up here is a screenshot of the LXC container system resources.

![16](/assets/images/posts/rocky-podman-16.png)

In this article I have deployed a Rocky Linux 9 LXC container on Proxmox VE, then installed Podman the open source alternative to Docker. Finally I have deployed a Portainer container for ease of management of containers and stacks (compose).



## Bonus

### Creating a new Bridge network

The built in bridge network is considered legacy and its not recommended for production system. More information about this can be read on the [Docker Docs](https://docs.docker.com/network/drivers/bridge/) site.

A major benefit of a user defined bridge is that containers can not only communicate by IP address, but can also resolve a container name to an IP address. This capability is called automatic service discovery. 



Lets start by listing all of our networks

```bash
podman network ls
```

We can view the configuration of the default `podman` bridge network, by using the inspect command

```bash
podman network inspect podman
```





Below is an example of creating a user defined bridge, which provides DNS features, a specified subnet and gateway and no IPv6 configuration.

```bash
podman network create --driver bridge --subnet 172.16.10.0/24 --gateway 172.16.10.1 customBridge
```

To attach containers to this network we need to add a network declaration in our compose/stack and state our external network.

```yaml
services:  
  myservice:
    image: image:latest
    container_name: myservice
    networks: 
      - customBridge
    ....
 
 
 networks:
  customBridge:
    external: true 
```



Some additional reading:

* https://docs.docker.com/network/network-tutorial-standalone/#use-user-defined-bridge-networks
* https://docs.podman.io/en/latest/markdown/podman-network-create.1.html

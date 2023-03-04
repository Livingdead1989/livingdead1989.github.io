---
title: "Remote Support and Management Solutions"
date: 2023-03-04 09:00:00 +0000
categories: server
tags: remote self-hosted management
description: >- # this means to ignore newlines until "baseurl:"
  In this article I will briefly cover each of the four products and provide guidance on how I got up and running in a test environment using Docker or virtual machine.
---

Below are four options for free, open-source, self-hosted remote desktop support and remote monitoring and management solutions. The first three provide desktop support features, similar to AnyDesk or TeamViewer, whereas the last option is used primarily for management but has remote desktop features.

1. [RustDesk](#RustDesk)
1. [Remotely](#Remotely)
1. [MeshCentral](#MeshCentral)
1. [RPort](#RPort)

In this article I will briefly cover each product and provide guidance on how I got up and running in a test environment using Docker or virtual machine.

## RustDesk

**Summary:** A remote desktop software, the open source TeamViewer alternative, works out of the box, no configuration required. You have full control of  your data, with no concerns about security.

**Weblink:** https://rustdesk.com/

* Project is open source: yes
* Cost: free
* Can be self-hosted: yes
* Docker support: available
* Reverse proxy support: yes
* Cross-platform support: Windows, Linux, MacOS, Android, iOS, [Web](http://web.rustdesk.com)
* Requires opening ports on the firewall: yes

### Review

The Docker images for RustDesk are very small and the resource usage is extremely low.

RustDesk clients can be installed using a modified installer to provide the all required information and the client software can be set to run as a service, therefore can be reachable without any end-user interaction. 

The remote machines can be remotely controlled through knowing the password to access the machine or through end-user acceptable using a pop-up prompt.

Agents use the desktop application to initiate remote support sessions.

Although use of a reverse proxy is not supported, you can use Streams in NPM to achieve this.

### Setup

* Documentation: https://rustdesk.com/docs/en/

The easiest and quickest way to get Rustdesk setup is through Docker Compose, below is a custom file that will create both the HBBS and HBBR servers with a shared volume and forced encryption.

```yaml
version: '3'

services:
  rustdesk-hbbs:
    container_name: hbbs
    ports:
      - 21115:21115
      - 21116:21116 # HBBR listen port 21116
      - 21116:21116/udp
      - 21118:21118
    image: rustdesk/rustdesk-server:latest
    # When hbbs runs for the first time, it will automatically generate a pair of encrypted private and public keys.
    # prohibit users without the key from establishing non-encrypted connections "-k _"
    command: hbbs -r example.com:21117 -k _
    volumes:
    # HBBS and HBBR use the data volume to ensure keys match
      - config:/root
    networks:
      - rustdesk-net
    depends_on:
      - rustdesk-hbbr
    restart: unless-stopped

  rustdesk-hbbr:
    container_name: hbbr
    ports:
      - 21117:21117
      - 21119:21119
    image: rustdesk/rustdesk-server:latest
    # prohibit users without the key from establishing non-encrypted connections "-k _"
    command: hbbr -k _
    volumes:
    # HBBS and HBBR use the data volume to ensure keys match
      - config:/root
    networks:
      - rustdesk-net
    restart: unless-stopped

networks:
  rustdesk-net:
    external: false
    
volumes:
  config:
```



## Remotely

**Summary:** A remote control and remote scripting solution, built with .NET 6, Blazor, and SignalR Core.

**Weblink:** https://github.com/immense/Remotely

* Project is open source: yes
* Cost: free
* Can be self-hosted: yes
* Docker support: yes, only modern supported way.
* Reverse proxy support: yes *(only a direct facing Caddy installation is supported)*
* Cross-platform support: Windows, Linux, MacOS
* Requires opening ports on the firewall: no
* MFA support: yes

### Review

The Docker images for Remotely are quite large at roughly 1.7 GB, the image uses a Ubuntu (22.04) as a base with average memory usage being 230 MB.

Remotely is accessible by default on port 5000 and uses a web panel. The first account to register becomes the server admin.

Remotely has a branding section, which allows for a bespoke look and feel. However, the clients will need to have been built from source with the server URL hard-coded in the apps for them to be able to retrieve the branding info.

A full range of unattended are pre-compiled and available via the "Support Portal". Instant support clients  are created as well for Windows & Linux.

Agents utilise the web portal to access remote sessions.

I had difficulties with Linux clients, most likely due to permissions, but even still I could not make a successful remote connection.

### Setup

* Documentation: https://github.com/immense/Remotely

The only modern supported way to deploy Remotely is through Docker, below is a custom file that will create the Remotely server, which will automatically restart and has an external volume for the data folder, which contains the "[appsettings.json](https://github.com/immense/Remotely/blob/master/Server/appsettings.json)" file.

```yaml
version: "2"

services:
  remotely:
    image: immybot/remotely:latest
    ports:
      - 5000:5000
    volumes:
      - config:/remotely-data
    restart: unless-stopped
      
volumes:
  config:
```



## MeshCentral

**Summary:** The open source, multi-platform, self-hosted, feature packed web site for remote device management.

**Weblink:** https://meshcentral.com

* Project is open source: yes
* Cost: free
* Can be self-hosted: yes
* Docker support: available
* Reverse proxy support: yes
* Cross-platform support: Windows, Linux, MacOS, Android
* Requires opening ports on the firewall: no

### Review

The Docker images for MeshCentral, which uses Alpine Linux and MongoDB equal roughly 1.1 GB and both servers consume roughly 500 MB of memory.

Although the interface looks dated the solution is full of features and is kept up-to-date. You can also brand the system through the "config.json" file *(there are many settings which can be added or modified in this file)*.

The server comes with pre-compiled client software and links, which can be supplied to clients for easy download.

Agents utilise the web portal to access remote sessions.

I did not have any troubles installing the agents for both Windows and Linux (Ubuntu). The WebRTC remote connection was snappy and being able to open a remote terminal session or file access was a nice feature set. When using Ubuntu 22.04 for testing I noticed that Wayland is not supported only Xorg, which can be changed at the login window.

Mobile was supported through the web browser can I was able to control both a Windows and Linux machines through my phone.

MeshCentral offers a selection of client notifications and user and group permissions, including LDAP support. This project is extremely feature rich.

### Setup

* Documentation: https://github.com/Ylianst/MeshCentral
* Plugins: https://github.com/topics/meshcentral-plugin

Below is the official Docker Compose file for MeshCentral, with some slight tweaks.

```yaml
version: "3"

services:
  mongodb:
    container_name: mongodb
    restart: always
    image: mongo:latest
    expose:
      - 27017
    networks:
      - meshcentral
    environment:
      # Database variables
      - MONGO_INITDB_ROOT_USERNAME=mongodbadmin
      - MONGO_INITDB_ROOT_PASSWORD=mongodbpasswd
    volumes:
      # MongoDB data-directory - A must for data persistence
      - db:/data/db
  
  meshcentral:
    restart: always
    container_name: meshcentral
    image: ghcr.io/ylianst/meshcentral:latest
    depends_on:
      - mongodb
    ports:
      # MeshCentral will moan and try everything not to use port 80, but you can also use it if you so desire, just change the config.json according to your needs
      - 8086:443
    networks:
      - meshcentral
    environment:
      - HOSTNAME=meshcentral.example.com
      - USE_MONGODB=true
      # Set to your reverse proxy IP if you want to put meshcentral behind a reverse proxy 
      - REVERSE_PROXY=false
      - REVERSE_PROXY_TLS_PORT=443
      # Set to true if you wish to enable iframe support
      - IFRAME=false
      # Enables self-service creation of new accounts
      - ALLOW_NEW_ACCOUNTS=false
      # Enable WebRTC - per documentation it is not officially released with meshcentral and currently experimental. Use with caution
      - WEBRTC=true
      - ALLOWPLUGINS=true
      # Allow session recording
      - LOCALSESSIONRECORDING=true
      # Minification of json, reduces traffic
      - MINIFY=true
      - NODE_ENV=production
      # Database variables
      - MONGO_INITDB_ROOT_USERNAME=mongodbadmin
      - MONGO_INITDB_ROOT_PASSWORD=mongodbpasswd
    volumes:
      # config.json and other important files live here. A must for data persistence
      - data:/opt/meshcentral/meshcentral-data
      # Where file uploads for users live
      - userfiles:/opt/meshcentral/meshcentral-files
      # Backups - this should be mounted to an external storage
      - backup:/opt/meshcentral/meshcentral-backups
      # Location for site customization files
      - web:/opt/meshcentral/meshcentral-web

networks:
  meshcentral:
    driver: bridge
  
volumes:
  db:
  data:
  userfiles:
  backup:
    external: true
  web:
```



## RPort

**Summary:** Self-hosted open source remote management solution for Windows, macOS & Linux. Intuitive, easy to use inventory management, remote access, script execution, VPN replacement, and much more.

**Weblink:** 

* Project is open source: 
* Cost: [free](https://rport.io/pricing-hosted/)
* Can be self-hosted: yes
* Docker support: no
* Reverse proxy support: yes, built-in
* Cross-platform support: Windows, Linux, MacOS
* Requires opening ports on the firewall: 

### Review

RPort was brought by RealVNC and offers a modern, pretty UI for management. There is a video guide on how to add clients, this provides two installations for Linux (Bash) and Windows (PowerShell), which will run as a client background service.

Once the agent was installed I could immanently see information about the system, such as resources, networking and update status.

Reverse tunnels are used to establish connections with remote systems, such as SSH, RDP and VNC. The protocols must be open on the client, for example RDP can be tested on a client machine using PowerShell 

```powershell
Test-NetConnection 127.0.0.1 -Port 3389
```

When creating a tunnel, there is a second layer of security through an ACL (Access Control List), the first layer requires you have valid credentials for the connection.

RPort provides its own scripting language to make complex tasks easy, its called Tacoscript.

RPort comes with a vault, which is an encrypted data, used to store credentials.

### Setup

* Documentation: https://kb.rport.io/install-the-rport-server/install-on-premises
* How to get started with RPort: https://rport.io/get-started/

1. Create a Virtual Machine

   * CPU: 1 *(runs well on a Raspberry Pi)*.
   * Memory: ~430 KB per client.
   * Disk: each host writes ~16 MB of data per day *(configurable)*.

2. First boot-up stuff

   * Update and Upgrade repositories
   * Install curl for example `sudo apt install -y curl`

3. Installation script *(any Linux system)*

   ```bash
   # Suitable for any Linux and the Raspberry Pi.
   curl -o rportd-installer.sh https://get.rport.io
   
   # Script help
   sudo bash rportd-installer.sh -h
   ```
   
   My own testing installation command disables use of two-factor authentication, as this would only be deployed in a lab scenario.

   ```bash
   sudo bash rportd-installer.sh \
    --email user@example.com \
    --client-port 8000 \
    --api-port 5000 \
    --fqdn rport.homelan \
    --port-range 20000-20050 \
    --no-2fa
   ```

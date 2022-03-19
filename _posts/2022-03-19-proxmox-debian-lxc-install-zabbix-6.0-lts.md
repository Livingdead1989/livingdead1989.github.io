---
title: "Proxmox Debian LXC Install Zabbix 6.0 LTS"
date: 2022-03-19 20:40:00 +0000
categories: server
tags: zabbix monitoring logging nms network management system mysql nginx
description: >- # this means to ignore newlines until "baseurl:"
  In this article, I will be deploying a Debian 11 LXC container on Proxmox, then installing Zabbix LTS 6.0 with MySQL MariaDB and Nginx.
---

## What is Zabbix

Zabbix is an extremely powerful enterprise-class open source and free of cost distributed monitoring solution capable of monitoring a network and the health and integrity of servers, virtual machines, applications, services, databases, websites, the cloud and more.

Zabbix natively, fully supports VMware and IoT devices with MQTT and Modbus. Able to integrate with Active Directory or OpenLDAP with SAML support for modern authentication.

Zabbix can remediate problems with trigger-able commands, scripts (JavaScript based) and actions, perform testing such as web scenarios and report upon the results.

Zabbix can be highly available and capable of distributed monitoring with use of Proxies.

Zabbix can automatically add devices, create items, triggers and graphs using Low-level discovery (LLD), Zabbix also gathers trend data each hour.

The benefit of open-source is a huge community that is actively working together, this is shown with [Zabbix Share](https://share.zabbix.com/) where community templates are hosted and can be easily added to your own environment. Another benefit is that open-source projects tend to play nicely with other great projects, such as Grafana.

## Installation

For smooth installation, check what operating system versions are supported by Zabbix before hand.

![zabbix-supported](/home/livingdead1989/Documents/website-git/Article/zabbix/images/zabbix-supported.png)

### Database Choice

The available choices are MySQL or PostgreSQL.

Advantages of MySQL:

* Less CPU consumption
* Easier to administer and tweak
* Default settings often yield better performance over PostgreSQL

Advantages of PostgreSQL:

* Operates well with complex, high-volume data environments
* Hot backup and Point in Time Restore options

### Webserver Choice

The choices are Apache or NGINX.

Apache:

* Process driven
* New thread for each request
* Allows for additional configuration on a per-directory basis

NGINX:

* Event driven
* Multiple requests within one thread
* Faster a serving static content

I will be using a Debian container with Zabbix 6.0 LTS, I have selected to use MySQL (MariaDB) due to my environment being small, its ease of use and better use of system resources. I have also chosen NGINX due to its performance over Apache, and I have no requirement for additional configurations.

### Server Requirements

My environment will only be small with no requirement for proxies. Below are suggestions from the [Zabbix documentation](https://www.zabbix.com/documentation/current/en/manual/installation/requirements).

#### Example Hardware Configurations

| Name         | CPU/Memory        | Database                               | Monitored hosts |
| ------------ | ----------------- | -------------------------------------- | --------------- |
| *Small*      | Virtual Appliance | MySQL InnoDB                           | 100             |
| *Medium*     | 2 CPU cores/2GB   | MySQL InnoDB                           | 500             |
| *Large*      | 4 CPU cores/8GB   | RAID10 MySQL InnoDB or PostgreSQL      | >1000           |
| *Very large* | 8 CPU cores/16GB  | Fast RAID10 MySQL InnoDB or PostgreSQL | >10000          |

#### Calculate Disk Space

| Parameter              | Formula for required disk space (in bytes)      |
| ---------------------- | ----------------------------------------------- |
| *Zabbix configuration* | Fixed size. Normally 10MB or less.              |
| *History*              | days x (items/refresh rate) x 24 x 3600 x bytes |
| *Trends*               | days x (items/3600) x 24 x 3600 x bytes         |
| *Events*               | days x events x 24 x 3600 x bytes               |

* **items** - number of items
* **days** - number of days to keep history
* **refresh rate** - average refresh rate of items
* **bytes** - number of bytes required to keep single value, depends on database engine, normally ~90 bytes
* **events** - number of event per second. One (1) event per second in worst-case scenario.

The total required disk space can be calculated as: **Configuration + History + Trends + Events**

#### Container Configuration

I will be creating a container with the following spec:

* **CPU**: 2 cores
* **RAM**: 2 GB
* **Disk**: 30 GB

Zabbix requires [InnoDB](https://dev.mysql.com/doc/refman/5.6/en/innodb-introduction.html) engine, which is default in MySQL and "recommends using the [MariaDB Connector/C](https://mariadb.org/download/?t=connector&p=connector-c&r=3.1.13&os=source) library for building server/proxy." *- [MariaDB Connector/C](https://mariadb.com/kb/en/about-mariadb-connector-c/) is used to connect applications developed in C/C++ to MariaDB and MySQL databases.*

It is also very important to have correct system time on the Zabbix server, so NTP is recommended.

### Create LXC container

I have placed step-by-step screenshots of the container creation below.

Provide a name, ~~un-check nesting as we will not require it~~ and provide a password for the root account.

**EDIT**: Enable nesting for Debian containers otherwise there will be a delay after console/shell/SSH login.

![zabbix-container-create-1](/home/livingdead1989/Documents/website-git/Article/zabbix/images/zabbix-container-create-1.png)

Select the Debian 11 container template.

![zabbix-container-create-2](/home/livingdead1989/Documents/website-git/Article/zabbix/images/zabbix-container-create-2.png)

Configure a 30 GB disk, I have placed this on my ZFS Solid State Disks (SSD).

![zabbix-container-create-3](/home/livingdead1989/Documents/website-git/Article/zabbix/images/zabbix-container-create-3.png)

Configured the container to have 2 CPU cores.

![zabbix-container-create-4](/home/livingdead1989/Documents/website-git/Article/zabbix/images/zabbix-container-create-4.png)

Configured the container to have 2048 MB of RAM (2 GB)

![zabbix-container-create-5](/home/livingdead1989/Documents/website-git/Article/zabbix/images/zabbix-container-create-5.png)

Set a static IP address for this container as its a server and should have a fixed address.

![zabbix-container-create-6](/home/livingdead1989/Documents/website-git/Article/zabbix/images/zabbix-container-create-6.png)

All my containers use the Proxmox configured DNS server.

![zabbix-container-create-7](/home/livingdead1989/Documents/website-git/Article/zabbix/images/zabbix-container-create-7.png)

After creation, ensure the "Start at boot" option is enabled.

![zabbix-container-create-8](/home/livingdead1989/Documents/website-git/Article/zabbix/images/zabbix-container-create-8.png)

### Software Installation

LXC use root when we login, therefore there is no requirement to prefix `sudo`.

Always start by ensuring that the repositories and packages are up to date by using the below command.

```bash
apt update && apt upgrade -y
```

Check the installed locales

```bash
locale -a
```

Add the "en_US.utf8" locale, if missing. Edit the locale.gen file

```bash
nano /etc/locale.gen
```

Uncomment the following, then save and exit.

```text
en_US.UTF-8 UTF-8
```

Generate the new locale by using the following command

```bash
locale-gen
```

Install the Zabbix repository

```bash
wget https://repo.zabbix.com/zabbix/6.0/debian/pool/main/z/zabbix-release/zabbix-release_6.0-1+debian11_all.deb

dpkg -i zabbix-release_6.0-1+debian11_all.deb

apt update 
```

Clean up

```bash
rm zabbix-release_6.0-1+debian11_all.deb
```

Install mySQL server

```bash
apt install -y default-mysql-server
```

run the Secure Installation tool

```bash
mysql_secure_installation
```

1. Current password for root
2. Switch to unix_socket authentication: **Yes**
3. Change root password: **No**
4. Remove anonymous users: **Yes**
5. Disallow root login remotely: **Yes**
6. Remove test database and access to it: **Yes**
7. Reload privilege tables now: **Yes**

Install Zabbix server, front-end and agent

```bash
apt install -y zabbix-server-mysql zabbix-frontend-php zabbix-nginx-conf zabbix-sql-scripts zabbix-agent
```

Create initial database

Log into MySQL (MariaDB)

```bash
mysql -u root -p
```

Create a database and user, granting all permissions on that database to the user.

```mysql
create database zabbix character set utf8mb4 collate utf8mb4_bin;

create user zabbix@localhost identified by 'AwCSze9v7Fitsztq';

grant all privileges on zabbix.* to zabbix@localhost;

quit; 
```

Import the Zabbix schema and initial data

```bash
zcat /usr/share/doc/zabbix-sql-scripts/mysql/server.sql.gz | mysql -u zabbix -p zabbix 
```

Provide the password for the zabbix SQL user, which in this demonstration is `AwCSze9v7Fitsztq`.

Configure the zabbix server conf with our SQL DB password. Start by editing the `zabbix_server.conf`.

```bash
nano /etc/zabbix/zabbix_server.conf 
```

then add the DB password, as shown in the example below.

```text
DBPassword=AwCSze9v7Fitsztq
```

Configure the Nginx server, this can be done via the `nginx.conf` file in the Zabbix directory.

```bash
nano /etc/zabbix/nginx.conf
```

Uncomment both the `listen` and `server_name` and change the server name

```text
listen 80;
server_name example.com; 
```

To add multiple [server names](https://nginx.org/en/docs/http/server_names.html), use a space as a delimiter and close with a semi-colon.

```text
server_name 192.168.1.10 zabbix.domain.com monitoring.yourdomain.com;
```

Restart the Zabbix services and enable services to start on boot

```bash
systemctl restart zabbix-server zabbix-agent nginx php7.4-fpm

systemctl enable zabbix-server zabbix-agent nginx php7.4-fpm 
```

Restart the server, this is to  apply any updates and locale changes.

```bash
reboot
```

Visit the Zabbix front-end

```http
http://192.168.1.10/
```

The next few steps are the welcome wizard.

The first is to set the default language, as "en_GB" is not supported my only option is "en_US".

![zabbix-install-1](/home/livingdead1989/Documents/website-git/Article/zabbix/images/zabbix-install-1.png)

The pre-requisites check should show "OK" for all components and options, if this does not then pause, resolve the issue then continue.

![zabbix-install-2](/home/livingdead1989/Documents/website-git/Article/zabbix/images/zabbix-install-2.png)

On the configure DB connection page, enter the SQL user password then continue.

![zabbix-install-3](/home/livingdead1989/Documents/website-git/Article/zabbix/images/zabbix-install-3.png)

The last page is to set a server name, default time zone and theme. I have configured my server name as "Zabbix", the timezone to London and changed from the default "Blue" theme to "Dark".

![zabbix-install-4](/home/livingdead1989/Documents/website-git/Article/zabbix/images/zabbix-install-4.png)

![zabbix-install-5](/home/livingdead1989/Documents/website-git/Article/zabbix/images/zabbix-install-5.png)

Default login credentials

* Username: Admin (capital A)
* Password: zabbix

At this point the container is using on average; 1% CPU,  212 MB RAM and 619 MB Storage.

![zabbix-after-install-resources](/home/livingdead1989/Documents/website-git/Article/zabbix/images/zabbix-after-install-resources.png)

#### Missing Locale

If you see issues regarding '*Locale for language "en_US" is not found on the web server*'.

![zabbix-install-6](/home/livingdead1989/Documents/website-git/Article/zabbix/images/zabbix-install-6.png)

Open a shell or SSH connect to your Zabbix server, then list installed locales using the command below

```bash
locale -a
```

If "en_US.utf8" is not listed then we'll need to add it. Edit the locale.gen file

```bash
nano /etc/locale.gen
```

Uncomment the following, then save and exit.

```text
en_US.UTF-8 UTF-8
```

Generate the new locale by using the following command

```bash
locale-gen
```

To apply, restart the Zabbix server.

```bash
reboot
```

## Quick Start

[Zabbix Documentation 6.0](https://www.zabbix.com/documentation/6.0/en/manual)

Within the documentation there is a section called [Quickstart](https://www.zabbix.com/documentation/6.0/en/manual/quickstart), this is a good place to start exploring Zabbix and I'd highly recommend this be the first place you visit. The Quickstart consists of:

* Login and configuring a user
* Adding a new host
* Adding a new item
* Adding a new trigger
* Receiving problem notifications (Email settings)
* Adding a new template

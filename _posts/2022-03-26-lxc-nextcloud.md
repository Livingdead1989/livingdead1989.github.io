---
title: "LXC NextCloud"
date: 2022-03-26 12:15:00 +0000
categories: server
tags: nextcloud proxmox lxc apache mysql
description: >- # this means to ignore newlines until "baseurl:"
  The purpose of this article, is to deploy a light-weight, cloud solution for friends and family. I will be creating a Proxmox VE 7 LXC, running Ubuntu 20.04 LTS and deploying NextCloud. Furthermore.
---

The purpose of this article, is to deploy a light-weight, cloud solution for friends and family. I will be creating a Proxmox VE 7 LXC, running Ubuntu 20.04 LTS and deploying NextCloud. Furthermore.

## What is NextCloud

[NextCloud](https://nextcloud.com/) offers the industry-leading, on-premises content collaboration platform. It combines the convenience and ease of use of consumer-grade solutions like Dropbox and Google Drive with security, privacy and control, while being compliant with HIPAA, GDPR and more.

NextCloud is entirely open-source, free of lockin or paywalls.

* NextCloud Files makes it easy to sync, share and collaborate on your files.
* NextCloud Talk provides screensharing, online meetings & web conferencing without data leaks.
* NextClooud Groupware makes team planning and email made easy
* NextCloud is expandable with more than 200 additional Apps and community support.

See how [NextCloud compares](https://nextcloud.com/compare/) against Office 365, OwnCloud and others.

## LXC Creation

In this demonstration I will be deploying a light-weight NextCloud instance using a Proxmox unprivileged LXC running Ubuntu 20.04 LTS. This instance will be without the integrated Office and Talk features, therefore my resources will be set to:

* CPU: 1 Core
* RAM: 1024 MB (1 GB)
* Disk: 8 GB
* Mount: 128 GB  TrueNAS disk (/mnt/data)

I have monitored this deployment and over a month the maximum memory usage was 271 MB and average CPU between 0.1 to 0.5%. The completed installation takes 1.01 GB of the 8 GB disk.

## NextCloud Installation

Always start by updating the repositories and upgrading any available packages.

````bash
sudo apt update && sudo apt upgrade -y
````

Now install the core packages required for NextCloud.

```bash
sudo apt install -y gpg

sudo apt install -y apache2 mariadb-server libapache2-mod-php7.4

sudo apt install -y php7.4-gd php7.4-mysql php7.4-curl php7.4-mbstring php7.4-intl

sudo apt install -y php7.4-gmp php7.4-bcmath php-imagick php7.4-xml php7.4-zip


```

Because I have an addition hard disk I will be creating a `nextcloud` directory and setting its permissions.

```bash
mkdir /mnt/data/nextcloud

chown -R www-data:www-data /mnt/data/nextcloud

```

### Creating the database

Now we start mySQL and login using root

```bash
sudo /etc/init.d/mysql start
sudo mysql -uroot -p

```

The following commands will create a  new database called `nextcloud` and a user called `nextcloud`.

```sql
CREATE USER 'nextcloud'@'localhost' IDENTIFIED BY 'UNxQzQn8jdzEMBDs4yKKVzwmm';
CREATE DATABASE IF NOT EXISTS nextcloud CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
GRANT ALL PRIVILEGES ON nextcloud.* TO 'nextcloud'@'localhost';
FLUSH PRIVILEGES;

```

```sql
quit;
```

### Install NextCloud

Download the NextCloud release

```bash
wget https://download.nextcloud.com/server/releases/nextcloud-23.0.0.tar.bz2
wget https://download.nextcloud.com/server/releases/nextcloud-23.0.0.tar.bz2.sha256

sha256sum -c nextcloud-23.0.0.tar.bz2.sha256 < nextcloud-23.0.0.tar.bz2

```

```bash
wget https://download.nextcloud.com/server/releases/nextcloud-23.0.0.tar.bz2.asc
wget https://nextcloud.com/nextcloud.asc

gpg --verify nextcloud-23.0.0.tar.bz2.asc nextcloud-23.0.0.tar.bz2

```

Extract the contents

```bash
tar -xjvf nextcloud-23.0.0.tar.bz2
```

Copy the contents over to the `/var/www` directory

```bash
cp -r nextcloud /var/www
```

Clean up by removing the NextCloud files

```bash
rm -R nextcloud \
nextcloud-23.0.0.tar.bz2 \
nextcloud-23.0.0.tar.bz2.asc \
nextcloud-23.0.0.tar.bz2.sha256 \
nextcloud.asc

```

### Apache Configuration

Now we will create a new Apache configuration for our NextCloud instance.

```bash
nano /etc/apache2/sites-available/nextcloud.conf
```

Copy the below and modify the `ServerName` value.

```text
<VirtualHost *:80>
  DocumentRoot /var/www/nextcloud/
  ServerName  nextcloud.networkingdream.com

  <Directory /var/www/nextcloud/>
    Require all granted
    AllowOverride All
    Satisfy Any
    Options FollowSymLinks MultiViews
    
    php_admin_value memory_limit 512M

    <IfModule mod_dav.c>
      Dav off
    </IfModule>
  </Directory>
</VirtualHost>
```

Test the Apache configuration by using the following command

```bash
apache2ctl configtest
```

Now enable the NextCloud site conf and disable the default site.

```bash
a2ensite nextcloud.conf
a2dissite 000-default.conf

```

We will be enabling a few Apache2 modes

* [Rewrite](https://httpd.apache.org/docs/2.4/rewrite/intro.html) - provides a way to do URL manipulations.
* [Headers](https://httpd.apache.org/docs/current/mod/mod_headers.html) - provides directives to control and modify HTTP request and response headers.
* [Env](https://httpd.apache.org/docs/2.4/mod/mod_env.html) - allows for control of internal environment variables that are used by various Apache HTTP Server modules.
* [Dir](https://httpd.apache.org/docs/2.4/mod/mod_dir.html) - Provides for "trailing slash" redirects and serving directory index files.
* [Mime](https://httpd.apache.org/docs/2.4/mod/mod_mime.html) - used to assign content metadata to the content selected for an HTTP response by mapping patterns in the    URI or filenames to the metadata values.

```bash
a2enmod rewrite
a2enmod headers
a2enmod env
a2enmod dir
a2enmod mime

```

Once enabled, reload the Apache2 service.

```bash
sudo systemctl reload apache2
```

### Installation wizard

```bash
chown -R www-data:www-data /var/www/nextcloud/
```

Find the IP address of the NextCloud server

```bash
ip addr
```

Visit server address and complete Installation Wizard.

```http
http://192.168.1.x/
```

## Addition Configurations

### Trusted domain

Modify the NextCloud config file

```bash
sudo nano /var/www/nextcloud/config/config.php
```

Add your trusted domains as an array, as shown below.

```php
  'trusted_domains' => 
  array (
    0 => '192.168.1.x',
    1 => 'nextcloud.networkingdream.com',
  ),
```

### Pretty URLs

Modify the NextCloud config file

```bash
sudo nano /var/www/nextcloud/config/config.php
```

Copy and overwrite the value in your configuration file, make sure to change the address.

```php
'overwrite.cli.url' => 'https://nextcloud.networkingdream.com',
'htaccess.RewriteBase' => '/',
```

Run the below occ-command to update your `.htaccess` file.

```bash
sudo -u www-data php /var/www/nextcloud/occ maintenance:update:htaccess
```

Now reload the Apache2 service.

```bash
sudo systemctl reload apache2
```

### Reverse Proxy Settings

Modify the NextCloud config file

```bash
sudo nano /var/www/nextcloud/config/config.php
```

Add your reverse proxy server information, as shown below.

```php
'trusted_proxies' => ['192.168.1.250'],
'overwriteprotocol' => 'https',
```

Now reload the Apache2 service.

```bash
sudo systemctl reload apache2
```

### Memory Cache

Install the `php-apcu` package and then  reload the Apache2 service.

```bash
sudo apt install -y php-apcu

sudo systemctl reload apache2
```

Next modify the Nextcloud config file

```bash
sudo nano /var/www/nextcloud/config/config.php
```

Setting the below value.

```php
'memcache.local' => '\OC\Memcache\APCu',
```

### SVG Support

To enable SVG support install the below packages

```bash
sudo apt install -y php-imagick libmagickcore-6.q16-6-extra
```

### Phone Region

The default [phone region](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements) is `en`, to set a new default region, modify the NextCloud config file

```bash
sudo nano /var/www/nextcloud/config/config.php
```

Set your region as shown below.

```php
'default_phone_region' => 'GB',
```

---
title:  "Installing a root/CA Certificate in Ubuntu"
date:   2020-09-08 09:33:44 +0000
categories: ubuntu
---

Given a CA certificate file `foo.crt`, follow these steps to install it on Ubuntu:

1. Create a directory for extra CA certificates in `/usr/share/ca-certificates`:

   ```
   sudo mkdir /usr/share/ca-certificates/extra
   ```

2. Copy the CA `.crt` file to this directory:

   ```
   sudo cp foo.crt /usr/share/ca-certificates/extra/foo.crt
   ```

3. Let Ubuntu add the `.crt` file's path relative to `/usr/share/ca-certificates` to `/etc/ca-certificates.conf`:

   ```
   sudo dpkg-reconfigure ca-certificates
   ```

   To do this non-interactively, run:

   ```
   sudo update-ca-certificates
   ```

In case of a `.pem` file on Ubuntu, it must first be converted to a `.crt` file:

```
openssl x509 -in foo.pem -inform PEM -out foo.crt
```
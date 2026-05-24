---
layout: post
title: "Docker Network Utilities Server"
description: "Build a Debian Docker host for self-hosted network monitoring, diagnostics and infrastructure utilities."
date: 2026-05-24
featured: false
tags:
  - self-hosted
  - docker
  - container
  - homelab
  - management
  - utility
excerpt: >
  Deploy a Debian-based Docker server with Portainer, Webmin and a
  collection of self-hosted network utilities including monitoring,
  speed testing, network discovery and rack visualisation tools.
---

This Debian 13.5 Docker host provides a central platform for self-hosted network utilities and infrastructure tooling.

## Virtual Machine

Create a fresh Virtual machine within Failover Cluster Manager.

- Name: DOCKER-NETUTIL
- Spec 
    - CPU: 8
    - RAM: 2048-8192 MB
    - Storage: 128 GB (Clustered)
- Account
    - Root: Locked
    - User: `ChangeMe`
    - Password: `ChangeMe`
- Software Selection
    - No Desktop environment
    - SSH Server
    - Standard System Utilities
- Updates completed upon restart `sudo apt update && sudo apt full-upgrade -y`


## Docker Installation

Add the Docker repository

```bash
# Add Docker's official GPG key:
sudo apt update
sudo apt install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/debian
Suites: $(. /etc/os-release && echo "$VERSION_CODENAME")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF

sudo apt update
```

Install the Docker packages

```bash
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Verify installation

```bash
sudo systemctl status docker
```

Post installation steps

Create a docker group and add your user to it.

```bash
sudo groupadd docker
sudo usermod -aG docker $USER
newgrp docker
```

## Install Portainer CE

Create a docker volume for portainer

```bash
docker volume create portainer_data
```

Run portainer

```bash
docker run -d -p 8000:8000 -p 9443:9443 --name portainer --restart=always -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer-ce:lts
```

Log into Portainer using `https://<IP Address>:9443/`

Configure your Portainer admin account
- Username: `ChangeMe`
- Password: `ChangeMe`


## Install Webmin

Add the Webmin repository using the provided script

```bash
curl -o webmin-setup-repo.sh https://raw.githubusercontent.com/webmin/webmin/master/webmin-setup-repo.sh
sudo sh webmin-setup-repo.sh
```

Update and Install 

```bash
sudo apt update && sudo apt install webmin --install-recommends
```

Log into Webmin using `https://<IP Address>:10000/`

Enable automatic server updates, nagivate to System > Software Package Updates and configure on the "Scheduled Upgrades" tab.


## Running Uptime Kuma

Within portainer create a custom template
- Title: uptime-kuma
- Description: monitoring tool
- Logo: `https://github.com/louislam/uptime-kuma/raw/master/public/icon.svg`

```yaml
services:
  uptime-kuma:
    image: louislam/uptime-kuma:2
    restart: unless-stopped
    volumes:
      - data:/app/data
    ports:
      # <Host Port>:<Container Port>
      - "3001:3001"

volumes:
  data:
```

Log into Uptime Kuma using `https://<IP Address>:3001/`

Select which database to use: `Embedded MariaDB`

Configure your Uptime Kuma admin account
- Username: `ChangeMe`
- Password: `ChangeMe`


## Running LibreSpeed

Within portainer create a custom template
- Title: librespeed
- Description: speed test
- Logo: `https://raw.githubusercontent.com/librespeed/speedtest/refs/heads/master/.logo/logo3.png`

```yaml
services:
  speedtest:
    container_name: speedtest
    image: ghcr.io/librespeed/speedtest:latest
    restart: always
    environment:
      MODE: standalone
      #TITLE: "LibreSpeed"
      #TAGLINE: "No Flash, No Java, No Websockets, No Bullsh*t"
      USE_NEW_DESIGN: "true"
      TELEMETRY: "true"
      #ENABLE_ID_OBFUSCATION: "false"
      #REDACT_IP_ADDRESSES: "false"
      PASSWORD: "${SPEEDTEST_PASS:-}"
      GDPR_EMAIL: "privacy@example.com"
      #DISABLE_IPINFO: "false"
      #IPINFO_APIKEY: "your api key"
      DISTANCE: "mi"
      #WEBPORT: 8080
    ports:
      - "80:8080" # webport mapping (host:container)
```

Environment variables can be found within the [docs](https://github.com/librespeed/speedtest/blob/master/doc_docker.md).

If telemetry has been enabled a stats page will be available at `http://your.server/results/stats.php`


## Running NetDisco

NetDisco provides network discovery, switch port mapping, MAC address tracking and device inventory using SNMP.

Within portainer create a custom template
- Title: netdisco
- Description: network management tool
- Logo: `https://www.gravatar.com/avatar/91258fea6195700a5364ed77670fa3e0?s=120&r=g&d=404`


```yaml
# https://docs.docker.com/compose/how-tos/environment-variables/envvars-precedence/
x-common-environment: &common-environment
  NETDISCO_DOMAIN: '${NETDISCO_DOMAIN:-discover}'
  NETDISCO_DB_TENANT:
  NETDISCO_DB_NAME:
  NETDISCO_DB_HOST: '${NETDISCO_DB_HOST:-netdisco-postgresql}'
  NETDISCO_DB_PORT:
  NETDISCO_DB_USER:
  NETDISCO_DB_PASS:
  NETDISCO_RO_COMMUNITY:
  PGDATABASE:
  PGHOST:
  PGPORT:
  PGUSER:
  PGPASSWORD:
  NETDISCO_CURRENT_PG_VERSION: '${NETDISCO_CURRENT_PG_VERSION:-18}'

services:

  netdisco-postgresql:
    container_name: netdisco-postgresql
    image: netdisco/netdisco:latest-postgresql
    shm_size: 128mb
    hostname: netdisco-postgresql
    # !! healthcheck is defined in the Dockerfile
    volumes:
      - postgresql:/var/lib/postgresql
    environment:
      <<: *common-environment
      NETDISCO_DB_SUPERUSER:

  netdisco-postgresql-13:
    container_name: netdisco-postgresql-13
    image: netdisco/netdisco:latest-postgresql-13
    shm_size: 128mb
    hostname: netdisco-postgresql-13
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      <<: *common-environment
      NETDISCO_DB_SUPERUSER:
    profiles:
      - with-pg-upgrade

  netdisco-db-init:
    container_name: netdisco-db-init
    image: netdisco/netdisco:latest-backend
    entrypoint: ''
    command: "/home/netdisco/bin/netdisco-env /home/netdisco/bin/netdisco-updatedb.sh"
    user: postgres
    depends_on:
      netdisco-postgresql:
        condition: service_healthy
    volumes:
      - pgdata:/var/lib/pgversions/pg13
      - postgresql:/var/lib/pgversions/new
      - config:/home/netdisco/environments
    environment:
      <<: *common-environment
      DEPLOY_ADMIN_USER: '${DEPLOY_ADMIN_USER:-YES}' # or set to NO
      NETDISCO_ADMIN_USER:

  netdisco-backend:
    container_name: netdisco-backend
    image: netdisco/netdisco:latest-backend
    hostname: netdisco-backend
    depends_on:
      netdisco-db-init:
        condition: service_completed_successfully
    init: true # run a full process manager to get signals
    volumes:
      - nd-site-local:/home/netdisco/nd-site-local
      - config:/home/netdisco/environments
      - logs:/home/netdisco/logs
    environment:
      <<: *common-environment
    dns_opt:
      - 'ndots:0'
      - 'timeout:1'
      - 'retries:0'
      - 'attempts:1'
      - edns0
      - trustad

  netdisco-web:
    container_name: netdisco-web
    image: netdisco/netdisco:latest-web
    hostname: netdisco-web
    depends_on:
      netdisco-db-init:
        condition: service_completed_successfully
    init: true # run a full process manager to get signals
    volumes:
      - nd-site-local:/home/netdisco/nd-site-local
      - config:/home/netdisco/environments
      - logs:/home/netdisco/logs
    environment:
      <<: *common-environment
      IPV: '${IPV:-4}'
      PORT:
    ports:
      - "5000:5000"
    dns_opt:
      - 'ndots:0'
      - 'timeout:1'
      - 'retries:0'
      - 'attempts:1'
      - edns0
      - trustad

volumes:
  pgdata:
  postgresql:
  nd-site-local:
  config:
  logs:
```

The default configuration is available in `netdisco/config/deployment.yml`

The web frontend is initally configured to allow unauthenticated access with full admin rights.
1. Visit the Admin > User Management menu item, create a new administrator account.
    - Username: `ChangeMe`
    - Password: `ChangeMe`
1. Edit `deployment.yml`, and set `no_auth: false` to remove this guest account and set up authenticated user access.
1. Restart the service.

## Running Speedtest-Tracker

Generate the app key by running the command and placing the output into the below compose file.

```bash
echo "base64:$(openssl rand -base64 32 2>/dev/null)"
```

Within portainer create a custom template
- Title: speedtest-tracker
- Description: speed test
- Logo: `https://raw.githubusercontent.com/linuxserver/docker-templates/master/linuxserver.io/img/speedtest-tracker-logo.png`

```yaml
services:
    app:
        image: lscr.io/linuxserver/speedtest-tracker:latest
        restart: unless-stopped
        container_name: speedtest-tracker
        ports:
            - 8080:80
            - 8443:443
        environment:
            PUID: 1000
            PGID: 1000
            APP_KEY: ""
            APP_URL: "https://speedtest-tracker.example.com"
            DB_CONNECTION: "pgsql"
            DB_HOST: "db"
            DB_PORT: 5432
            DB_DATABASE: "speedtest_tracker"
            DB_USERNAME: "speedtest_tracker"
            DB_PASSWORD: "${DB_PASS:-}"
            # Optional
            SPEEDTEST_SKIP_IPS: "true"
            SPEEDTEST_SCHEDULE: "6 */2 * * *"
            PRUNE_RESULTS_OLDER_THAN: 60
        volumes:
            - app:/config
            - /path/to-custom-ssl-keys:/config/keys
        depends_on:
            - db
    db:
        image: postgres:18
        restart: always
        environment:
            POSTGRES_DB: "speedtest_tracker"
            POSTGRES_USER: "speedtest_tracker"
            POSTGRES_PASSWORD: "${DB_PASS:-}"
            PGDATA: "/var/lib/postgresql/data/"
        volumes:
            - db:/var/lib/postgresql/data
        healthcheck:
            test: ["CMD-SHELL", "pg_isready -U speedtest_tracker"]
            interval: 10s
            retries: 5
            timeout: 5s
volumes:
  app:
  db:
```

Log into Speedtest-Tracker using `https://<IP Address>:8443/`

Configure your admin account, the default credentials are `admin@example.com` and `password`.

Change your details via the profile menu
  - Username: `ChangeMe@example.com`
  - Password: `ChangeMe`


## Running Rackula

Rackula provides rack and infrastructure visualisation for homelab and datacenter environments.

Within portainer create a custom template
- Title: rackula
- Description: rack layout
- Logo: `https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/rackula.png`

```yaml
services:
  rackula:
    image: ghcr.io/rackulalives/rackula:persist
    container_name: rackula
    ports:
      - "${RACKULA_PORT:-8181}:${RACKULA_LISTEN_PORT:-8080}"
    environment:
      - API_HOST=rackula-api
      - API_PORT=${RACKULA_API_PORT:-3001}
      - RACKULA_LISTEN_PORT=${RACKULA_LISTEN_PORT:-8080}
      # Optional: token forwarded to API for PUT/DELETE route auth
      - API_WRITE_TOKEN=${RACKULA_API_WRITE_TOKEN:-}
      - RACKULA_AUTH_MODE=${RACKULA_AUTH_MODE:-local}
      - RACKULA_ENABLE_IPV6=${RACKULA_ENABLE_IPV6:-auto}
      # DNS resolver for nginx upstream resolution (override for Kubernetes)
      - NGINX_RESOLVER=${NGINX_RESOLVER:-127.0.0.11}
    restart: unless-stopped
    stop_grace_period: 10s
    depends_on:
      rackula-api:
        condition: service_healthy

    deploy:
      resources:
        limits:
          cpus: "0.50"
          memory: 128M
        reservations:
          cpus: "0.10"
          memory: 16M

    # Security hardening (optional but recommended)
    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
    read_only: true
    tmpfs:
      - /var/cache/nginx:size=10M
      - /var/run:size=1M
      - /tmp:size=5M
      - /etc/nginx/conf.d:size=1M,uid=101,gid=101

    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"

  rackula-api:
    image: ghcr.io/rackulalives/rackula-api:latest
    container_name: rackula-api
    restart: unless-stopped
    stop_grace_period: 10s
    volumes:
      - data:/data
    environment:
      - DATA_DIR=/data
      - RACKULA_API_PORT=${RACKULA_API_PORT:-3001}
      - CORS_ORIGIN=${CORS_ORIGIN:-http://localhost:8080}
      - RACKULA_API_WRITE_TOKEN=${RACKULA_API_WRITE_TOKEN:-}
      - RACKULA_AUTH_MODE=${RACKULA_AUTH_MODE:-local}
      - RACKULA_AUTH_SESSION_SECRET=${RACKULA_AUTH_SESSION_SECRET:-}
      - RACKULA_LOCAL_USERNAME=${RACKULA_LOCAL_USERNAME:-}
      - RACKULA_LOCAL_PASSWORD=${RACKULA_LOCAL_PASSWORD:-}
      # Session hardening defaults
      - RACKULA_AUTH_SESSION_MAX_AGE_SECONDS=${RACKULA_AUTH_SESSION_MAX_AGE_SECONDS:-43200}
      - RACKULA_AUTH_SESSION_IDLE_TIMEOUT_SECONDS=${RACKULA_AUTH_SESSION_IDLE_TIMEOUT_SECONDS:-1800}
      - RACKULA_AUTH_SESSION_GENERATION=${RACKULA_AUTH_SESSION_GENERATION:-0}
      - RACKULA_AUTH_SESSION_COOKIE_SAMESITE=${RACKULA_AUTH_SESSION_COOKIE_SAMESITE:-Lax}
      # Production-safe default. Set false only for local HTTP auth testing.
      - RACKULA_AUTH_SESSION_COOKIE_SECURE=${RACKULA_AUTH_SESSION_COOKIE_SECURE:-true}
      - RACKULA_AUTH_CSRF_PROTECTION=${RACKULA_AUTH_CSRF_PROTECTION:-true}
      # Explicit insecure fallback (use only for isolated/local testing)
      - ALLOW_INSECURE_CORS=${ALLOW_INSECURE_CORS:-false}

    deploy:
      resources:
        limits:
          cpus: "0.25"
          memory: 64M
        reservations:
          cpus: "0.05"
          memory: 16M

    # Security hardening
    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
    read_only: true
    tmpfs:
      - /tmp:size=5M

    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://127.0.0.1:${RACKULA_API_PORT:-3001}/health"]
      interval: 30s
      timeout: 10s
      start_period: 5s
      retries: 3

    logging:
      driver: json-file
      options:
        max-size: "5m"
        max-file: "2"

    expose:
      - "${RACKULA_API_PORT:-3001}"

volumes:
  data:
```

Log into Rackula using `https://<IP Address>:8181/`


#### Running IT-Tools

A range of useful tools for developer and people working in IT.

Within portainer create a custom template
- Title: it-tools
- Description: it tools
- Logo: `https://github.com/CorentinTh/it-tools/raw/main/.github/logo-white.png`

```yaml
services:
    it-tools:
        container_name: it-tools
        image: corentinth/it-tools:latest
        ports:
            - 7070:80
        restart: unless-stopped   
```

Visit the IT-Tools website using `http://<IP Address>:7070/`
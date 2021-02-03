---
title:  "Docker, Docker Compose and Ansible"
date:   2020-10-30 13:31:00 +0000
categories: docker
---



I have [installed Ubuntu 20.04](https://ubuntu.com/tutorials/install-ubuntu-desktop#1-overview) within [Oracle's VirtualBox](https://itsfoss.com/install-virtualbox-ubuntu/).



## Installation


### Install Docker using the [documentation](https://docs.docker.com/engine/install/ubuntu/).

Update and Install required packages for repositories over HTTPS

```bash
sudo apt-get update

sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common
```

Add the Docker repository

```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
```

Install the Docker engine

```bash
sudo apt-get update

sudo apt-get install docker-ce docker-ce-cli containerd.io
```

Verify install

```bash
sudo docker run hello-world
```

Add user to groups

```bash
sudo usermod -aG ubridge $(whoami)
sudo usermod -aG libvirt $(whoami)
sudo usermod -aG kvm $(whoami)
sudo usermod -aG wireshark $(whoami)
sudo usermod -aG docker $(whoami)
```

<br>

### Install Docker Compose using the [documentation](https://docs.docker.com/compose/install/).

Docker Compose required Docker to be installed, so make sure you have it installed and working before installing Compose.

#### Linux

Download

```bash
sudo curl -L "https://github.com/docker/compose/releases/download/1.27.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

Apply an execute permission

```bash
sudo chmod +x /usr/local/bin/docker-compose
```

Verify

```bash
docker-compose --version
```

<br>

### Install Ansible using the [documentation](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html#installing-ansible-on-ubuntu).

Update and Install required packages then add the Ansible PPA

```bash
sudo apt-get update
sudo apt-get install software-properties-common

sudo apt-add-repository --yes --update ppa:ansible/ansible
```

Install Ansible

```bash
sudo apt-get install ansible -y
```

<br>

---

<br>

## Docker Basics

**Pulling an image from the docker repository**

```bash
docker pull debian
```

We can download images for use in our Docker environment using the [Docker Hub](https://hub.docker.com/search?image_filter=official&type=image), the example above will download the latest Debian image. We can download different versions by using supported tags such as:

```bash
docker pull debian:jessie
```

We can list our images by using the command.

```bash
docker images
```

<br>

**Creating a Docker container**

```bash
docker run -it debian
```

We can use the run command to create a new container, using the switches -i for interactive and -t for TTY (terminal). 

There are many different options, use the [Docker docs for more](https://docs.docker.com/engine/reference/commandline/run/).

<br>

**Entering a container**

Using the exec command we can enter a running container

```bash
docker exec -it mycontainer /bin/bash
```

<br>

**Listing containers**

To list all active container processes use the command

```bash
docker ps
```

To list all containers use an `-a` switch

```bash
docker ps -a
```

<br>

**Changing the container - Saving**

We can save a container as a new image using the command

```bash
docker commit mycontainer mynewcontainer:1.0
```

<br>


**Stop and Start Docker containers**

We can use their container ID or Names

```bash
docker stop 4afe090d56a8
docker start wizardly_tereshkova
```


<br>


**Removing Images**

We can prune images that are not being used by using the command

```bash
docker image prune
```

We can also remove an image by using the command, remember :jessie is the tag

```bash
docker image rm debian:jessie
```


<br>


**Removing Containers**

To remove an Container use the following command:

```
docker rm <CONTAINER ID / NAME>
```

You can also query all containers and remove using that, <u>be careful with this!</u>

```bash
docker rm `docker ps -q -a`
```


<br>


**Using a Dockerfile**

A Dockerfile is a set of instructions used when building an image.

```yaml
# Ubuntu
FROM ubuntu

# Update and Install net-tools, allowing use of the 'ifconfig' command
RUN apt-get update && apt-get install net-tools -y
```

* [Best practices for writing Dockerfiles](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/) provided by Docker Inc.
* [Dockerfile examples](https://docs.docker.com/engine/reference/builder/#dockerfile-examples) provided by Docker Inc.



<u>A quick example of how to a use a Dockerfile</u>

1. make a directory for your container files. `mkdir mycontainer`

2. move into that directory. `cd mycontainer`

3. create your Dockerfile. `nano Dockerfile`

4. add the above example and save

5. build your image `docker build -t mycontainer:1.0 .`

6. view your new image. `docker images`

   

<br>


**Building an Image**

When building an image you need a Dockerfile and Context. A context is a location either a PATH on your local filesystem or a URL to a git repository.

This command will build from the current directory using the default Dockerfile called "Dockerfile".

```bash
docker build .
```

Some common flags include:

* using the -f flag we can point to a Dockerfile anywhere in your file system

    ````bash
    docker build -f /home/user/Documents/Dockerfile-production .
    ````

* using the -t flag save image using a repository and tag

    ````bash
    docker build -t user/myapp:1.0 .
    ````



<br>


## Docker Compose

Docker Compose allows you to configure two or more containers that can work together, for example a web server with a SQL database with communication between them while still running in isolation.

A Docker Compose file can also state networks created and data stores or volumes.

By default a network is created between all containers within the docker-compose file.



![docker-compose-dockerfile](/assets/images/posts/docker-compose-dockerfile.png)


<br>


**Create a Docker-compose file**

Make a docker-compose.yml file by using your preferred editor`nano docker-compose.yml`.

Add the contents of a docker-compose, an extremely minimal example is:

```yaml
version: "3.8"
services:
  # creates a container called web
  web:
    # build is the location of the Dockerfile
    build: ./web
    # which image to use
    image: nginx
    
  # creates a container called db
  db:
    image: redis
```

*You can use a YAML linter to check your code, examples include; [YAML Lint](http://www.yamllint.com/), [YAML Validator](https://jsonformatter.org/yaml-validator) or a built-in one from your IDE*


<br>


**What Version to use?**

In the above sample there is a version number, this relates to your Docker Engine and Compose file format

[Compose file version 3 reference](https://docs.docker.com/compose/compose-file/)

Run `docker version` on your host machine and match your version number to the compose file format

```
Client: Docker Engine - Community
 Version:           19.03.13
```

| Compose file format | Docker Engine release |
| ------------------- | --------------------- |
| 3.8                 | 19.03.0+              |


<br>


**Validate your YAML**

Validate and view the compose file

```bash
docker-compose config
```


<br>


**Create the containers**

While still in the same directory we can use the `docker-compose up` command to bring both containers online.

```bash
docker-compose up
```

We can see the containers running by using the process command

```bash
docker ps
```


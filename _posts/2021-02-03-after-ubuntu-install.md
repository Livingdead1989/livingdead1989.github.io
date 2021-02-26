---
title: "After Ubuntu Install"
date: 2021-02-03 10:15:00 +0000
categories: desktop
description: >- # this means to ignore newlines until "baseurl:"
  Software and Tweaks to apply after a fresh Ubuntu installation.
---

All of the steps I take when I first install Ubuntu 20.04 and 20.10, this includes software used for projects, personal development, work and gaming.



## First Update, Upgrade & Utilities Install

```bash
sudo apt update && sudo apt upgrade -y

sudo apt install -y \
apt-transport-https \
net-tools \
ca-certificates \
curl \
gnupg-agent \
software-properties-common
```



## Before Software Install

### Extra Repositories



**Typora**

```bash
wget -qO - https://typora.io/linux/public-key.asc | sudo apt-key add -

sudo add-apt-repository 'deb https://typora.io/linux ./'
```



**Sublime**

```bash
wget -qO - https://download.sublimetext.com/sublimehq-pub.gpg | sudo apt-key add -

echo "deb https://download.sublimetext.com/ apt/stable/" | sudo tee /etc/apt/sources.list.d/sublime-text.list
```



**Etcher**

```bash
echo "deb https://deb.etcher.io stable etcher" | sudo tee /etc/apt/sources.list.d/balena-etcher.list

sudo apt-key adv --keyserver hkps://keyserver.ubuntu.com:443 --recv-keys 379CE192D401AB61
```



## Software Install

### APT

```bash
sudo apt update 

sudo apt install -y \
flameshot \
kazam \
remmina \
typora \
sublime-text \
flatpak \
gnome-software-plugin-flatpak \
gdebi \
putty \
git \
gnome-tweaks \
dconf-editor \
synaptic \
transmission \
clementine \
handbrake \
gparted \
freecad \
balena-etcher-electron
```



### Flatpak Repositories



**Flat Repository**

```bash
flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
```



**Plex Client**

```bash
flatpak remote-add --if-not-exists plex-media-player https://flatpak.knapsu.eu/plex-media-player.flatpakrepo
```



### Flatpak Install

```bash
flatpak install plex-media-player tv.plex.PlexMediaPlayer
```



### Snap

```bash
snap install \
gimp \
inkscape \
libreoffice \
obs-studio \
vlc \
audacity \
picard \
kdenlive \
krita
```

Grant MusicBrainz Picard removable media access (including Network)

```bash
snap connect picard:removable-media
```



### Other



**Microsoft Visual Studio Code**

```
https://code.visualstudio.com/docs/?dv=linux64_deb
```

*You'll need to edit the /etc/apt/sources.d/vscode.list to remove the extra arch types*



**Microsoft Edge Browser - *Preview/Beta***

```
https://www.microsoftedgeinsider.com/en-gb/
```



**Microsoft Teams**

```
https://www.microsoft.com/en-gb/microsoft-teams/download-app
```



**Discord**

```
https://discord.com/api/download?platform=linux&format=deb
```



**Etcher**

```
https://www.balena.io/etcher/
```



## Jekyll Development Install

Install Ruby and prerequisites

```bash
sudo apt install -y \
ruby-full \
build-essential \
zlib1g-dev
```

Avoid installing RubyGems package as root

```bash
echo '# Install Ruby Gems to ~/gems' >> ~/.bashrc
echo 'export GEM_HOME="$HOME/gems"' >> ~/.bashrc
echo 'export PATH="$HOME/gems/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

Install Jekyll

```bash
gem install jekyll bundler
```



## Ardunio Development Install

```bash
sudo apt install -y \
python3 \
python3-pip \
fritzing
```



**Ardunio IDE** - download and run install.sh

```
https://downloads.arduino.cc/arduino-1.8.13-linux64.tar.xz
```



## VM and Networking Installs

```bash
sudo apt install -y \
wireshark \
virtualbox
```



**Docker and Docker-Compose Installation**

```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
```

```bash
sudo apt update

sudo apt install -y \
docker-ce \
docker-ce-cli \
containerd.io
```

```bash
sudo curl -L "https://github.com/docker/compose/releases/download/1.27.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

sudo chmod +x /usr/local/bin/docker-compose
```

```bash
sudo usermod -aG ubridge $(whoami)
sudo usermod -aG libvirt $(whoami)
sudo usermod -aG kvm $(whoami)
sudo usermod -aG wireshark $(whoami)
sudo usermod -aG docker $(whoami)
```



**Portainer Container Install**

```bash
docker volume create portainer_data

docker run -d -p 9000:9000 --name=portainer --restart=always -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer-ce
```



**GNS3 Installation**

```bash
sudo add-apt-repository ppa:gns3/ppa
sudo dpkg --add-architecture i386
sudo apt update                                
sudo apt install gns3-gui gns3-server gns3-iou
```



**Packet Tracer**

```
https://www.netacad.com/portal/resources/packet-tracer
```



## Gaming Installs

```bash
sudo add-apt-repository ppa:lutris-team/lutris
```



```bash
sudo apt update

sudo apt install -y \
steam
lutris
```



## 3D Printer

I have a Snapmaker printer

```
https://github.com/Snapmaker/Luban/releases/latest
```



## After Software Install



**Sublime Text**

* Enter License Key
* Install Package Control
* Install Package
  * Sass
  * HTMLBeautify
  * Emmet



**VLC**

* Subtitles / OSD
  * Show media title on video start: no



## Misc Tasks

* Sign into Firefox
* Configure any Proxy and Install certificates
* PuTTY sessions
  * `mkdir -p ~/.putty/sessions/`
  * Copy files into created folder
* Configure Git
  * Credential Helper (default 15m)
    * `git config --global credential.helper cache`
  * Clone & add remote repositories
    * `git clone URL`
    * `git remote add REPONAME USER@SERVER:/LOCATION`
* Gnome Tweaks
  * General:
    * Animations: off
  * Appearance:
    * Applications: Yaru-dark
  * Extensions:
    * Desktop icons:
      * Personal folder on desktop: off
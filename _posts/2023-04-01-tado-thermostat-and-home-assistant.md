---
title: "Tado Thermostat and Home Assistant"
date: 2023-04-01 15:00:00 +0000
categories: homeautomation
tags: home automation tado 
description: >- # this means to ignore newlines until "baseurl:"
  I will be deploying a Tado Wireless Thermostat v3 starter kit and integrating it into Home Assistant for free flexible automations.
---

[Tado](https://www.tado.com/) is a popular smart home product manufacturer, who facilitate energy saving and maximising comfort in the home. They offer the following products *(Amazon affiliate links below)*:

* [Wired](https://amzn.to/40MZFDA) / [Wireless](https://amzn.to/3MqLDnt) Thermostat
* [Radiator valves](https://amzn.to/42VjYAH)
* [Air Conditioning or Air-to-Air Heat Pump](https://amzn.to/3Gaw6Ee)

Tado works with most gas boilers and can be [installed](https://www.tado.com/gb-en/installation) yourself or by a professional. Some popular manufacturers are below with [many more supported](https://support.tado.com/en/articles/3387245-is-tado-compatible-with-my-boiler).

* Worcester *(Bosch)*
* Ideal
* Vaillant
* Baxi
* Viessmann

One of the most common ways in which thermostats communicate with boilers is through simple relay (on/off) connections. Tado is compatible with almost all boilers that support relay connections.

Although Tado does have a subscription plan for their "[Auto-Assist](https://www.tado.com/gb-en/auto-assist)" technology, this automates the Open Window Detection and Geo-fencing features. Auto-Assist brings additional features such as Energy IQ and Care & Protect, the table below shows the difference.

|                         | Free               | with Auto-Assist      |
| ----------------------- | ------------------ | --------------------- |
| Geo-fencing             | Push Notifications | Automated             |
| Open Window Detection   | Push Notifications | Automated             |
| Care & Protect          | Not included       | Included              |
| Energy IQ               | Not included       | Included              |
| Air Comfort             | Included           | Included              |
| Smart Schedule          | Included           | Included              |
| Insightful Reports      | Included           | Included              |
| Weather Adaptation      | Included           | Included              |
| App updates             | Included           | Included              |
| Smart Home Integrations | Included           | Included              |
| Pricing                 | Free               | In-App purchase (Sub) |

At the time of writing the subscription costs either £34.99 per year or £3.99 per month.

## Why bother?

With rising energy costs it makes sense to make the home smarter and reap the cost rewards. This year I plan on developing my smart home in a cost-conscious fashion that doesn't rely on internet access and allows me to take the products when I move properties.

This article will cover my installation the Tado Smart Wireless Thermostat v3, which I sourced from [Ebay](https://www.ebay.co.uk/sch/i.html?_nkw=tado%20wireless%20thermostat). I will be integrating this with my Home Assistant instance to allow for cross-system automation and to allow me to automate the Geo-fence options without having a Auto-Assist subscription.

[Compatibility Guide for the Smart Thermostat V3+](https://cdn.brandfolder.io/607DGEMS/at/v92ptv27qx9ks87g9j5tbpg/Smart_Thermostat_-_Compatibility_Guide_-_EN_-_V21.pdf) *(PDF)*

##  Thermostat Installation

To start install the Tado app on your device, in my case my iPhone. This should be [the first step](https://www.tado.com/all-en/installation/wireless-smart-thermostat) as we will need to create our account and then start the installation process which is extremely easy and beautifully intuitive, this covers the intial pairing of your new Tado devices and providing you with step by step guidance on removing your old thermostat and installing the new Tado one.

Below are some steps taken by myself to remove the old Drayton LP522 thermostat. Start by providing this information to the Tado installation assistant.

![tado-thermostat-install-1](/assets/images/posts/tado-thermostat-install-1.jpg)

**ENSURE ALL POWER IS TURNED OFF TO YOUR BOILER BEFORE ATTEMPTING FURTHER STEPS.**

The app will then provide step-by-step guidance on removing the old device. Its recommended to take photographs of the existing step, just in-case you need to reverse the steps at a later date.

![tado-thermostat-install-2](/assets/images/posts/tado-thermostat-install-2.jpg)

In the Tado kit they provide useful sticky labels, which can be written on and stuck to the correct cables, which is all explained in the app. Below is a photograph of the labels for my setup.

<img src="/assets/images/posts/tado-thermostat-install-3.jpg" alt="tado-thermostat-install-3" style="zoom:50%;" />

After removing the old unit, applying the sticky labels you'll need to then install the new Tado unit. Then you'll continue back in the app, where it prompted for me to use the jumper cables provided to connect the COMs to the Live. Because I purchased my kits pre-loved from Ebay I was missing a jumper cable, therefore I used some 2-core electrical cable I had from another project.

<img src="/assets/images/posts/tado-thermostat-install-4.jpg" alt="tado-thermostat-install-4" style="zoom:50%;" />

With guidance from the app, you will now transfer the other cables into the Tado unit, replace the cover and switch the power back on. Lastly you'll pair the receiver, which completes the installation process.

*As my existing thermostat had longer cables I will need to tuck, trim or sheave the exposed strands.*

![tado-thermostat-install-5](/assets/images/posts/tado-thermostat-install-5.jpg)

## Software Configuration

The first thing I did in my Tado app was to create my schedules for the central heating and hot water. I opted for the typical work week and weekend option and set the temperatures, I also switched over to "Away" mode tab and increased the temperature to 9 Celsius from the default 5.

I did the same task for the hot water.

<img src="/assets/images/posts/tado-thermostat-install-6.png" alt="tado-thermostat-install-6" style="zoom:50%;" />

The next screenshot shows that I do not have the Auto-Assist subscription as it is "Inactive", I also turned off the Geofencing and Open Window Detection options as I will handle this through Home Assistant to have increased flexibility and avoid having the subscription plan.

Some benefits of doing the automation through Home Assistant over the Auto-Assist is 

* Geo-fencing based on devices without having to add them into the Tado app, all "people" added can view, control and install Tado devices,
* One less tracking app,
* Cross system automation,
* More flexibility and control.

<img src="/assets/images/posts/tado-thermostat-install-7.png" alt="tado-thermostat-install-7" style="zoom:50%;" />

### Home Assistant

I added the Tado integration to your home assistant instance. You'll need to log in using your Tado account credentials.

![tado-thermostat-install-8](/assets/images/posts/tado-thermostat-install-8.png)

Once complete, this will add all your devices and then you can create dashboards or automation based on these devices.

I kept it simple to start with by adding a basic dashboard entry with all the newly discovered devices. This is likely to change over time as I integrate and develop the home more.

<img src="/assets/images/posts/tado-thermostat-install-9.png" alt="tado-thermostat-install-9" style="zoom:67%;" />

To automate the Geo-fencing aspect I created two crude automation called "Boiler - Away mode" and "Boiler - Home mode".

![tado-thermostat-install-10](/assets/images/posts/tado-thermostat-install-10.png)

These automation trigger when family mobile devices either enter or leave the home zone. I added conditions to avoid triggering if a family member is already home. Lastly I included a notification during initial testing, which later gets disabled.

For the home mode automation, the condition is if the Tado system is already in "Away" mode.

<img src="/assets/images/posts/tado-thermostat-install-11.png" alt="tado-thermostat-install-11" style="zoom:80%;" />

I have included the YAML code for both automation below.

Home mode

```yaml
alias: Boiler - Home mode
description: Turn on heating when family iPhones enter the home area.
trigger:
  - platform: device
    device_id: 
    domain: device_tracker
    entity_id: device_tracker.<REMOVED>
    type: enters
    zone: zone.<REMOVED>
  - platform: device
    device_id: <REMOVED>
    domain: device_tracker
    entity_id: device_tracker.<REMOVED>
    type: enters
    zone: zone.<REMOVED>
condition:
  - condition: device
    device_id: <REMOVED>
    domain: climate
    entity_id: climate.<REMOVED>
    type: is_preset_mode
    preset_mode: away
action:
  - device_id: <REMOVED>
    domain: climate
    entity_id: climate.<REMOVED>
    type: set_preset_mode
    preset_mode: home
mode: single
```

Away mode

```yaml
alias: Boiler - Away mode
description: Turn off heating when family iPhones are out of the home area.
trigger:
  - platform: device
    device_id: <REMOVED>
    domain: device_tracker
    entity_id: device_tracker.<REMOVED>
    type: leaves
    zone: zone.<REMOVED>
  - platform: device
    device_id: <REMOVED>
    domain: device_tracker
    entity_id: device_tracker.<REMOVED>
    type: leaves
    zone: zone.<REMOVED>
condition:
  - condition: device
    device_id: <REMOVED>
    domain: device_tracker
    entity_id: device_tracker.<REMOVED>
    type: is_not_home
  - condition: device
    device_id: <REMOVED>
    domain: device_tracker
    entity_id: device_tracker.<REMOVED>
    type: is_not_home
action:
  - device_id: <REMOVED>
    domain: climate
    entity_id: climate.<REMOVED>
    type: set_preset_mode
    preset_mode: away
mode: single
```

I expect for my Tado device list to grow to include the TRVs and that my Home Assistant instance will develop. Currently I am extremely happy with the Tado devices and my implementation. The complete setup remains family friendly yet provides stats and the power of automation, which will yield cost savings over the old system.


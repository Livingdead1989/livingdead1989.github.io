---
layout: post
title: "TP-Link Omada Wi-Fi Calling"
description: "Configure TP-Link Omada Wi-Fi Calling profiles for UK mobile networks."
date: 2026-07-04
featured: true
tags:
  - tp-link
  - omada
  - wifi
  - wifi-calling
  - networking
excerpt: >
  Configure TP-Link Omada Wi-Fi Calling for UK mobile providers by creating carrier profiles for the required ePDG servers.
---

TP-Link Omada supports Wi-Fi Calling by recognising your mobile provider's ePDG (Evolved Packet Data Gateway) servers. If your firewall restricts outbound traffic, you'll also need to allow the IP addresses used by your provider's ePDG servers.

## Find your provider's MNC

Each UK mobile network has one or more Mobile Network Codes (MNCs).

Visit [MCC-MNC](https://www.mcc-mnc.com/) and search for "United Kingdom" to view the latest MCC/MNC assignments.

---

## Major UK Wi-Fi Calling ePDG domains

### o2

```text
epdg.epc.mnc002.mcc234.pub.3gppnetwork.org
epdg.epc.mnc010.mcc234.pub.3gppnetwork.org
epdg.epc.mnc011.mcc234.pub.3gppnetwork.org
```

### Vodafone

```text
epdg.epc.mnc003.mcc234.pub.3gppnetwork.org
epdg.epc.mnc015.mcc234.pub.3gppnetwork.org
epdg.epc.mnc089.mcc234.pub.3gppnetwork.org
```

### EE - T-Mobile 

```text
epdg.epc.mnc030.mcc234.pub.3gppnetwork.org
epdg.epc.mnc031.mcc234.pub.3gppnetwork.org
epdg.epc.mnc032.mcc234.pub.3gppnetwork.org 
```

### EE - Orange

```text
epdg.epc.mnc033.mcc234.pub.3gppnetwork.org
epdg.epc.mnc034.mcc234.pub.3gppnetwork.org
```

### Three - Hutchison

```text
epdg.epc.mnc020.mcc234.pub.3gppnetwork.org
```

---

## Find the IP addresses used for Wi-Fi calling

> Mobile operators can change the IP addresses behind these hostnames at any time.

1. Go to [nslookup](https://www.nslookup.io/) and lookup `epdg.epc.mnc123.mcc234.pub.3gppnetwork.org`. Replace mnc123 with the MNC of the provider.
1. Add the listed IPs to your firewall rules.

---

## Configure Wi-Fi Calling in Omada

### Create a Wi-Fi Calling profile

Create a Wi-Fi profile

1. Navigate to Device Config > AP > Wi-Fi Calling
1. Create a new Wi-Fi calling profile
1. Enter the carrier name and identified domains

### Assign the profile to an SSID

1. Navigate to Network Config > Network Settings > WLAN
1. Edit your SSID
1. Expand Advanced Settings
1. Enable Wi-Fi Calling and select your profile

---

## Verify Wi-Fi Calling

1. Connect your phone to Wi-Fi.
1. Ensure Wi-Fi Calling is enabled on the device.
    - **Android**: Settings > Network & Internet > Internet > Wi-Fi calling.
    - **iOS**: Settings > Phone > Wi-Fi Calling.
1. Wait a few moments for the phone to register with your carrier.
1. Confirm that the Wi-Fi Calling indicator appears on the handset.
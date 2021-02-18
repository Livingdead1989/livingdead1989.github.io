---
title: "Temp with MQTT HomeAssistant"
date: 2021-02-15 16:00:00 +0000
categories: iot
description: >- # this means to ignore newlines until "baseurl:"
  Using a D1 Mini with a PIR and DHT11 to capture motion, temperature and humidity and push this data into our Home Assistant instance.
---

## MQTT Broker

MQTT uses a Publish Topic in which other devices can Subscribe to, for example our temperature sensor has a topic of "temp" and publishes the current value of "23C" to our MQTT broker, other devices can subscribe to "temp" and the MQTT broker .

Install "Mosquitto" add-on from within Home Assistant, we will then edit the configuration providing a username and password.

```
logins:
  - username: mqttuser
    password: supersecretpassword
anonymous: false
customize:
  active: false
  folder: mosquitto
certfile: fullchain.pem
keyfile: privkey.pem
require_certificate: true

```

Download [MQTT Explorer](https://mqtt-explorer.com/) then connect to Home Assistant to test everything is working so far.

![Connecting to MQTT using MQTT Explorer](/assets/images/posts/mqtt-explorer-connect.png)

## Tasmota Confguration

I will be configuring a Wemos D1 Mini with a PIR (HC-SR501), Temperature and Humidity (DHT-11) sensors. I would not recommend these sensors for production or accurate use as the DHT-11 is quite inaccurate with its measurements, the DHT-22 sensor is more accurate but not as cheap.

**Shopping List**


* Wemos [D1 Mini](https://amzn.to/3t3ifHq) - ESP8266 Micro Controller
* [DHT-11](https://amzn.to/2KUQRdG) - Temperature and Humidity Sensor (or DHT-22)
* [HC-SR501](https://amzn.to/3abrNYe) - PIR Motion Sensor
* *Optional*

  * [DHT-22](https://amzn.to/3prQWEE) - Temperature and Humidity Sensor
  * [Sensor Modules and Accessories Kit](https://amzn.to/3pr9mW3) - Sensor Kit
  * [Starter Kit](https://amzn.to/3iQlYDz) - Contains jumper wires, breadboard and sensors

*If you have not flashed your device with Tasmota take a look at [Flash D1 Mini with Tasmota](https://networkingdream.com/iot/flash-d1-mini-with-tasmota/)* article.

Once you have your flashed Wemos D1 Mini, you'll need to change the module type to Generic (18), to do this go to **Configuration** > **Configure Module** from the webGUI.

* Module Type: Generic (18)
* D2 GPIO4: Switch - 2
* D1 GPIO5: DHT11

Now configure your MQTT broker settings within **Configuration** > **Configure MQTT**

* Host: Home Assistant IP
* User: mqttuser
* Password: supersecretpassword

## Wiring Diagrams

**Wemos D1 Mini Temperature and Humidity (DHT-11)**

![D1 Mini and DHT-11 Wiring Diagram](/assets/images/posts/d1-dht11-wiring-diagram.png)

**Wemos D1 Mini Motion (HC-SR501 PIR)**

![D1 Mini and HC-SR501 Wiring Diagram](/assets/images/posts/d1-hcsr501-wiring-diagram.png)

I used a breadboard to connect my D1 Mini and the sensors as they can share power and ground.

## Adding Home Assistant Entities

We can use MQTT Explorer to view the Tasmota device as it is now communicating with our MQTT broker.

We'll need this to find the correct values of our sensors so we can create our Home Assistant entities.

![MQTT Explorer Tasmota Topic](/assets/images/posts/mqtt-explorer.png)

The state_topic is copied from the Topic in MQTT Explorer and the value_template is created using what type of data we want, in this case JSON, from our DHT11 sensor with the value of Temperature. The availability_topic and payload_available content is standard device availability configuration.

Temperature & Humidity using a DHT-11

[Home Assistant - Sensor](https://www.home-assistant.io/integrations/sensor/)

```yaml
sensor:      
  - platform: mqtt
    state_topic: 'tele/tasmota_2EE804/SENSOR'
    name: 'temperature'
    unit_of_measurement: '°C'
    value_template: '{{ value_json.DHT11.Temperature }}'
    availability_topic: 'tele/tasmota_2EE804/LWT'
    payload_available: Online
    payload_not_available: Offline
    device_class: temperature
    
  - platform: mqtt
    state_topic: 'tele/tasmota_2EE804/SENSOR'
    name: 'humidity'
    unit_of_measurement: '%'
    value_template: '{{ value_json.DHT11.Humidity }}'
    availability_topic: 'tele/tasmota_2EE804/LWT'
    payload_available: Online
    payload_not_available: Offline
    device_class: humidity
```

Motion Detection using a [HC-SR501](https://components101.com/hc-sr501-pir-sensor)

[Home Assistant - Binary Sensor](https://www.home-assistant.io/integrations/binary_sensor/)

```yaml
binary_sensor:
  - platform: mqtt
    state_topic: "tele/tasmota_2EE804/SENSOR"
    name: "D1 Motion"
    value_template: '{{ value_json.Switch2 }}'
    availability_topic: 'tele/tasmota_2EE804/LWT'
    payload_available: Online
    payload_not_available: Offline
    device_class: motion
```

Check your configuration and restart Home Assistant, on your overview dashboard you'll now see three additional sensors.

By default this information will be polled every 5 minutes.

![Home Assistant Badges - Motion, Temperature and Humidity](/assets/images/posts/ha-badges.png)

I would suggest using a [DHT-22](https://amzn.to/3u7iRfQ) sensor over the DHT-11 as it is vastly more accurate.


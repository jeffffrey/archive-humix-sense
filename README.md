## Overview

Welcome to project `Humix`, a robot platform that based on IoT architecture. The goal is to allow people to create their own unique __recipes__ by combining sensors/actuators on Raspberry Pi with a variety of software API on the cloud.

For more Information of Project Humix, please refers to [Project Humix Overview](http://www.slideshare.net/jeffffreyliu/project-humix-overview)

## Get the code 

As simpel as

```
git clone https://github.com/project-humix/humix-sense.git
```

## Initialize sensor modules

Humix sense come with a set of sensor modules, including NeoPixel-based eye sensors, temperature sensor, NFC sensor, text to speech modules, etc. These modules are optional and you only need all these when you want to build a full-fledged Humix. So here I would offer two options

### Option1 : Install all modules

```
cd humix-sense
git submodule init
git submodule update
```

### Option2 : Mimimal Installation

At minimal, you should at least manually install the humix-sense-speech module for the humix project to be useful. 

```
cd humix-sense/controls
git clone https://github.com/project-humix/humix-sense-speech.git
```


## Start Humix

There is a startup script that launch most modules

```
cd humix-sense
./bin/start_all.sh
```

## Troubleshooting

Ideally the NATS bus will be running and the humix sense controller would monitor the bus for delivering data to IoT foundation. But if there is something wrong, you can check `/tmp/humix*.log` to see what might went wrong. 


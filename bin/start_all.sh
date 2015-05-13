#!/bin/bash

export WORKDIR=`pwd`
LOGFILE=/tmp/humix.log


cd $WORKDIR
./bin/gnatsd-arm & 

/usr/local/bin/node-11 $WORKDIR/controller/controller.js >> $LOGFILE &

/usr/local/bin/node-11 $WORKDIR/controls/humix-sense-speech/TTS.js >> $LOGFILE &

/usr/local/bin/node-10 $WORKDIR/controls/humix-sense-eye/eye.js >> $LOGFILE &

/usr/local/bin/node-11 $WORKDIR/controls/humix-sense-blinking/start.js >> $LOGFILE &

/usr/local/bin/node-11 $WORKDIR/controls/humix-sense-temp/temp.js >> $LOGFILE &

/usr/local/bin/node-11 $WORKDIR/controls/humix-sense-cam/cam.js >> $LOGFILE &

sudo python controls/humix-sense-bright/bright.py

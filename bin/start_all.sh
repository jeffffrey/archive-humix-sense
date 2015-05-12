#!/bin/bash

export WORKDIR=`pwd`

#echo $WORKDIR

cd $WORKDIR
./bin/gnatsd-arm & 

/usr/local/bin/node-11 $WORKDIR/controller/controller.js &

/usr/local/bin/node-11 $WORKDIR/controls/humix-sense-speech/TTS.js &

/usr/local/bin/node-10 $WORKDIR/controls/humix-sense-eye/eye.js &

/usr/local/bin/node-11 $WORKDIR/controls/humix-sense-blinking/start.js &



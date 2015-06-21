#!/bin/bash

export WORKDIR=`pwd`
LOGFILE=/tmp/humix.log
LOGFILE_HRM=/tmp/humix_hrm.log

cd $WORKDIR

# Start local NATS server
./bin/gnatsd-arm -V >> $LOGFILE 2>&1  & 


# Launch individual modules
/usr/local/bin/node-11 $WORKDIR/controller/controller.js >> $LOGFILE &

#/usr/local/bin/node-11 $WORKDIR/controls/humix-sense-speech/TTS.js >> $LOGFILE &

/usr/local/bin/node-10 $WORKDIR/controls/humix-sense-eye/eye.js >> $LOGFILE &

/usr/local/bin/node-11 $WORKDIR/controls/humix-sense-blinking/start.js >> $LOGFILE &

/usr/local/bin/node-11 $WORKDIR/controls/humix-sense-temp/temp.js >> $LOGFILE &

#/usr/local/bin/node-11 $WORKDIR/controls/humix-sense-cam/cam.js >> $LOGFILE &

#/usr/local/bin/node-11 $WORKDIR/controls/humix-sense-nfc/start.js >> $LOGFILE &

/usr/local/bin/node-11 $WORKDIR/controls/humix-sense-bright/start.js >> $LOGFILE &

cd $WORKDIR/controls/humix-sense-hrm 
/usr/local/bin/node-11 ./start.js >> $LOGFILE_HRM &

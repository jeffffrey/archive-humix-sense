#!/bin/bash

#export WORKDIR=`pwd`

#echo $WORKDIR

cd $WORKDIR/bin
./gnatsd-arm & 

cd $WORKDIR/controller
node controller.js &

cd $WORKDIR/controls/humix-sense-speech/
node TTS.js &


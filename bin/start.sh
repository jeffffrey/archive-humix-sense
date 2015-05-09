#!/bin/bash

export WORKDIR=/home/liuch/workspace/humix/humix-sense/


cd $WORKDIR/bin
./gnatsd-arm &

cd $WORKDIR/controller
node controller.js &

cd $WORKDIR/controls/humix-sense-speech/
node TTS.js &


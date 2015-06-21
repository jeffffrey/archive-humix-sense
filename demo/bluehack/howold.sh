#!/bin/bash

raspistill -o demo.jpg
aplay ./howold.wav
lp -d Canon_CP910_ipp demo.jpg


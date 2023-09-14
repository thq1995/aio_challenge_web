#!/bin/bash
source ./ai_env/bin/activate
echo $(date)
sudo mongod --dbpath /media/t-dragon/Storage/Development/Data
echo "done"
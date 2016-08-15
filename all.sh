#!/bin/sh
clear

echo "Testing will start after 3 seconds!!"

sleep 3

casperjs test SingleSort.js --xunit=reports/SingleSort.xml
echo "1st case finished!"

sleep 1

casperjs test AlwaysEditing.js --xunit=reports/AlwaysEditing.xml
echo "2nd case finished!"

sleep 1
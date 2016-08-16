#!/bin/sh
clear
echo off
echo "Testing will start after 3 seconds!!"

sleep 3

# casperjs test SingleSort.js --xunit=reports/SingleSort.xml
# echo "1st case finished!"

# sleep 1

# casperjs test AlwaysEditing.js --xunit=reports/AlwaysEditing.xml
# echo "2nd case finished!"

# sleep 1

for file in ./*.js
do
	
	baseN=$(basename $file)
	echo "${baseN}"

	if [ "$baseN" = "foo.js"  -o  "$baseN" = "common.js"  -o  "$baseN" = "template.js" ];then
	#bash comparision version: [[ $baseN = "foo.js"  ||  $baseN = "common.js"  ||  $baseN = "template.js" ]], see http://mywiki.wooledge.org/BashFAQ/031
		echo "skip "${baseN}
	else
		#echo ${baseN%.*}

		casperjs test ${baseN} --xunit=reports/${baseN%.*}.xml	

		echo 'sleep 1 second'
		sleep 1

	fi
done
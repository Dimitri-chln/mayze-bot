#!/bin/bash

echo "--------------------------------------------------"  > out.log
echo "               Starting the bot...                " >> out.log
echo "--------------------------------------------------" >> out.log
echo ""                                                   >> out.log

npm start 2>&1 | ts "[%Y-%m-%d %H:%M:%S]" >> out.log

loop = 1
while [$loop -eq 1]
do
	echo ""                                                   >> out.log
	echo "--------------------------------------------------" >> out.log
	echo "          The bot crashed. Restarting...          " >> out.log
	echo "--------------------------------------------------" >> out.log
	echo ""                                                   >> out.log

	npm start 2>&1 | ts "[%Y-%m-%d %H:%M:%S]" >> out.log
done

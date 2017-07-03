#!/bin/bash

S_HOME=`dirname $0`

if [[ $S_HOME != /* ]]
then
	S_HOME=./$S_HOME
fi

if [ -e "$S_HOME/../index.js" ]
then
	REQUIRE=$S_HOME/../index.js
elif [ -e "$S_HOME/../sle/index.js" ]
then
	REQUIRE=$S_HOME/../sle/index.js
elif [ -e "$S_HOME/../lib/node_modules/sle/index.js" ]
then
	REQUIRE=$S_HOME/../lib/node_modules/sle/index.js
else
	echo "Unable to find index.js"
	echo "Debug info"
	echo "  \$0: $0"
	echo "  \$S_HOME: $S_HOME"
	exit 1
fi

node --require $REQUIRE $*

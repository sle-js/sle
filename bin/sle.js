#!/bin/bash

REAL_PATH_NAME=`realpath $0`
SCRIPT_HOME=`dirname $REAL_PATH_NAME`

node --require ${SCRIPT_HOME}/../index.js $*

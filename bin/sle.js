#!/bin/bash

_realpath() {
    [[ $1 = /* ]] && echo "$1" || echo "$PWD/${1#./}"
 }

REAL_PATH_NAME=`_realpath $0`
SCRIPT_HOME=`dirname $REAL_PATH_NAME`

node --require ${SCRIPT_HOME}/../index.js $*

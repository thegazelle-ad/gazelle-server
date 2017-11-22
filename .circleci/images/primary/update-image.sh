#!/bin/bash
TAG=$1

NAME="thegazelle/gazelle-main-circleci-primary:$TAG"

sudo docker build -t $NAME . && sudo docker push $NAME

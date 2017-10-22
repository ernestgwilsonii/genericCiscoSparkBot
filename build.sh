#!/bin/bash

DOCKER_REPOSITORY_USERNAME=ernestgwilsonii

# Build the docker image
echo " "
echo "Building a new Cisco Spark Bot Docker image"
echo "###########################################"
docker build -t ernestgwilsonii/genericciscosparkbot:v1.0.0 .
echo "done"

# Display the results
echo " "
echo "Docker image created locally:"
echo "REPOSITORY                              TAG                 IMAGE ID            CREATED                  SIZE"
docker images | grep $DOCKER_REPOSITORY_USERNAME/genericciscosparkbot
echo " "


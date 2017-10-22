#!/bin/bash

docker run --name genericCiscoSparkBot -e SPARK_TOKEN='YourBotTokenHere' -d ernestgwilsonii/genericciscosparkbot:v1.0.0
docker ps
docker exec -it genericCiscoSparkBot bash


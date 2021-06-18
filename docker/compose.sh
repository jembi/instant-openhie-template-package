#!/bin/bash

composeFilePath=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

if [ "$1" == "init" ]; then
    docker create --name file-import-helper -v template-file-config-component-volume:/app busybox
    docker cp "$composeFilePath"/importer/volume/template-file-config-component/index.js file-import-helper:/app
    docker cp "$composeFilePath"/importer/volume/template-file-config-component/config.json file-import-helper:/app
    docker rm file-import-helper

    docker-compose -p instant -f "$composeFilePath"/docker-compose.yml -f "$composeFilePath"/importer/docker-compose.config.yml up -d
elif [ "$1" == "up" ]; then
    docker-compose -p instant -f "$composeFilePath"/docker-compose.yml up -d
elif [ "$1" == "down" ]; then
    docker-compose -p instant -f "$composeFilePath"/docker-compose.yml -f "$composeFilePath"/importer/docker-compose.config.yml stop
elif [ "$1" == "destroy" ]; then
    docker-compose -p instant -f "$composeFilePath"/docker-compose.yml -f "$composeFilePath"/importer/docker-compose.config.yml down
    docker volume rm template-file-config-component-volume
else
    echo "Valid options are: init, up, down, or destroy"
fi

#!/bin/bash

composeFilePath=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

if [ "$1" == "init" ]; then
    # Simulating a pre-existing instant component. In this example the component is running with some default config settings.
    # This helper container is needed to transfer files into a shared volume. A volume can only have data added if it is connected to a container.
    docker create --name file-import-helper -v template-file-config-component-volume:/app busybox
    # Copy in demo server file
    docker cp "$composeFilePath"/importer/volume/template-file-config-component/index.js file-import-helper:/app
    # Start up template file config container and add the OpenHIM channel
    docker-compose -p instant -f "$composeFilePath"/docker-compose.yml -f "$composeFilePath"/importer/docker-compose.config.yml up -d

    # Sleep for 20 seconds to give user time to check logs for default config start up. `docker logs -f template-component`
    # and to make a request to the unconfigured server `curl http://localhost:5001/template -H "Authorization: Custom test"`
    printf "\nSleep for 20s. Check logs and default server response...\n"
    sleep 20
    printf "Adding new template file config\n"

    # Add new config file to "existing" component
    docker cp "$composeFilePath"/importer/volume/template-file-config-component/config.json file-import-helper:/app
    # Remove helper container - this container is only used to attach the shared volume for file transfer
    docker rm file-import-helper

    # Restart exisitng component to use new config
    docker restart template-component
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

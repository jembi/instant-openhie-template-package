#!/bin/bash

composeFilePath=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

if [ "$1" == "init" ]; then
    # Step 1: Load Preset Config into external volume
    # -----------------------------------------------

    ## In this example, the component is already running with its default config.
    ## The command below starts up the template file config container, imports the OpenHIM channel, and opens up the ports to localhost for development
    docker-compose -p instant -f "$composeFilePath"/docker-compose.yml -f "$composeFilePath"/importer/docker-compose.config.yml -f "$composeFilePath"/docker-compose.dev.yml up -d

    # Step 2: Pause Script to allow for User Interaction
    # --------------------------------------------------

    ## Sleep for 30 seconds to give user time to  make a request to the unconfigured server:
    printf "\nSleep for 30s. Check default server response...\ncurl http://localhost:5001/template -H 'Authorization: Custom test'\n"
    sleep 30
    printf "Adding new template file config\n"

    # Step 3: Add our new config
    # --------------------------

    ## Add new config file to "existing" component
    docker cp "$composeFilePath"/importer/volume/template-new-file-config-component/config.json template-new-file-config-component:/home/node/app

    ## Restart exisitng component to use new config
    docker restart template-new-file-config-component
elif [ "$1" == "up" ]; then
    docker-compose -p instant -f "$composeFilePath"/docker-compose.yml -f "$composeFilePath"/docker-compose.dev.yml up -d
elif [ "$1" == "down" ]; then
    docker-compose -p instant -f "$composeFilePath"/docker-compose.yml -f "$composeFilePath"/importer/docker-compose.config.yml -f "$composeFilePath"/docker-compose.dev.yml stop
elif [ "$1" == "destroy" ]; then
    docker-compose -p instant -f "$composeFilePath"/docker-compose.yml -f "$composeFilePath"/importer/docker-compose.config.yml -f "$composeFilePath"/docker-compose.dev.yml down
    docker volume rm instant_template-file-config-component-volume
else
    echo "Valid options are: init, up, down, or destroy"
fi

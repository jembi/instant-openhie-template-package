#!/bin/bash

k8sMainRootFilePath=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

if [ "$1" == "init" ]; then
    # Step 1: Start up the template component with default config
    # -----------------------------------------------------------

    ## In this example, the component is already running with its default config.
    ## For consistency, we keep the OpenHIM Channel config import for the importer section.
    ## Therefore, we won't be able to access the template component until the importer section runs
    kubectl apply -k $k8sMainRootFilePath

    # Step 2: 
    # Import config API and new file

    ## The next k8s bash script will start up the k8s OpenHIM Channel config importer as well as the
    ## new template component which includes a configMap with a new config.json file.
    bash "$k8sMainRootFilePath"/../importer/k8s.sh up
elif [ "$1" == "up" ]; then
    kubectl apply -k $k8sMainRootFilePath
elif [ "$1" == "down" ]; then
    kubectl delete deployment covid19-surveillance-mapper-deployment
elif [ "$1" == "destroy" ]; then
    bash "$k8sMainRootFilePath"/../importer/k8s.sh clean
    kubectl delete -k $k8sMainRootFilePath
else
    echo "Valid options are: up, down, or destroy"
fi

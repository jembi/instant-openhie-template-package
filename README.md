# instant-openhie-template-package

An Instant OpenHIE Template Package from which to build custom packages.

## Template purpose

This template package aims to demonstrate two Instant OpenHIE Package config methods namely config file and API.

### API config

To demonstrate a scripted API configuration, we'll be configuring a new channel in the OpenHIM.
This config is done using our [importer docker container](https://hub.docker.com/r/jembi/instantohie-config-importer).
This container does a check to see whether the service is running before running a config NodeJS script which handles the API interactions. In the case of the OpenHIM, the container checks the OpenHIM Core heartbeat is successful before running the config.
The NodeJS script reads the `openhim-import.json` file and POSTs the data to the OpenHIM `/metadata` endpoint.
You can confirm the import was successful by logging into the OpenHIM Console and inspecting the Channels page.

### File config

To demonstrate adding new file config, we will be starting up a simple node http server listening on port 9090.
This server will respond with a message when it receives a request. The message returned depends on the state of the server's config file.
When the server starts up, it will have *no config file* and will return the default message **"Default server config"** when triggered.
After 30 seconds pause (to allow for a quick user inspection), the script will add the config file to the shared volume and restart the container.

**During the 30 second script pause**, run the following command to see the default server message.

```sh
curl http://localhost:5001/template -H "Authorization: Custom test"
```

Then run the curl command again after the script completes to see the configured server response.

## Prerequisites

- Fast uncapped internet connection
- Linux operating system
- Docker & Docker Compose installed
- Kubernetes installed

## Setup

1. Clone the [template package git repo](https://github.com/jembi/instant-openhie-template-package.git).
1. Download the [deploy script](https://github.com/openhie/instant/releases/download/0.0.4/deploy.sh) and move it into an easily accessible place (preferably in the parent directory of the template package directory).
1. Open up a terminal and navigate to the directory containing the `deploy.sh` script.
1. Change the file permissions of `deploy.sh` to allow it to be executed

    ```sh
    chmod 700 deploy.sh
    ```

1. Get the relative path from your working directory to this template package.
1. Run the command below to initialise Instant OpenHIE with our custom package template.

    Docker:

    ```sh
    ./deploy.sh init -t docker template -c="<file/path>"
    ```

    Kubernetes:

    ```sh
    ./deploy.sh init -t k8s template -c="<file/path>"
    ```

    >  Substitute in your file path into the `-c` flag

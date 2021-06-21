# instant-openhie-template-package

An Instant OpenHIE Template Package from which to build custom packages.

## Prerequisites

- Fast uncapped internet connection
- Linux operating system
- Docker & Docker Compose installed
- Kubernetes installed

## Setup

1. Download the [deploy script](https://github.com/openhie/instant/releases/download/0.0.4/deploy.sh) and move it into an easily accessible place (preferably in the parent directory of the template package directory).
1. Open up a terminal and navigate to the directory containing the `deploy.sh` script.
1. Change the file permissions of `delpoy.sh` to allow it to be executed

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

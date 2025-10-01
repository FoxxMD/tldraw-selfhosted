# tldraw for selfhosting

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker Pulls](https://img.shields.io/docker/pulls/foxxmd/tldraw)](https://hub.docker.com/r/foxxmd/tldraw)

A minimal implementation of [tldraw](https://tldraw.dev) based on the starter/templates [simple-sever](https://github.com/tldraw/tldraw/tree/main/templates/simple-server-example) and [sync-cloudflare](https://github.com/tldraw/tldraw/tree/main/templates/sync-cloudflare).

This implementation offers:

* basic whiteboard with [tldraw sync](https://tldraw.dev/docs/sync) for multiplayer/realtime collaboration
* Unique Rooms, IE `mydomain.com/my-tldraw-room`, backed by file storage
* User uploads backed by file storage
* A development environment with devcontainer
* All assets selfhosted (no cdn)
* Docker image and docker compose example for quick deployment

## Usage and tldraw License

[Docker image](https://hub.docker.com/r/foxxmd/tldraw) available at

```
docker.io/foxxmd/tldraw:latest
```

Use the [`compose.yaml`](/compose.yaml) docker compose file to start tldraw:

```
docker compose up -d
```

tldraw will be served at `http://localhost:5858`

## Production and tldraw License

When deployed on `localhost` with the above published image, or when developing with devcontainer, this implementation is usable.

If you deploy tldraw-selfhosted to an SSL-enabled TLD (`https://mydomain.com`) then **you will need to build it with a valid tldraw [license](https://tldraw.dev/community/license).** Hobby licenses, which are free, are available by [applying on tldraw's site.](https://tldraw.dev/get-a-license/hobby)

To build the image with your license use [`compose.build.yaml`](/compose.build.yaml) and provide your license to the build-arg `VITE_TLDRAW_LICENSE_KEY`.

```sh
git clone https://github.com/FoxxMD/tldraw-selfhosted tldraw-selfhosted
cd tldraw-selfhosted
# fill in VITE_TLDRAW_LICENSE_KEY in compose.build.yaml, then...
docker compose -f compose.build.yaml build
docker compose -f compose.build.yaml up -d
```

## License

This project is provided under the MIT license found [here](/LICENSE). The tldraw SDK is provided under the [tldraw license](https://github.com/tldraw/tldraw/blob/main/LICENSE.md).

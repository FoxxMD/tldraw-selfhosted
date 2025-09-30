# tldraw for selfhosting

A minimal implementation of [tldraw](https://tldraw.dev) based on the starter/templates [simple-sever](https://github.com/tldraw/tldraw/tree/main/templates/simple-server-example) and [sync-cloudflare](https://github.com/tldraw/tldraw/tree/main/templates/sync-cloudflare).

This implementation offers:

* basic whiteboard with [tldraw sync](https://tldraw.dev/docs/sync) for multiplayer/realtime collaboration
* Unique Rooms, IE `mydomain.com/my-tldraw-room`, backed by file storage
* User uploads backed by file storage
* A development environment with devcontainer
* All assets selfhosted (no cdn)
* Docker image and docker compose example for quick deployment

## Usage and tldraw License

When deployed on `localhost`, or when developing, this implementation is usable.

If you deploy this to a valid TLD (`mydomain.com`) **you will need to provide a [license](https://tldraw.dev/community/license).** Hobby licenses, which are free, are available with application.

To include your license you will need to build the image yourself.

TODO: Add the build-arg `VITE_TLDRAW_LICENSE_KEY` or fill in using compose.yaml, then build.

## License

This project is provided under the MIT license found [here](https://github.com/tldraw/tldraw/blob/main/apps/simple-server-example/LICENSE.md). The tldraw SDK is provided under the [tldraw license](https://github.com/tldraw/tldraw/blob/main/LICENSE.md).

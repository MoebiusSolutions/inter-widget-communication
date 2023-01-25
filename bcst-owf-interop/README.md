# bcst-owf-interop

> ✨ Bootstrapped with Create Snowpack App (CSA).

## Available Scripts

### npm start

Runs the app in the development mode.
Open https://localhost:8443 to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

### npm run build

Builds a static copy of your site to the `build/` folder.
Your app is ready to be deployed!

**For the best production performance:** Add a build bundler plugin like [@snowpack/plugin-webpack](https://github.com/snowpackjs/snowpack/tree/main/plugins/plugin-webpack) or [snowpack-plugin-rollup-bundle](https://github.com/ParamagicDev/snowpack-plugin-rollup-bundle) to your `snowpack.config.mjs` config file.

### Q: What about Eject?

No eject needed! Snowpack guarantees zero lock-in, and CSA strives for the same.

# Build Docker Container

## Generate Certs

Generate the certs necessary for Docker deployment by running the `make-dev-certs` script in the root of the `inter-widget-communication` repo. This requires `mkcert` to be installed. 

### mkcert Installation

Copy the latest mkcert executable onto your path. You can overwrite this
if a new version comes out.
https://github.com/FiloSottile/mkcert

```
$ sudo apt install libnss3-tools
$ curl -L -o ~/.local/bin/mkcert \
    https://github.com/FiloSottile/mkcert/releases/download/v1.4.3/mkcert-v1.4.3-linux-amd64
$ chmod +x ~/.local/bin/mkcert
```
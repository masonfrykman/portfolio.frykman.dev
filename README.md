# portfolio.frykman.dev

my portfolio, AKA a single-page application that succinctly presents different things i've made.

## Building the webroot

In order to build, [rollup](https://rollupjs.org/), [minify](https://coderaiser.github.io/minify/), [typescript](https://www.typescriptlang.org/) (tsc) must be available via npx.
You must also have `python >= 3.14` installed and available from the path as `python3` to run the build script and `tar` available from the path.

Easiest way to install them is via npm:

`$ npm install`

Then, run `$ npm run build`.

The build script will setup the webroot in `dist/` for running. Then, it will package `dist/` into a tarball and output into `webroot.tar.gz` in the project's root directory.

## Running the webserver

Once the webroot is built, the web server can be run normally using the `dart >= 3.10.0` toolchain.

`$ dart run`
(OR) `$ npm run webserver`

This is sufficient to bring up the insecure server at port 80. In order to enable TLS, set the `CERT_PATH` and `CERT_PRIV_KEY` environment variables to the paths to the certificate chain and private key. If BOTH of those are set, then it will try to load them and bring up a secure webserver at port 443.

`$ CERT_PATH=/path/to/chain CERT_PRIV_KEY=/path/to/private/key dart run`

If it fails to load the files for the secure server, it will still serve from port 80 but show an exception. It should keep running (if not, please open an issue!).
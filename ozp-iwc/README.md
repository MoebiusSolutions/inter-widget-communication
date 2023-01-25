# Package the ozp-iwc release files

See: https://github.com/ozoneplatform/ozp-iwc

The version in `package.json` matches the release of `ozp-iwc`.
The `ozp-iwc` release contains many more files.
However, most are not needed. The files includes here are the
only files needed clients.
See `iwc-bus` for a sample `iwc-bus` server.

These files cannot be imported using ES or Typescript.
Instead, you will need to copy them into your `public`
or `static` assets folder during build.

```
npx copyfiles node_modules/@moesol/ozp-iwc/dis/js/* public/
```

And then, include the `ozpIwc-client.js` (or `ozpIwc-client.min.js`) in your `index.html`.

```html
    <script src="js/ozp-iwc-1.2.4/ozpIwc-client.js"></script>
```

After logging into a `npm` registry:

You can publish this module to a `npm` repository using

```
npm publish
```
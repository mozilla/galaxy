# galaxy

[![Stories in Ready](https://badge.waffle.io/cvan/galaxy.png?label=ready&title=Ready)](https://waffle.io/cvan/galaxy)

To infinity and beyond.


## Installation

```bash
# Install commonplace
npm install commonplace -g
# Copy local configuration into place
cp src/media/js/settings_local.js.dist src/media/js/settings_local.js
# Copy production configuration into place
cp src/media/js/settings_local_hosted.js.dist src/media/js/settings_local_hosted.js
# Start the server
damper
```


## Deployment

We use stackato:

    stackato push --no-prompt

To start the instance on stackato:

    stackato start

To read the logs on stackato:

    stackato logs

To run shell commands on stackato:

    stackato run cat ../logs/stdout.log

To access the shell on stackato:

    stackato ssh

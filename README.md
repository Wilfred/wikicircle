# WikiCircle

[![Build Status](https://travis-ci.org/Wilfred/wikicircle.svg?branch=master)](https://travis-ci.org/Wilfred/wikicircle)
[![Dependency Status](https://david-dm.org/wilfred/wikieval.svg)](https://david-dm.org/wilfred/wikieval)

WikiCircle is a proof of concept self-hosting metawiki. It has basic
self-editing functionality but no concept of users or history yet.

The backend is a simple node.js application with a JSON REST API. The
API design is based on
[GoCardless's API design guidelines](https://github.com/gocardless/http-api-design/blob/master/README.md). The
frontend is a single page app.

AGPLv3 license.

## Running the server

```
$ npm install
$ sudo systemctl start mongodb
$ npm run reset-db
$ npm run server
```

## Tests

We have a handful of backend tests, which you can run with:

```
$ npm run test
```

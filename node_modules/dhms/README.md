# dhms

Parses `dhms` string to number of milliseconds or seconds

[![Build Status][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]

## Install

```bash
npm i dhms
```

## Usage

```js
const dhms = require('dhms');

// milliseconds
dhms('123'); // 123
dhms('1s'); // 1000
dhms('1m'); // 60000
dhms('1h'); // 3600000
dhms('1d'); // 86400000
dhms('1d2h30m45s123'); // 95445123
dhms('2h 30 m4 5s12 3') === dhms('2h30m45s123'); // true
dhms('1h1h1h') === dhms('3h'); // true
dhms('-123'); // -123
dhms('-1h'); // -3600000
dhms('1h-30m') === dhms('30m'); // true
dhms('1s-400') === dhms('600'); // true

// seconds
dhms('123', true); // 123
dhms('1s', true); // 1
dhms('1m', true); // 60
dhms('1h', true); // 3600
dhms('1d', true); // 86400
dhms('1d2h30m45s123', true); // 95568
dhms('2h 30 m4 5s12 3', true) === dhms('2h30m45s123', true); // true
dhms('1h1h1h', true) === dhms('3h', true)); // true
dhms('-123', true); // -123
dhms('-1h', true); // -3600
dhms('1h-30m', true) === dhms('30m', true); // true
dhms('1m-40', true) === dhms('20', true); // true

// zero
dhms('000'); // 0
dhms('bad'); // 0
dhms('dhms'); // 0
dhms('123x'); // 0
dhms(''); // 0
dhms(true); // 0
dhms(false); // 0
dhms(null); // 0
dhms(); // 0
dhms(0); // 0
dhms(123); // 0
dhms([123]); // 0
dhms('000', true); // 0
dhms('bad', true); // 0
dhms('dhms', true); // 0
dhms('123x', true); // 0
dhms('', true); // 0
dhms(true, true); // 0
dhms(false, true); // 0
dhms(null, true); // 0
dhms(undefined, true); // 0
dhms(0, true); // 0
dhms(123, true); // 0
dhms([123], true); // 0
```

## License

MIT

[npm-url]: https://npmjs.org/package/dhms
[npm-image]: https://badge.fury.io/js/dhms.svg
[travis-url]: https://travis-ci.org/astur/dhms
[travis-image]: https://travis-ci.org/astur/dhms.svg?branch=master
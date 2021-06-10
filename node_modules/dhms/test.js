const test = require('ava');
const dhms = require('.');

test('zero', t => {
    // ms
    t.is(dhms('000'), 0);
    t.is(dhms('bad'), 0);
    t.is(dhms('dhms'), 0);
    t.is(dhms('123x'), 0);
    t.is(dhms(''), 0);
    t.is(dhms(true), 0);
    t.is(dhms(false), 0);
    t.is(dhms(null), 0);
    t.is(dhms(), 0);
    t.is(dhms(0), 0);
    t.is(dhms(123), 0);
    t.is(dhms([123]), 0);
    // sec
    t.is(dhms('000', true), 0);
    t.is(dhms('bad', true), 0);
    t.is(dhms('dhms', true), 0);
    t.is(dhms('123x', true), 0);
    t.is(dhms('', true), 0);
    t.is(dhms(true, true), 0);
    t.is(dhms(false, true), 0);
    t.is(dhms(null, true), 0);
    t.is(dhms(undefined, true), 0);
    t.is(dhms(0, true), 0);
    t.is(dhms(123, true), 0);
    t.is(dhms([123], true), 0);
});

test('base', t => {
    // ms
    t.is(dhms('123'), 123);
    t.is(dhms('1s'), 1000);
    t.is(dhms('1m'), 60000);
    t.is(dhms('1h'), 3600000);
    t.is(dhms('1d'), 86400000);
    // sec
    t.is(dhms('123', true), 123);
    t.is(dhms('1s', true), 1);
    t.is(dhms('1m', true), 60);
    t.is(dhms('1h', true), 3600);
    t.is(dhms('1d', true), 86400);
});

test('complicated', t => {
    // ms
    t.is(dhms('1d2h30m45s123'), 95445123);
    t.is(dhms('2h 30 m4 5s12 3'), dhms('2h30m45s123'));
    t.is(dhms('1h1h1h'), dhms('3h'));
    // sec
    t.is(dhms('1d2h30m45s123', true), 95568);
    t.is(dhms('2h 30 m4 5s12 3', true), dhms('2h30m45s123', true));
    t.is(dhms('1h1h1h', true), dhms('3h', true));
});

test('negative', t => {
    // ms
    t.is(dhms('-123'), -123);
    t.is(dhms('-1h'), -3600000);
    t.is(dhms('1h-30m'), dhms('30m'));
    t.is(dhms('1s-400'), dhms('600'));
    // sec
    t.is(dhms('-123', true), -123);
    t.is(dhms('-1h', true), -3600);
    t.is(dhms('1h-30m', true), dhms('30m', true));
    t.is(dhms('1m-40', true), dhms('20', true));
});

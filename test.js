// @flow
'use strict';
const test = require('ava');
const fixtures = require('fixturez');
const paranormal = require('./');

const f = fixtures(__dirname, { root: __dirname });

test('paranormal', async t => {
  let dir = f.find('basic');
  await paranormal({ cwd: dir });
  t.pass();
});

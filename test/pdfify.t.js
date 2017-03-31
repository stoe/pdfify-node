'use strict';

import fs from 'fs';
import path from 'path';
import test from 'ava';
import execa from 'execa';


test.beforeEach(t => {
  t.context.testMd = path.resolve('./test/fixtures/test.md');
  t.context.testCss = path.resolve('./test/fixtures/test.css');

  t.context.testPdf = path.resolve('./test/fixtures/test.pdf');
  t.context.testHtml = path.resolve('./test/fixtures/test.html');

  t.context.fooPdf = path.resolve('./test/fixtures/foo.pdf');
  t.context.fooHtml = path.resolve('./test/fixtures/foo.html');
});

test.afterEach(t => {
  const files = [
    t.context.testPdf,
    t.context.testHtml,
    t.context.fooPdf,
    t.context.fooHtml
  ];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    fs.exists(file, exists => {
      if (exists) {
        fs.unlinkSync(file);
      }
    });
  }
});

test.serial('source', async t => {
  t.plan(1);

  await execa('./index.js', [t.context.testMd]);
  const pdfExists = fs.existsSync(t.context.testPdf);

  t.true(pdfExists);
});

test.serial('source + debug', async t => {
  t.plan(2);

  await execa('./index.js', [t.context.testMd, '--debug']);
  const pdfExists = fs.existsSync(t.context.testPdf);
  const htmlExists = fs.existsSync(t.context.testHtml);

  t.true(pdfExists);
  t.true(htmlExists);
});

test.serial('source + css', async t => {
  t.plan(1);

  await execa.shell(
    `node ./index.js ${t.context.testMd} --style ${t.context.testCss} --debug`
  );
  const html = fs.readFileSync(t.context.testHtml, 'utf8');

  t.true(html.indexOf('color: red !important;') > 0, true);
});

test.serial('source + destination', async t => {
  t.plan(1);

  await execa('./index.js', [
    t.context.testMd,
    t.context.fooPdf
  ]);
  const pdfExists = fs.existsSync(t.context.fooPdf);

  t.true(pdfExists);
});

test.serial('source + destination + debug', async t => {
  t.plan(2);

  await execa('./index.js', [
    t.context.testMd,
    t.context.fooPdf,
    '--debug'
  ]);
  const pdfExists = fs.existsSync(t.context.fooPdf);
  const htmlExists = fs.existsSync(t.context.fooHtml);

  t.true(pdfExists);
  t.true(htmlExists);
});

test.serial('source + destination + css', async t => {
  t.plan(1);

  await execa.shell(
    `node ./index.js ${t.context.testMd} ${t.context.fooPdf} --style ${t.context.testCss} --debug`
  );
  const html = fs.readFileSync(t.context.fooHtml, 'utf8');

  t.true(html.indexOf('color: red !important;') > 0, true);
});

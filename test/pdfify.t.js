'use strict';

import fs from 'fs';
import path from 'path';
import test from 'ava';
import execa from 'execa';

test.beforeEach(t => {
  t.context.testMd = path.resolve('./test/fixtures/test.md');
  t.context.testCss = path.resolve('./test/fixtures/test.css');
  t.context.testHeaderHbs = path.resolve('./test/fixtures/test.header.hbs');

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

    fs.access(file, fs.constants.F_OK, err => {
      if (!err) {
        fs.unlinkSync(file);
      }
    });
  }
});

test.serial('source', async t => {
  t.plan(1);

  await execa('./index.js', [t.context.testMd]);
  const pdfExists = fs.existsSync(t.context.testPdf);

  t.true(pdfExists, `${t.context.testPdf} not created`);
});

test.serial('source + debug', async t => {
  t.plan(2);

  await execa('./index.js', [t.context.testMd, '--debug']);
  const pdfExists = fs.existsSync(t.context.testPdf);
  const htmlExists = fs.existsSync(t.context.testHtml);

  t.true(pdfExists, `${t.context.testPdf} not created`);
  t.true(htmlExists, `${t.context.testHtml} not created`);
});

test.serial('source + css', async t => {
  t.plan(1);

  await execa.shell(
    `node ./index.js ${t.context.testMd} --style ${t.context.testCss} --debug`
  );
  const html = fs.readFileSync(t.context.testHtml, 'utf8');

  t.true(html.indexOf('color: red !important;') > 0, 'CSS not found');
});

test.serial('source + header', async t => {
  t.plan(1);

  await execa.shell(
    `node ./index.js ${t.context.testMd} --header ${t.context.testHeaderHbs} --debug`
  );
  const html = fs.readFileSync(t.context.testHtml, 'utf8');

  t.true(
    html.indexOf('<header class="test">foobar</header>') > 0,
    '<header> not found'
  );
});

test.serial('source + header + repeat', async t => {
  await execa.shell(
    `node ./index.js ${t.context.testMd} --header ${t.context.testHeaderHbs} --repeat --debug`
  );
  const html = fs.readFileSync(t.context.testHtml, 'utf8');

  t.true(html.indexOf('<header class="test">foobar</header>') < 0, '<header> found');
});

test.serial('source + destination', async t => {
  t.plan(1);

  await execa('./index.js', [t.context.testMd, t.context.fooPdf]);
  const pdfExists = fs.existsSync(t.context.fooPdf);

  t.true(pdfExists, `${t.context.fooPdf} not created`);
});

test.serial('source + destination + debug', async t => {
  t.plan(2);

  await execa('./index.js', [t.context.testMd, t.context.fooPdf, '--debug']);
  const pdfExists = fs.existsSync(t.context.fooPdf);
  const htmlExists = fs.existsSync(t.context.fooHtml);

  t.true(pdfExists, `${t.context.fooPdf} not created`);
  t.true(htmlExists, `${t.context.fooHtml} not created`);
});

test.serial('source + destination + css', async t => {
  t.plan(1);

  await execa.shell(
    `node ./index.js ${t.context.testMd} ${t.context.fooPdf} --style ${t.context.testCss} --debug`
  );
  const html = fs.readFileSync(t.context.fooHtml, 'utf8');

  t.true(html.indexOf('color: red !important;') > 0, 'CSS missing');
});

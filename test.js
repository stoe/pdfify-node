import fs from 'fs';
import path from 'path';
import test from 'ava';
import execa from 'execa';

test.afterEach(() => {
  const files = [
    './readme.pdf',
    './readme.html',
    './foobar.pdf',
    './foobar.html'
  ];

  for (let i = 0; i < files.length; i++) {
    const file = path.resolve(files[i]);

    fs.exists(file, exists => {
      if (exists) {
        fs.unlinkSync(file);
      }
    });
  }
});

test.serial('source', async t => {
  const {stdout} = await execa('./index.js', ['readme.md']);
  const pdfExists = fs.existsSync('./readme.pdf');

  t.true(pdfExists);
  t.is(stdout, `PDF created successfully at: ${path.resolve('./readme.pdf')}`);
});

test.serial('source + destination', async t => {
  const {stdout} = await execa('./index.js', ['readme.md', 'foobar.pdf']);
  const pdfExists = fs.existsSync('./foobar.pdf');

  t.true(pdfExists);
  t.is(stdout, `PDF created successfully at: ${path.resolve('./foobar.pdf')}`);
});

test.serial('source + debug', async t => {
  const {stdout} = await execa('./index.js', ['readme.md', '--debug']);
  const pdfExists = fs.existsSync('./readme.pdf');
  const htmlExists = fs.existsSync('./readme.html');

  t.true(pdfExists);
  t.true(htmlExists);
  t.is(stdout, `PDF created successfully at: ${path.resolve('./readme.pdf')}`);
});

test.serial('source + destination + debug', async t => {
  const {stdout} = await execa('./index.js', [
    'readme.md',
    'foobar.pdf',
    '--debug'
  ]);
  const pdfExists = fs.existsSync('./foobar.pdf');
  const htmlExists = fs.existsSync('./foobar.html');

  t.true(pdfExists);
  t.true(htmlExists);
  t.is(stdout, `PDF created successfully at: ${path.resolve('./foobar.pdf')}`);
});

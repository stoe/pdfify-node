#!/usr/bin/env node
'use strict';

const path = require('path');
const chalk = require('chalk');
const meow = require('meow');
const Ora = require('ora');
const PDFify = require('./pdfify');

const cli = meow(
  `  ${chalk.bold('Usage')}
    $ pdfify <source> [<destination>] [options]

  ${chalk.bold('Options')}
    --debug   When this is set the intermediate HTML will be saved into a file.
    --header  A full path to a the Handlebars (.hbs|.html) file which will be your header.
    --height  The height of the header section in mm. ${chalk.dim('Might take some fiddling to get just right')}.
    --open    Open the generated PDF.
    --style   A full path to a single css stylesheet which is applied last to the PDF.

  ${chalk.bold('Examples')}
    $ pdfify foo.md
    $ pdfify foo.md foo.pdf --header header.hbs --height 42 --style style.css
`,
  {
    alias: {
      d: 'debug',
      o: 'open',
      s: 'style'
    }
  }
);

const source = cli.input[0];
const destination = source ?
  cli.input[1] ||
      path.resolve(source.slice(0, source.indexOf('.md')) + '.pdf') :
  null;

const style = cli.flags.style || null;
const header = cli.flags.header || './assets/header-default.hbs';
const debug = cli.flags.debug ?
  destination.slice(0, destination.indexOf('.pdf')) + '.html' :
  false;

if (!source) {
  cli.showHelp();
  process.exitCode = 1;
}

const pdfify = new PDFify({
  source: path.resolve(source),
  destination,
  style: style ? path.resolve(style) : null,
  header: header ? path.resolve(header) : null,
  height: cli.flags.height || null,
  debug,
  open: cli.flags.open || false
});

const ora = new Ora({
  color: 'blue'
});

pdfify.makeHTML().then(html => {
  const makePdf = pdfify.makePDF(html, ora);

  if (debug) {
    ora.info(`created HTML ${chalk.blue(debug)}`);
  }

  Ora.promise(makePdf, {
    text: `creating PDF ${chalk.blue(destination)}`
  });
});

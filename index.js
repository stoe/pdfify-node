#!/usr/bin/env node
'use strict';

const path = require('path');
const meow = require('meow');
const chalk = require('chalk');
const mdpdf = require('mdpdf');

const cli = meow(
  `
  ${chalk.bold('Usage')}
    ${chalk.blue('$ pdfify <source> [<destination>] [options]')}

  ${chalk.bold('Options')}
    --debug   When this is set the intermediate HTML will be saved into a file, the value of this field should be the full path to the destination HTML.
    --header  A full path to a the Handlebars (.hbs) file which will be your header. (otional)
    --height  The height of the header section in mm, this might take some fiddling to get just right.
    --style   A full path to a single css stylesheet which is applied last to the PDF. (otional)

  ${chalk.bold('Examples')}
    ${chalk.dim('$ pdfify foo.md')}
    ${chalk.dim('$ pdfify foo.md foo.pdf --header header.hbs --height 42 --style style.css')}
`,
  {
    alias: {}
  }
);

const source = cli.input[0];
const destination = cli.input[1] ||
  source.slice(0, source.indexOf('.md')) + '.pdf';

const debug = cli.flags.debug || false;
const header = cli.flags.header || null;
const height = cli.flags.height || null;
const style = cli.flags.style || './style.css';

const options = {
  ghStyle: true,
  defaultStyle: true,
  source: path.resolve(source),
  destination: path.resolve(destination),
  assetDir: path.dirname(path.resolve(source)),
  styles: path.resolve(style),
  header: path.resolve(header),
  debug: debug ?
    destination.slice(0, destination.indexOf('.pdf')) + '.html' :
    null,
  pdf: {
    format: 'A4',
    base: path.join('file://', __dirname, 'node_modules', 'mdpdf', 'assets'),
    header: {
      height: height + 'mm'
    },
    border: {
      top: '10mm',
      left: '10mm',
      bottom: '10mm',
      right: '10mm'
    }
  }
};

mdpdf
  .convert(options)
  .then(pdfPath => {
    console.log(`PDF created successfully at: ${chalk.blue(pdfPath)}`);
  })
  .catch(err => {
    console.error(err);
    process.exitCode = 1;
  });

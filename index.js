#!/usr/bin/env node
'use strict';

const path = require('path');
const chalk = require('chalk');
const meow = require('meow');
const opn = require('opn');
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
  cli.input[1] || source.slice(0, source.indexOf('.md')) + '.pdf' :
  null;

const style = cli.flags.style || null;
const header = cli.flags.header || './assets/header-default.hbs';
const height = cli.flags.height || null;
const debug = cli.flags.debug || false;

if (!source) {
  cli.showHelp();
  process.exitCode = 1;
}

const pdfify = new PDFify({
  source: path.resolve(source),
  destination: path.resolve(destination),
  style: style ? path.resolve(style) : null,
  header: header ? path.resolve(header) : null,
  height,
  debug: debug ?
    path.resolve(destination.slice(0, destination.indexOf('.pdf')) + '.html') :
    null
});

pdfify
  .makeHTML()
  .then(html => {
    pdfify.makePDF(html).then(pdf => {
      console.log(`PDF created at:        ${chalk.blue(pdf)}`);

      if (cli.flags.open) {
        opn(pdf, {
          wait: false
        }).catch(err => console.log(err));
      }
    });
  })
  .catch(err => {
    console.log(
      `
${cli.help}

${chalk.dim('------------------------------------------------------------')}

${err.message}
`
    );
  });

# pdfify-node
[![Build Status](https://travis-ci.org/stoelzle/pdfify-node.svg?branch=master)](https://travis-ci.org/stoelzle/pdfify-node) [![Greenkeeper badge](https://badges.greenkeeper.io/stoelzle/pdfify-node.svg)](https://greenkeeper.io/) [![Known Vulnerabilities](https://snyk.io/test/github/stoelzle/pdfify-node/1a02fcfc15cd9550c6d5629a6719324d381681e2/badge.svg)](https://snyk.io/test/github/stoelzle/pdfify-node/1a02fcfc15cd9550c6d5629a6719324d381681e2) [![NPM version](https://img.shields.io/npm/v/pdfify-node.svg)](https://www.npmjs.com/package/pdfify-node) [![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo) [![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

> Convert markdown files to PDF.


## Install
```
$ npm install --global pdfify-node
```

_Requires [Node.js](https://nodejs.org) 6+._


## Usage
```shell
Usage
  $ pdfify <source> [<destination>] [options]

Options
  --debug   When this is set the intermediate HTML will be saved into a file.
  --header  A full path to a the Handlebars (.hbs|.html) file which will be your header.
  --height  The height of the header section in mm. Might take some fiddling to get just right.
  --open    Open the generated PDF.
  --style   A full path to a single css stylesheet which is applied last to the PDF.

Examples
  $ pdfify foo.md
  $ pdfify foo.md foo.pdf --header header.hbs --height 42 --style style.css
```


## License [![license](https://img.shields.io/github/license/stoelzle/pdfify-node.svg)](https://github.com/stoelzle/pdfify-node/blob/master/license)
MIT © [Stefan Stölzle](https://github.com/stoe)

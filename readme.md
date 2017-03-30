# pdfify-node [![Build Status](https://travis-ci.org/stoe/pdfify-node.svg?branch=master)](https://travis-ci.org/stoe/pdfify-node) [![Known Vulnerabilities](https://snyk.io/test/github/stoe/pdfify-node/1a02fcfc15cd9550c6d5629a6719324d381681e2/badge.svg)](https://snyk.io/test/github/stoe/pdfify-node/1a02fcfc15cd9550c6d5629a6719324d381681e2)

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


## License

MIT © [Stefan Stölzle](https://github.com/stoe)

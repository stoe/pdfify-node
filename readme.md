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
  --debug   When set creates an additional `.hbs` file.
  --header  Full path to the header file (`html`|`hbs`).
  --height  Header height in millimeter.
  --style   Full path to an additional style file (`css`).

Examples
  $ pdfify foo.md
  $ pdfify foo.md foo.pdf --header header.hbs --height 42 --style style.css
```


## License

MIT © [Stefan Stölzle](https://github.com/stoe)

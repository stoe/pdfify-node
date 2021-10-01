# pdfify-node

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

> Convert markdown files to PDF.

## Install

[Configuring NPM for use with GitHub Package Registry](https://help.github.com/en/articles/configuring-npm-for-use-with-github-package-registry)

```
$ npm install --global @stoe/pdfify-node
```

_Requires [Node.js](https://nodejs.org) 10+._

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

## License [![license](https://img.shields.io/github/license/stoe/pdfify-node.svg)](https://github.com/stoe/pdfify-node/blob/master/license)

MIT © [Stefan Stölzle](https://github.com/stoe)

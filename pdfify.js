'use strict';

const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');
const chalk = require('chalk');
const handlebars = require('handlebars');
const MarkdownIt = require('markdown-it');
const MarkdownItEmoji = require('markdown-it-emoji');
const MarkdownItHighlightJS = require('markdown-it-highlightjs');
const opn = require('open');
const pdf = require('html-pdf');

const md = new MarkdownIt();
md.use(MarkdownItEmoji);
md.use(MarkdownItHighlightJS);
md.renderer.rules.emoji = (token, idx) => {
  const emojis = require('./data/emojis.json');
  const emoji = token[idx];
  const emojiImgPath = emojis[emoji.markup];

  return `<img class="emoji-img emoji" alt="${emoji.content}" title=":${
    emoji.markup
  }:" src="${emojiImgPath}"/>`;
};

Promise.promisifyAll(fs); // eslint-disable-line no-use-extend-native/no-use-extend-native
Promise.promisifyAll(md); // eslint-disable-line no-use-extend-native/no-use-extend-native

module.exports = class PDFify {
  constructor(options) {
    this.options = options || {};

    this.layout = path.resolve(__dirname, 'assets/layout.hbs');
  }

  makeCSS() {
    const stylesheets = [path.join(__dirname, '/assets/style.css')];
    const styleHtml = [];

    if (this.options.style) {
      stylesheets.push(this.options.style);
    }

    for (let i = 0; i < stylesheets.length; i++) {
      const style = fs.readFileSync(stylesheets[i], 'utf8');
      styleHtml.push(`<style>${style}</style>`.replace('\n', ''));
    }

    return styleHtml.join('\n');
  }

  makeHTML() {
    return new Promise((resolve, reject) => {
      Promise.all([
        fs.readFileAsync(this.options.source, 'utf8'),
        fs.readFileAsync(this.layout, 'utf8')
      ])
        .spread((markdown, layout) => {
          const css = this.makeCSS();
          const body = md.render(markdown);
          const config = {
            css: new handlebars.SafeString(css),
            body: new handlebars.SafeString(body)
          };

          if (this.options.repeat === false) {
            config.header = new handlebars.SafeString(
              fs.readFileSync(this.options.header, 'utf8')
            );
            config.margin = this.options.height ?
              `${this.options.height * 3.7795275590551}px` :
              '50px';
          }

          const html = handlebars.compile(layout)(config);

          resolve(html);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  makePDF(html, ora) {
    return new Promise((resolve, reject) => {
      if (!html) {
        reject(new Error('html missing'));
      }

      const htmlPath = this.options.debug;

      if (htmlPath) {
        fs.writeFileAsync(htmlPath, html).then(() => {});
      }

      const pdfConfig = {
        format: 'A4',
        base: path.resolve('file://', __dirname, '/assets/'),
        footer: {
          height: '10mm',
          contents: {
            default:
              '<div class="footer"><span class="page">{{page}}</span>/<span class="pages">{{pages}}</span></div>'
          }
        },
        border: {
          top: '20mm',
          left: '25mm',
          bottom: '20mm',
          right: '25mm'
        }
      };

      if (this.options.repeat && this.options.header) {
        pdfConfig.header = {
          height: this.options.height ? `${this.options.height}mm` : '20mm',
          contents: fs.readFileSync(this.options.header, 'utf8')
        };
      }

      const destination = path.resolve(this.options.destination);

      pdf.create(html, pdfConfig).toFile(destination, (err, res) => {
        if (err) {
          reject(err);
        }

        resolve(res.filename);

        if (this.options.open) {
          opn(destination, {
            wait: false
          });

          ora.info(
            `opening ${chalk.blue(this.options.destination)} once created`
          );
        }
      });
    });
  }
};

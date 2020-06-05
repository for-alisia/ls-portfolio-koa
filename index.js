/* eslint-disable handle-callback-err */
const fs = require('fs');

const Koa = require('koa');
const Pug = require('koa-pug');
const staticKoa = require('koa-static');
const session = require('koa-session');

const config = require('./config');
const errorHandler = require('./utils/error');
const router = require('./routes');
const port = process.env.PORT || 5000;

const app = new Koa();

// eslint-disable-next-line no-unused-vars
const pug = new Pug({
  viewPath: './views',
  basedir: './views',
  app: app,
});

app.use(staticKoa('./public'));

app.use(errorHandler);

app.on('error', (err, ctx) => {
  ctx.response.body = {};
  ctx.render('pages/error', {
    status: ctx.response.status,
    error: ctx.response.message,
  });
});

app
  .use(session(config.session, app))
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(port, () => {
  if (!fs.existsSync(config.upload)) {
    fs.mkdirSync(config.upload);
  }
  console.log(`> Ready On Server http://localhost:${port}`);
});

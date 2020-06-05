const util = require('util');
const fs = require('fs');
const _path = require('path');

const validation = require('../utils/validation');
const db = require('../models/db');
const unlink = util.promisify(fs.unlink);
const rename = util.promisify(fs.rename);

module.exports.getAdmin = async (ctx, next) => {
  await ctx.render('pages/admin', {
    title: 'Admin Panel',
    msg: ctx.request.query.msg,
  });
};

module.exports.addProduct = async (ctx, next) => {
  const { name, price } = ctx.request.body;
  const img = ctx.request.files.photo;
  const responseError = validation(name, price, img.name, img.size);

  if (responseError) {
    await unlink(img.path);

    await ctx.redirect(`/admin?msg=${responseError.mes}`);
    return;
  }

  const fileName = _path.join(process.cwd(), 'public', 'upload', img.name);
  const errUpload = await rename(img.path, fileName);

  if (errUpload) {
    await ctx.redirect('/admin?msg=При загрузке картинки произошла ошибка');
    return;
  }

  db.get('products')
    .push({ name, price, src: _path.join('upload', img.name) })
    .write();

  await ctx.redirect('/admin?msg=Продукт успешно загружен');
};

module.exports.updateSkills = async (ctx, next) => {
  const skills = db.get('skills').value();

  for (const prop in ctx.request.body) {
    skills[prop].number = ctx.request.body[prop];
  }

  db.update('skills', skills).write();

  await ctx.redirect('/admin?msg=Данные успешно обновлены');
};

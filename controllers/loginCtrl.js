const psw = require('../utils/password');
const db = require('../models/db');

module.exports.getLogin = async (ctx, next) => {
  if (ctx.session.isAuthorized) {
    await ctx.redirect('/admin');
  } else {
    await ctx.render('pages/login', {
      title: 'Login',
      msg: ctx.request.query.msg,
    });
  }
};

module.exports.auth = async (ctx, next) => {
  const { email, password } = ctx.request.body;
  const user = db.get('user').value();

  if (user.email === email && psw.validPassword(password)) {
    ctx.session.isAuthorized = true;
    await ctx.redirect('/admin');
  } else {
    await ctx.redirect('/login?msg=Проверьте правильность введенных данных');
  }
};

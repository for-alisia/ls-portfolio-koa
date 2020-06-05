const db = require('../models/db');

const sgMail = require('@sendgrid/mail');
const config = require('../config');
sgMail.setApiKey(config.api_key);

module.exports.getIndex = async (ctx, next) => {
  const products = db.get('products').value() || [];

  await ctx.render('pages/index', {
    title: 'Portfolio | Homepage',
    products,
    msg: ctx.request.query.msg,
  });
};

module.exports.postMessage = async (ctx, next) => {
  const msg = {
    to: config.mail_to,
    from: config.mail_from,
    subject: 'New message from your website',
    text: `New message from ${ctx.request.body.name}. Email: ${ctx.request.body.email}. Message: ${ctx.request.body.message}`,
    html: `<h3>New message from ${ctx.request.body.name}.</h3><p>Email: ${ctx.request.body.email}.</p><p>Message: ${ctx.request.body.message}</p>`,
  };

  try {
    await sgMail.send(msg);
    await ctx.redirect('/?msg=Письмо отправлено успешно#contact');
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }

    await ctx.redirect(
      '/?msg=Возникли ошибки при отправлении сообщения#contact'
    );
  }
};

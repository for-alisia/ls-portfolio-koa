module.exports = async (ctx, next) => {
  if (!ctx.session.isAuthorized) {
    await ctx.redirect('/login');
  } else {
    await next();
  }
};

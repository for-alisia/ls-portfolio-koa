const Router = require('koa-router');
const router = new Router();
const koaBody = require('koa-body');

const frontCtrl = require('../controllers/frontCtrl');
const adminCtrl = require('../controllers/adminCtrl');
const loginCtrl = require('../controllers/loginCtrl');
const isAuth = require('../middlewares/isAuth');

router.get('/', frontCtrl.getIndex);
router.post('/', koaBody(), frontCtrl.postMessage);

router.get('/admin', isAuth, adminCtrl.getAdmin);
router.post(
  '/admin/upload',
  isAuth,
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: process.cwd() + '/public/upload',
    },
  }),
  adminCtrl.addProduct
);
router.post('/admin/skills', isAuth, koaBody(), adminCtrl.updateSkills);

router.get('/login', loginCtrl.getLogin);
router.post('/login', koaBody(), loginCtrl.auth);

module.exports = router;

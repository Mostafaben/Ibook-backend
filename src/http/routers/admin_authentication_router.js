const router = require('express').Router();
const {
  authenticationAdminLoginMiddleware,
} = require('../middlewares/authentication_middlewares');
const {
  adminLogin,
  refreshToken,
} = require('../controllers/admin_authentication_controller');

router.post('/', authenticationAdminLoginMiddleware, adminLogin);
router.post('/refresh_token', refreshToken);

module.exports = router;

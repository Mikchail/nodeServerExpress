const router = require("express").Router();
const passport = require("passport");

const auth = require('./auth');
const page = require('./page');


require('./passport-init')(passport);

router.use(passport.initialize());
router.use(passport.session());

router.use(auth,page);

module.exports = router;
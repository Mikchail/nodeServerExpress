const router = require("express").Router();
const passport = require("passport");

const auth = require('./auth');
const page = require('./page');
const posts = require('./posts');


require('./passport-init')(passport);

router.use(passport.initialize());
router.use(passport.session());

router.use(auth,page,posts);

module.exports = router;
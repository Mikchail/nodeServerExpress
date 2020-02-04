const router = require("express").Router();
const passport = require("passport");

const auth = require('./auth');
const page = require('./page');
const posts = require('./posts');
const user = require('./user');




router.use(passport.initialize());


require('./passport-init')(passport);

router.use(passport.session());

router.use(auth,page,posts,user);

module.exports = router;
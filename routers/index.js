const { Router } = require("express");
const router = new Router;

const auth = require('./auth');
const page = require('./page');


router.use(auth,page);

module.exports = router;
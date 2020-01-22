const router = require("express").Router();

const auth = require('./auth');
const page = require('./page');


router.use(auth,page);

module.exports = router;
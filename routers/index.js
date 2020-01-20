const router = require("express").Router();

const singin = require('./singin');
const page = require('./page');


router.use(singin,page);

module.exports = router;
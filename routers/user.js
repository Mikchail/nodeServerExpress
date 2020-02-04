const router = require("express").Router();

const User = require('../models/User')


router.get('/:_id', async (req, res) => {
  const user = await User.findById(req.params._id)
  if (user) {
    res.body = user
  } else {
    ctx.throw(404)
  }
})

module.exports = router;
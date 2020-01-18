
const { Strategy, ExtractJwt }  = require('passport-jwt')
const User = require("../models/User");
const config = require('../lib/config')
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.secret
}


module.exports = (passport) => {
  passport.use(new Strategy(opts, async (payload, done) => {
    console.log(payload);
    
    const user = await User.findById(payload.id)
    if (user) {
      done(null, user)
    } else {
      done(null, false)
    }
  }))
}
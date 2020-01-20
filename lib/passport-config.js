
// const { Strategy, ExtractJwt }  = require('passport-jwt')
// const LocalStrategy = require('passport-local').Strategy;
// const User = require("../models/User");
// const config = require('../lib/config')
// // const opts = {
// //   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
// //   secretOrKey: config.secret
// // }


// module.exports = (passport) => {
//   passport.use(new LocalStrategy({ usernameField: 'email' }, async (payload, done) => {
//     console.log(payload);
//     console.log(1123);
    
//     const user = await User.findById(payload.id)
//     if (user) {
//       done(null, user)
//     } else {
//       done(null, false)
//     }
//   }))
// }
 
const passport = require('passport')
const passportConfig = require('../lib/passport-config');
passportConfig(passport)

passport.serializeUser(function(user, done) {
  // const user = await User.findById(payload.id)
  console.log('Сериализация: ', user);
  // done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  // const user = await User.findById(payload.id)
  console.log('Десериализация: ', id);

  // const user = userDB.id === id ? userDB : false;
  // done(null, user);
});

module.exports = [passport.initialize(),passport.session()]
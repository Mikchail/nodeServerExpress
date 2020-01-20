 
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; 
const User = require("../models/User");

passport.serializeUser(function(user, done) {
 
  console.log('Сериализация: ', user);
  done(null, user);
});

passport.deserializeUser(function(id, done) {
  console.log('Десериализация: ', id);
  const user = userDB.id === id ? userDB : false;
  done(null, user);
});

passport.use(new LocalStrategy ({ usernameField: 'email' },
  function(email, password, done) {
    console.dir('сначало здесь?',done)
    User.findOne({ email: email }, function (err, user) {
      if (err) { return done(err); }
      
      
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      // if (!user.validPassword(password)) {
      //   return done(null, false, { message: 'Incorrect password.' });
      // }
      return done(null, user);
    });
  }
));
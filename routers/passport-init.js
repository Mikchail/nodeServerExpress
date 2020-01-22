module.exports = passport => {
  const LocalStrategy = require("passport-local").Strategy;
  const User = require("../models/User");
  console.log(passport);
  
  passport.serializeUser(async (user, done) => {
    console.log(done);
    console.log("Сериализация: ", user);
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    const user2 = await User.findById(id);
    console.log("Десериализация: ", id);
    const user = user2.id === id ? user2 : false;
    done(null, user);
  });

  passport.use(
    new LocalStrategy({ usernameField: "email" }, function(
      email,
      password,
      done
    ) {
      console.dir("сначало здесь?", done);
      User.findOne({ email: email }, function(err, user) {
        if (err) {
          return done(err);
        }

        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      });
    })
  );
  
};

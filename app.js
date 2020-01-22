require("dotenv").config();
const express = require("express");
const passport = require("passport");
const mongoose = require("mongoose");
const handlers = require("./handlers");
const mongooseConfig = require("./lib/mongoose-config");
const expressNunjucks = require("express-nunjucks");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const cors = require("cors");
const config = require("./lib/config");
const app = express();
const roters = require("./routers");

const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/User");

const isDev = app.get("env") === "development";

const njk = expressNunjucks(app, {
  watch: isDev,
  noCache: isDev
});
mongooseConfig();
app.use(cookieParser());

handlers.forEach(h => app.use(h));
app.set("views", "views");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(
  session({
    secret: config.secret,
    resave: true,
    saveUninitialized: false,
    cookie: {
      path: "/",
      httpOnly: true,
      maxAge: 60 * 60 * 1000
    },
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    })
  })
);


passport.serializeUser( async(user, done) => {
  console.log(done);
  console.log("Сериализация: ", user);
  done(null, user.id);
});

passport.deserializeUser(async(id, done) => {
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
      //почемуто не работает ===
      // if (!user.validPassword(password)) {
      //   return done(null, false, { message: 'Incorrect password.' });
      // }
      return done(null, user);
    });
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(roters);

app.listen(process.env.PORT || 3000, () => {
  console.log("Сервер запущен");
});

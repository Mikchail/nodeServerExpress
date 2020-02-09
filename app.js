require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const handlers = require("./handlers");
const mongooseConfig = require("./lib/mongoose-config");
const expressNunjucks = require("express-nunjucks");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const cors = require("cors");
const config = require("./lib/config");
const roters = require("./routers");
const url = require('url');
const isDev = app.get("env") === "development";
// global.__basedir = '../VueApp/dist'
// const publicRoot = '../freelans/VueApp/dist'



const njk = expressNunjucks(app, {
  watch: isDev,
  noCache: isDev
});

mongooseConfig();
app.use(cookieParser());

handlers.forEach(h => app.use(h));
// app.set("views", "views");
app.use(express.static('dist'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: config.secret,
    resave: true,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      path: "/",
      httpOnly: true,
      maxAge: 60 * 60 * 1000 * 24
    },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
			ttl: 14 * 24 * 60 * 60
    })
  })
);
const serverDev = "http://localhost:8080";
const serverProd = "https://vue-app-posts.firebaseapp.com";
app.use(function(req, res, next) {
  res.set(
    "Access-Control-Allow-Origin",
    "https://vue-app-posts.firebaseapp.com/"
  );
  res.set(
    "Access-Control-Allow-Methods",
    "PUT, GET, POST, DELETE, OPTIONS, PATCH"
  );
  res.set(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Test, Set-Cookie, Accept, Authorization, Access-Control-Allow-Credentials"
  );
  res.set("Access-Control-Allow-Credentials", "true");
  next();
});





app.use(cors({ credentials: true, origin: serverDev }));

app.use(roters);

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'dist')))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
  })
}


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server has been started on PORT " + PORT);
});

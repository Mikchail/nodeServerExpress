const bcrypt = require('bcrypt');
const router = require("express").Router();;
const config = require('../lib/config')
const passport = require('passport')
const User = require("../models/User");



router.post("/register", async (req, res) => {
  console.log(req);
  
  const { name, email, password } = req.body;


  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const userNew = await new User({ email, name, password: hash }).save();

  // req.session.userId = userNew.id
  // req.session.name = userNew.name
  // req.session.email = userNew.email
  // res.redirect('/')
});


const auth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    return res.redirect('/');
  }
};


// Авторизация
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    res.render('login', { title: 'User with this email does not exist' })
  }
  const isMatch = await bcrypt.compare(password, user.password)
  if (isMatch) {


    const payload = {
      id: user.id,
      name: user.name,
      email: user.email
    }
    passport.authenticate('local', function (err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.send('Укажите правильный email или пароль!');
      }
      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        }
        return res.redirect('/admin');
      });
    })(req, res, next);
  }


});









//AUTH LOCAL

router.get('/admin', auth, (req, res) => {
  res.send('Admin page!');
});

router.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('/');
});
module.exports = router;
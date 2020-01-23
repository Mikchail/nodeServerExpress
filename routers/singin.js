// const router = require("express").Router();
// const passport = require('passport');
// const bcrypt = require('bcrypt');
//
// router.post("/register", async (req, res) => {
//   console.log(req);
//
//   const { name, email, password } = req.body;
//
//
//   const salt = await bcrypt.genSalt(10);
//   const hash = await bcrypt.hash(password, salt);
//   const userNew = await new User({ email, name, password: hash }).save();
//
//
// });
//
//
//
//
//
//
//
// router.post('/login', (req, res, next) => {
//   passport.authenticate('local', function(err, user) {
//     console.dir('Роутер логин фалй',req.body)
//     if (err) {
//       return next(err);
//     }
//
//     if (!user) {
//       return res.send('Укажите правильный email или пароль!');
//     }
//     req.logIn(user, function(err) {
//       console.dir('logIn')
//
//       if (err) {
//         console.log(123123123123);
//         return next(err);
//       }
//       console.dir('before redirect')
//       return res.redirect('/admin');
//     });
//   })(req, res, next);
// });
//
// const auth = (req, res, next) => {
//   if (req.isAuthenticated()) {
//     next();
//   } else {
//     return res.redirect('/');
//   }
// };
//
// router.get('/admin', auth, (req, res) => {
//   res.send('Admin page!');
// });
//
// router.get('/logout', (req, res) => {
//   req.logOut();
//   res.redirect('/');
// });
//
// module.exports = router;
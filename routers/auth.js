const bcrypt = require('bcrypt');
const { Router } = require("express");
const router = new Router();
const config = require('../lib/config')
const jwt = require("jsonwebtoken");

const User = require("../models/User");

router.post("/register", async (req, res) => {
  if(!req.session.name){
    
    res.redirect('/')
  }
  const { name, email, password } = req.body;
  if (!name || !password || !email) {
   
    res.render('register',{
      ok: false,
      error: 'Все поля должны быть заполнены!',
      fields: ['login', 'password', 'passwordConfirm']
    });
    
  } else if (name.length < 3 || name.length > 16) {
    res.render('register',{
      ok: false,
      error: 'Длина логина от 3 до 16 символов!',
      fields: ['login']
    });
  
  } 
  const user = await User.findOne({ email });
  

  if (user) {
    res.render('register',{
      ok: false,
      error: 'Такой пользователь уже есть',
      fields: ['login']
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const userNew = await new User({ email, name, password: hash }).save();
  // const payload = {
  //   id: userNew.id,
  //   name: userNew.name,
  //   email: userNew.email
  // }
  req.session.userId = userNew.id
  req.session.name = userNew.name
  req.session.email = userNew.email
  res.redirect('/')
});

// Авторизация
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    res.render('login',{ title: 'User with this email does not exist'})
  } 
  const isMatch = await bcrypt.compare(password, user.password)
  if (isMatch) {
   
    
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email
    }
  
    
    // req.session.payload = payload 
    req.session.userId = user.id
    req.session.name = user.name
    req.session.email = user.email
    res.redirect('/')
    // const token = jwt.sign(payload, config.secret, { expiresIn: 3600 * 24 })
    // ctx.body = { token: `Bearer ${token}` }
  } else {
    res.send('такого пользователя нет')
    res.status(400, `Password incorrect`)
  }


});

router.get('/logout', (req, res) => {
  console.log('logout', req.session);
  req.session.destroy(() => {
    res.redirect('/');
  });
});
module.exports = router;
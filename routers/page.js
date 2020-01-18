const { Router } = require("express");
const router = new Router();

router.get('/', (req, res) => {
  console.log('suka');
console.log(req.session)

  let user;
  
  if(req.session.name){
    user = req.session.name
  };
  
  res.render('index' , { user });
});
router.get('/register', (req, res) => {
  if(!req.session.name){
    console.log(12313);
    
    res.redirect('/')
    res.end();
  } else {
    res.render('register',{title: 'Крутяк'});

  }
});

router.get('/login', (req, res) => {
  res.render('login',{title: 'Крутяк'});
});

module.exports = router;
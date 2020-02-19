const router = require("express").Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const passport = require('passport');
const Posts = require("../models/Posts");
const auth = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	} else {
		res.redirect('/login-admin')
	}

};


router.post('/login-admin', async (req, res,next) => {
  const {email, password} = req.body;
	const user = await User.findOne({email});
	if (email === '' && password === '') {
		return res.render('login', {error: 'enter e-mail and enter password'})
	}
	if (email === '') {
		return res.render('login', {error: 'enter e-mail'})
	}
	if (password === '') {
		return res.render('login', {error: 'enter password'})
	}
	if (!user) {
		return res.render('login', {error: 'Wrong password or mail'})
  }
  if(!user.admin){
    return res.render('login', {error: 'Wrong password or mail'})
  }
	const isMatch = await bcrypt.compare(password, user.password);
	if (isMatch) {
		passport.authenticate('local', (err, user, info) => {
			if (err) {
				return next(err);
			}
			if (!user) {
        console.log(123)
				//наверно понять надо
				return res.status(400).send([user, "Cannot2 log in", info])
			}
			req.logIn(user, (err) => {
				if (err) {
					return next(err);
				}
				return res.redirect('/admin',200, {user: user})
			});
		})(req, res, next);
	} else {
		return res.redirect('login', {error: 'Wrong password or mail'})
	}

});


router.get('/login-admin', async (req, res) => {
	res.render('login',{title: 'Вход'});
});
router.get('/admin',auth, async (req, res) => {
	const users = await User.find();

	if (req.session.name) {
		user = req.session.name
	}
	res.render('admin',{users});
});
router.delete('/admin/delete/:_id', async (req, res) => {

	let user = await User.findById(req.params._id)
	if(user.admin){
		user= null;
		return res.json(200,{success: 'ADMINa нельзя удалить'});
		return false
	}
	const posts = await Posts.findOneAndRemove({user: user})
	const delPost = await User.findOneAndRemove({_id:req.params._id});
	// console.log(32)
	// console.log(users)
	// res.json(200,{success: 'User deleted'});
	res.json(200,{success: 'User deleted'});
});



router.get('/admin/login', (req, res) => {
});


module.exports = router;
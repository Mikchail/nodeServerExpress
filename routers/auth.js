const bcrypt = require('bcrypt');
const router = require("express").Router();

const config = require('../lib/config');
const passport = require('passport');
const User = require("../models/User");


router.post("/register", async (req, res) => {
	console.log(req.body);
// проверок сюда заебнуть
	const {name, email, password,secretkey} = req.body;
	if(secretkey !== 'steel'){
		return res.json(400,{error:'secretkey invalid'})
	}
	const user = await User.findOne({email});
	if(user){
			return res.json(400,{error:'Already exist'})
	}
	if(email === '' && password === ''){
		return res.json(400,{email:'enter e-mail',password:'enter password'})
	}
	if(email === ''){
		return res.json(400,{email:'enter e-mail'})
	}
	if(password === ''){
		return res.json(400,{password:'enter password'})
	}


	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(password, salt);
	const userNew = await new User({email, name, password: hash}).save();
	return res.json(200,{userNew:userNew})


});


const auth = (req, res, next) => {
	console.log('in router was?')
 console.log(req.session);
 

 if (req.isAuthenticated()) {
		return next();
	} else {
		return res.send(401,'You are not authenticated')
	}

};


// Авторизация
router.post("/login", async (req, res, next) => {
	const {email, password} = req.body;
	
	const user = await User.findOne({email});
	if(email === '' && password === ''){
		return res.json(400,{email:'enter e-mail',password:'enter password'})
	}
	if(email === ''){
		return res.json(400,{email:'enter e-mail'})
	}
	if(password === ''){
		return res.json(400,{password:'enter password'})
	}
	if (!user) {
		return res.send(400,{error:'Wrong password or mail'})
	}
	const isMatch = await bcrypt.compare(password, user.password);
	if (isMatch) {
		passport.authenticate('local',  (err, user, info) => {
			if (err) {
				return next(err);
			}
			if (!user) {
				//наверно понять надо
				return res.status(400).send([user, "Cannot2 log in", info])
			}
			req.logIn(user,  (err) => {
				if (err) {
					return next(err);
				}
				 return res.json(200,{user: user})
			});
		})(req, res, next);
	} else {
		return res.json(400,{error:'Wrong password or mail'})
	}


});


router.post('/admin', auth, async (req, res) => {
	const id = req.session.passport.user;
	let user = await User.findById(id);

	if (!user) {
		return	res.send( 400, 'User does not exist')
	}
	return res.json(200,{user: user})
});

router.get('/logout', (req, res) => {
	req.logOut();
	return res.send(200, 'logout');
});

router.post("/user",auth,  async (req, res) => {
	const id = req.session.passport.user;
	let user = await User.findById(id);

	if (!user) {
		return	res.send( 400, 'User does not exist')
	}
	return res.json(200,{user: user})
});

module.exports = router;
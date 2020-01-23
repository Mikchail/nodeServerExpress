const bcrypt = require('bcrypt');
const router = require("express").Router();

const config = require('../lib/config')
const passport = require('passport')
const User = require("../models/User");


router.post("/register", async (req, res) => {
	console.log(req);

	const {name, email, password} = req.body;


	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(password, salt);
	const userNew = await new User({email, name, password: hash}).save();

});


const auth = (req, res, next) => {
	console.log('in router was?')

	if (req.isAuthenticated()) {
		next();
	} else {
		res.set('Content-type', 'application/json').status(200).send('хелоо')
		// res.status(301).json({
		// 	status: 'error',
		// 	error: 'req body cannot be empty',
		// });
	}
	next();
};


// Авторизация
router.post("/login", async (req, res, next) => {
	const {email, password} = req.body;
	const user = await User.findOne({email});
	// console.log(user)
	if (!user) {
		res.status(400);
		res.send('User with this email does not exist')
	}
	const isMatch = await bcrypt.compare(password, user.password);
	console.log(isMatch)
	if (isMatch) {
		const payload = {
			id: user.id,
			name: user.name,
			email: user.email
		}
		passport.authenticate('local', function (err, user, info) {
			if (err) {
				return next(err);
			}
			if (!user) {
				return res.status(400).send([user, "Cannot2 log in", info])
			}
			req.logIn(user, function (err) {

				if (err) {
					return next(err);

				}
				 res.send("Logged in")
				// res.set('Content-type', 'application/json').status(200).send('хелоо')
			});
		})(req, res, next);
	}


});


// router.get('/admin', auth, (req, res) => {
// 	// res.send('Admin page!');
// });

router.get('/logout', (req, res) => {
	req.logOut();
	res.send(400, 'qwe21');
});
router.get("/user", auth, async (req, res) => {
	const id = req.session.passport.user;

	let user;
	try {
		user = await User.findById(id);
	} catch (e) {
		console.log(e)
	}

	if (!user) {
		res.status(400);
		res.send('User does not exist')
	}
	res.send(200,user)
	// res.set('Content-Type', ' application/json').send();
});

module.exports = router;
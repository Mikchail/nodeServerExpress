const bcrypt = require('bcrypt');
const router = require("express").Router();
const formidable = require('formidable');
const passport = require('passport');
const User = require("../models/User");
const fs = require('fs');
const path = require('path');

router.post("/register", async (req, res) => {
// проверок сюда заебнуть
	const {name, email, password, secretkey} = req.body;
	if (secretkey !== 'steel') {
		return res.json(400, {error: 'secretkey invalid'})
	}
	const user = await User.findOne({email});
	if (user) {
		return res.json(400, {error: 'Already exist'})
	}
	if (email === '' && password === '') {
		return res.json(400, {email: 'enter e-mail', password: 'enter password'})
	}
	if (email === '') {
		return res.json(400, {email: 'enter e-mail'})
	}
	if (password === '') {
		return res.json(400, {password: 'enter password'})
	}


	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(password, salt);
	const userNew = await new User({email, name, password: hash}).save();
	return res.json(200, {userNew: userNew})


});


const auth = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	} else {
		return res.send(401, 'You are not authenticated')
	}

};
const mustAuthenticated = (req, res, next) => {
	if (!req.isAuthenticated()) {
		return res.status(HTTPStatus.UNAUTHORIZED).send({});
	}
	next();
};

// Авторизация
router.post("/login", async (req, res, next) => {
	const {email, password} = req.body;

	const user = await User.findOne({email});
	if (email === '' && password === '') {
		return res.json(400, {email: 'enter e-mail', password: 'enter password'})
	}
	if (email === '') {
		return res.json(400, {email: 'enter e-mail'})
	}
	if (password === '') {
		return res.json(400, {password: 'enter password'})
	}
	if (!user) {
		return res.send(400, {error: 'Wrong password or mail'})
	}
	const isMatch = await bcrypt.compare(password, user.password);
	if (isMatch) {
		passport.authenticate('local', (err, user, info) => {
			if (err) {
				return next(err);
			}
			if (!user) {
				//наверно понять надо
				return res.status(400).send([user, "Cannot2 log in", info])
			}
			req.logIn(user, (err) => {
				if (err) {
					return next(err);
				}
				return res.json(200, {user: user})
			});
		})(req, res, next);
	} else {
		return res.json(400, {error: 'Wrong password or mail'})
	}


});


router.post('/admin', auth, async (req, res) => {
	const id = req.session.passport.user;
	let user = await User.findById(id);

	if (!user) {
		return res.send(400, 'User does not exist')
	}
	return res.json(200, {user: user})
});
router.post('/avatar', auth, async (req, res, next) => {
	const id = req.session.passport.user;
	let form = new formidable.IncomingForm();
	let upload = path.join('./public', 'upload');
	let fileName;
	if (!fs.existsSync(upload)) {
		fs.mkdirSync(upload);
	}
	form.uploadDir = path.join(process.cwd(), upload);
	form.parse(req, function (err, fields, files) {
		if (err) {
			return next(err);

		}
		if (files.file.size === 0) {
			fs.unlink(files.file.path);
			return res.json(400, {err: 'error not photo'});
		}

		fileName = path.join(upload, files.file.name);
		fs.rename(files.file.path, fileName, async function (err) {
			if (err) {
				fs.unlink(fileName);
				fs.rename(files.file.path, fileName);
				return res.json(400, {err: 'error not photo'});
			}
			let dir = fileName.substr(fileName.indexOf('\\'));
			let user = await User.findByIdAndUpdate(id, {$set: {avatar: dir}},
				function (err, result) {
					res.set({
						'Content-Type': 'text/plain',
					})
					if (err) {
						return res.json(400, err);
					} else {
						return res.json(200, result);
					}
				});
			// return res.json(200, {avatar: '123'})

		})

	});

});

router.get('/logout', mustAuthenticated, (req, res) => {
	req.logOut();
	return res.send(200, 'logout');
});

router.post("/user",  async (req, res) => {
	const id = req.session.passport.user;

	let user = await User.findById(id);

	if (!user) {
		return res.json(200, 'User does not exist')
	}
	return res.json(200, {user: user})
});

module.exports = router;
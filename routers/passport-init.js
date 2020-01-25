const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");


module.exports = passport => {

	passport.serializeUser(async (user, done) => {
		console.log("Сериализация: ");
		done(null, user.id);
	});

	passport.deserializeUser(async (id, done) => {
		const userInBase = await User.findById(id);
		console.log("Десериализация: ");
		const user = userInBase.id === id ? userInBase : false;
		done(null, user);
	});

	passport.use(
		new LocalStrategy({usernameField: "email"}, function (
			email,
			password,
			done
		) {
			console.dir("сначало здесь?", done);
			User.findOne({email: email}, function (err, user) {
				if (err) {
					return done(err);
				}

				if (!user) {
					return done(null, false, {message: "Incorrect username."});
				}
				// if (!user.validPassword(password)) {
				// 	return done(null, false, {message: "Incorrect password."});
				// }
				return done(null, user);
			});
		})
	);

};

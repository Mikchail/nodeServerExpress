const router = require("express").Router();
const Posts = require("../models/Posts");


router.get('/', async (req, res) => {
	const posts = await Posts.find()
	// let user;
	// if (req.session.name) {
	// 	user = req.session.name
	// }
	res.render('index', {posts: JSON.stringify(posts)});
});



router.get('/register', (req, res) => {
});


module.exports = router;
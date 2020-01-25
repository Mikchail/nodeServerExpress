const router = require("express").Router();

const config = require('../lib/config');
const passport = require('passport');
const Posts = require("../models/Posts");

const auth = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	} else {
		return res.send(401,'You are not authenticated')
	}

};

router.post("/posts",auth, async (req, res) => {
	console.log(req.body)
	const {title, content} = req.body;
	const postNew = await new Posts({content, title}).save();
	res.send(200,'done')
});


router.get("/posts",auth, async (req, res) => {
	const posts = await Posts.find();
	res.json(200,{posts});
	// const {title, content} = req.body;
	// const postNew = await new Posts({content, title}).save();

});
module.exports = router;
const router = require("express").Router();
const User = require('../models/User');
const Posts = require("../models/Posts");

router.get('/admin', async (req, res) => {
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
const router = require("express").Router();
const Posts = require("../models/Posts");

const auth = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	} else {
		return res.send(401, "You are not authenticated");
	}
};

router.post("/posts", auth, async (req, res) => {
	const {title, content} = req.body;
	const {user} = req;
	if (title === "") {
		return res.send(401, "need write title");
	}
	if (content === "") {
		return res.send(401, "need write content");
	}
	const postNew = await new Posts({content, title, user: user._id}).save();
	return res.json(200, {posts:postNew});
});
//в делите надо будет проверить

router.delete("/posts/:_id", auth, async (req, res) => {
	const _id = req.params._id;
	const user = req.user._id;
	const delPost = await Posts.findOneAndRemove({_id, user});
	if(delPost){
		return res.json(200, {success: 'пост успешно удален'});
	}
	return res.json(400, {error: "Это не ваш пост!"});
});

router.get("/posts/:_id", auth, async (req, res) => {
	const id = req.params._id;
	const onePost = await Posts.findById(id);
	if (onePost) {
		res.json(200, {onePost});
	} else {
		res.json(401, {succes: "scs"});
	}
});


router.put('/', auth, async (req, res) => {
	const {_id, title, content} = req.body;
	const user = req.state.user._id;
	res.send = await Posts.findByIdAndUpdate(
		{_id, user},
		{$set: {title, content}},
		{new: true}
	)
});

router.get("/posts", auth, async (req, res) => {
	const {query} = req;
	console.log(query)
	const {skip, limit} = query;
	delete query.skip;
	delete query.limit;
	const q =
		"users" in query ? {user: {$in: query.users.split(",")}} : query;

	console.log(q)
	const count =await Posts.count(q);
	console.log(count)

	const posts = await Posts.find(q)
		.sort({createddate: -1})
		.skip(+skip)
		.limit(+limit);
	res.set("x-total-count", count).json(200, {posts});
});


module.exports = router;

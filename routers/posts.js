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
  const { title, content } = req.body;
  const { user } = req;
  if (title === "") {
    return res.send(401, "need write title");
  }
  if (content === "") {
    return res.send(401, "need write content");
  }
  const postNew = await new Posts({ content, title, user: user._id }).save();
  return res.json(200, { posts: postNew });
});
//в делите надо будет проверить

router.delete("/posts/:_id", auth, async (req, res) => {
  const _id = req.params._id;
  const user = req.user._id;
  const delPost = await Posts.findOneAndRemove({ _id, user });
  if (delPost) {
    return res.json(200, { success: 'пост успешно удален' });
  }
  return res.json(400, { error: "Это не ваш пост!" });
});
router.delete("/posts/:postId/comments/:commentId", auth, async (req, res) => {
  const { postId, commentId } = req.params;
  const user = req.user._id;

  const post = await Posts.findByIdAndUpdate({ _id:postId, user })
  console.log(post)
  if (!post) {
    res.json(400, 'Post has not been found')
  }
  console.log(req.body)
  const commentIndex = post.comments
    .findIndex((c) => c._id.toString() === commentId)
    console.log(commentIndex)
  if (commentIndex < 0) {
    res.json(400, 'Comment has not been found')
  }
  post.comments.splice(commentIndex, 1)
  const posts = await post.save()
  return res.json(200, {posts});
});
router.get("/posts/:_id", auth, async (req, res) => {
  const id = req.params._id;
  const onePost = await Posts.findById(id);
  if (onePost) {
    res.json(200, { onePost });
  } else {
    res.json(401, { succes: "scs" });
  }
});


router.put('/', auth, async (req, res) => {
  const { _id, title, content } = req.body;
  const user = req.state.user._id;
  res.send = await Posts.findByIdAndUpdate(
    { _id, user },
    { $set: { title, content } },
    { new: true }
  )
});

router.get("/posts", auth, async (req, res) => {
  const { query } = req;
  const { skip, limit } = query;
  delete query.skip;
  delete query.limit;
  const q =
    "users" in query ? { user: { $in: query.users.split(",") } } : query;

  const count = await Posts.count(q);

  const posts = await Posts.find(q)
    .sort({ createddate: -1 })
    .skip(+skip)
    .limit(+limit);
  res.set("x-total-count", count).json(200, { posts });
});


router.post("/posts/:_id/comments", auth, async (req, res) => {
  const post = await Posts.findById(req.params._id)
  if (!post) {
    return res.json(404, { error: 'нет поста' })
  }
  const { comment } = req.body;

  if (!comment) {
    return res.json(400, { error: 'пустой комент' });
  }
  post.comments.unshift({ body: comment, user: req.user._id })
  const comm = await post.save()
  return res.json(200, { comments: comm.comments });

});

module.exports = router;

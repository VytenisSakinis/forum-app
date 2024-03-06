const express = require("express");
const router = express.Router();
const CommentModel = require("../models/comment");
const PostModel = require('../models/post')
const UserModel = require('../models/user')

router.get("/", async (req, res) => {
	const comments = await CommentModel.find({});
	res.status(200).json(comments);
});
router.get("/post/:postId", async (req, res) => {
	try {
	const comments = await CommentModel.find({ post: req.params.postId})
	res.status(200).json(comments);
	} catch (err) {
		res.redirect("/?error=Įrašas buvo nerastas")
	}
});
router.get("/user/:userId", async (req, res) => {
	try {
		const comments = await CommentModel.find({ author: req.params.postId})
		res.status(200).json(comments);
		} catch (err) {
			res.redirect("/?error=Įrašas buvo nerastas")
		}
		
});
router.post("/:postId", async (req, res) => {
	try {
	const { content } = req.body;
	const post = await PostModel.findOne({ _id: req.params.postId })
	if(!req.session.user?.loggedIn)
	{
		return res.status(403).json({ message: "You must be Logged in"})
	}
	const newComment = new CommentModel({ 
		content, 
		author: req.session.user.id, 
		post: req.params.postId 
	})
	await newComment.save()
	post.commentsCount++;
	post.lastComment = Date.now() + (1000 * 60 * 60 * 2); 
	post.lastCommentBy = req.session.user.id;
	post.save()
	UserModel.findOneAndUpdate({ _id: req.session.user.id }, { $inc: {commentsCount: 1 } }).exec()
	res.redirect(`/post/${req.params.postId}?message=Sėkmingai pridėtas komentaras`)
	} catch (err) {
        res.status(400).json({ message: "Post not found!" })
    }
});
router.delete("/:id", async (req, res) => {
	// Komentaro istrynimas
});
router.put("/:id", async (req, res) => {
	// Komentaro atnaujinimas
});

module.exports = router;

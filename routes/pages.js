const express = require("express");
const router = express.Router();
const UserModel = require("../models/user");
const PostModel = require("../models/post");
const CommentModel = require("../models/comment")

router.get("/", async (req, res) => {
	//index.ejs failo atvaizdavimas iš views aplanko

	const posts = await PostModel.find({}).populate({
		path: "author",
		select: "username email",
	}).populate({
		path: "lastCommentBy",
		select: "username",
	});
	console.log(posts[0]);
	const config = {
		title: "Test forum",
		username: "Justelio19",
		list: ["Product1", "Product2", "Milk", "Choclate"],
		activeTab: "Home",
		loggedIn: !!req.session.user?.loggedIn,
		message: req.query.message,
		error: req.query.error,
		posts,
	};
	res.render("index", config);
	//Kartu paduodami ir parametrai EJS failui
});

router.get("/register", (req, res) => {
	if (!!req.session.user?.loggedIn) {
		return res.redirect("/");
	}
	const config = {
		activeTab: "Register",
		title: "Test forum",
		loggedIn: !!req.session.user?.loggedIn,
		error: req.query.error,
	};
	res.render("register", config);
	//Register routas skirtas registracijai
});
router.get("/login", (req, res) => {
	if (!!req.session.user?.loggedIn) {
		return res.redirect("/");
	}
	const config = {
		activeTab: "Login",
		title: "Test forum - authentication",
		loggedIn: !!req.session.user?.loggedIn,
		error: req.query.error,
	};
	res.render("login", config);
	//Login routas skirtas prisijungimui
});
router.get("/my-profile", async (req, res) => {
	// Patikrinimas ar vartotojas yra prisijungęs
	if (!req.session.user?.loggedIn) {
		return res.redirect("/login?error=Jums reikia prisijungti prie paskyros");
	}

	const userData = await UserModel.findOne({ _id: req.session.user.id });
	console.log(userData);
	const config = {
		activeTab: "Profile",
		title: "Test forum",
		profilePhoto: userData.profilePicture,
		loggedIn: !!req.session.user?.loggedIn,
		username: userData.username,
		email: userData.email,
		birthDate: userData.birthDate,
		postsCount: userData.postsCount,
		commentsCount: userData.commentsCount,
		likes: userData.likes,
		dislikes: userData.dislikes,
	};
	res.render("profile", config);
});
router.get("/new-post", (req, res) => {
	if (!req.session.user?.loggedIn) {
		return res.redirect("/login?error=Jums reikia prisijungti prie paskyros");
	}
	const config = {
		title: "Test forum",
		activeTab: "",
		loggedIn: !!req.session.user?.loggedIn,
	};
	res.render("new-post", config);
	//Kartu paduodami ir parametrai EJS failui
});

router.get("/profile/:id", async (req, res) => {
	try {
		const userData = await UserModel.findOne({ _id: req.params.id });
		console.log(userData);
		const config = {
			activeTab: "Profile",
			title: "Test forum",
			profilePhoto: userData.profilePicture,
			loggedIn: !!req.session.user?.loggedIn,
			username: userData.username,
			email: userData.email,
			birthDate: userData.birthDate,
			postsCount: userData.postsCount,
			commentsCount: userData.commentsCount,
			likes: userData.likes,
			dislikes: userData.dislikes,
			id: req.params.id
		};
		res.render("foreign-profile", config);
	} catch (err) {
		res.redirect("/?error=Netinkamas vartotojo id")
	}
});
router.get("/post/:id", async (req, res) => {
	try {
		const post = await PostModel.findOne({ _id: req.params.id }).populate(
			"author"
		);
		post.viewsCount++
		post.save()
		const comments = await CommentModel.find({ post: req.params.id }).populate({
			path: "author",
			select: "username",
		})
		const config = {
			title: "Test forum",
			activeTab: "",
			loggedIn: !!req.session.user?.loggedIn,
			post,
			user: post.author,
			message: req.query.message,
			error: req.query.error,
			comments,
		};
		res.render("post", config);
	} catch (err) {
		res.redirect("/?error=Nerastas irasas");
	}
});
module.exports = router;

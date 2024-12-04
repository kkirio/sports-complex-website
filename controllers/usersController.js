const User = require("../models/user");
const passport = require("passport");


const getUserParams = (body) => {
	return {
		name: body.name,
		email: body.email,
		password: body.password,
	};
};


module.exports = {

	/* Displays the next view according to the redirect path */
	redirectView: (req, res, next) => {
		let redirectPath = res.locals.redirect;
		if (redirectPath) res.redirect(redirectPath);
		else next();
	},
	
    /* Return a promise of all users */
	index: (req, res, next) => {
		User.find({})
		.populate("membership") // Allow access to type/length in view
		.then((users) => {
			res.locals.users = users;
			next();
		})
		.catch((error) => {
			console.log(`Error fetching users: ${error.message}`);
			next(error);
		});
	},
    /* Display a table containing all users and their information */
	indexView: (req, res) => {
		res.render("users/index");
	},

	/* Displays a form to create users */
	new: (req, res) => {
		res.render("users/new");
	},
	/* Add a new user to the database */
	create: (req, res, next) => {
		if (req.skip) return next();
		let newUser = getUserParams(req.body);
		newUser["memberships"] = [];
		newUser["isAdmin"] = false;		// Default is false
        User.register(newUser, req.body.password, (error, user) => {
		if (user) {
			req.flash(
			"success",
			`${user.name}'s account created successfully!`
			);
			res.locals.redirect = "login";
			next();
		} else {
			req.flash(
			"error",
			`Failed to create user account because: ${error.message}.`
			);
			res.locals.redirect = "new";
			next();
		}
		});
	},

	/* Returns a promise of one user */
	show: (req, res, next) => {
		let userId = req.params.id;
		User.findById(userId)
		.populate("membership") // Allow access to type/length in view
		.then((user) => {
			res.locals.user = user;
			next();
		})
		.catch((error) => {
			console.log(`Error fetching user by ID: ${error.message}`);
			next(error);
		});
	},
	/* Display information of one user */
	showView: (req, res) => {
		res.render("users/show");
	},

	/* Display a form to edit user information */
	editView: (req, res) => {
		res.render("users/edit");
	},
	/* Update user information in database */
	update: (req, res, next) => {
		let userId = req.params.id;
		let userParams = getUserParams(req.body);
		User.findByIdAndUpdate(userId, { $set: userParams })
		.then((user) => {
			res.locals.redirect = `/users/${userId}`;
			res.locals.user = user;
			next();
		})
		.catch((error) => {
			console.log(`Error updating user by ID: ${error.message}`);
			next(error);
		});
	},

	/* Delete user information from database */
	delete: (req, res, next) => {
		let userId = req.params.id;
		User.findByIdAndRemove(userId)
		.then(() => {
			res.locals.redirect = "/";
			next();
		})
		.catch((error) => {
			console.log(`Error deleting user by ID: ${error.message}`);
			next();
		});
	},

	/* Display login form */
	login: (req, res) => {
		res.render("users/login");
	},

	/* Log in with passport module */
	authenticate: passport.authenticate("local", {
		failureRedirect: "users/login",
		failureFlash: "Failed to login.",
		successRedirect: "/",
	}),

	/* Log out with passport module */
	logout: (req, res, next) => {
		req.logout(function (err) {
		if (err) {
			return next(err);
		}
		req.flash("success", "You have been logged out.");
		res.locals.redirect = "/";
		next();
		});
	},

	/* This function can be used to protect routes 
	that can be accessed only if a user is an admin or
	performing an action on their own account. */
	isAuthenticated: (req, res, next) => {
		// Check that the user is logged in
		if (req.isAuthenticated()) {
			// Check that the user is performing actions on their own account
			// Or is an admin
			if (req.user.isAdmin || req.params.id == req.user._id) {
				next();
			} else {
				req.flash("error", "You cannot perform this action on another account.");
				res.redirect("login");
			}
		} else {
		req.flash("error", "You must be logged in to access this page.");
		res.redirect("/users/login");
		}
	},

	/* This function can be used to protect routes 
	that can be accessed only if a user is an admin. */
	isAdmin: (req, res, next) => {
		if (req.isAuthenticated() && req.user.isAdmin) {
		next();
		} else {
		req.flash("error", "You must be an admin to access this page.");
		res.redirect("/users/login");
		}
	},

	/* Validate input to match user schema */
	validate: (req, res, next) => {
		console.log(req.body);
		req.sanitizeBody("email").trim();
		req.check("name", "Name cannot be empty").notEmpty();
		req.check("email", "Email is invalid").isEmail();
		req.check("password", "Password cannot be empty").notEmpty();
		req.getValidationResult().then((error) => {
		if (!error.isEmpty()) {
			let messages = error.array().map((e) => e.msg);
			req.skip = true;
			req.flash("error", messages.join(" and "));
			res.locals.redirect = "new";
			next();
		} else {
			next();
		}
		});
	},
};

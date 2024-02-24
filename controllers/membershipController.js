const Membership = require("../models/membership");
const User = require("../models/user");

//create a membership  parameter function to reduce code redundancy
const getMembershipParams = (body) => {
  return {
    type: body.type,
    duration: body.duration,
    price: body.price,
  };
};

module.exports = {

	/* Displays the next view according to the redirect path */
	redirectView: (req, res, next) => {
		let redirectPath = res.locals.redirect;
		if (redirectPath) res.redirect(redirectPath);
		else next();
	},

	/* Makes all memberships available to view */
	index: (req, res, next) => {
		Membership.find()
		.then((memberships) => {
			res.locals.memberships = memberships;
			next();
		})
		.catch((error) => {
			console.log(`Error fetching memberships: ${error.message}`);
			next(error);
		});
	},
	/* Displays a table containing all memberships */
	indexView: (req, res) => {
		res.render("memberships/index");
	},

	/* Displays a form to create a membership */
	new: (req, res) => {
		if (req.user) {
		res.render("memberships/new");
		} else {
		req.flash("error", "You must be logged in to create a membership.");
		res.redirect("/users/login");
		}
	},
	/* Creates a new membership in the database */
	create: (req, res, next) => {
		let membershipParams = getMembershipParams(req.body);
		Membership.create(membershipParams)
		.then((membership) => {
			req.flash("success", `${membership.type} was created successfully!`);
			res.locals.redirect = "/memberships";
			res.locals.membership = memberships;
			next();
		})
		.catch((error) => {
			console.log(`Error saving membership: ${error.message}`);
			res.locals.redirect = "/memberships";
			req.flash(
			"error",
			`Failed to create membership because: ${error.message}`
			);
			next();
		});
	},

	/* Makes specified membership available to view */
	show: (req, res, next) => {
		let membershipId = req.params.id;
		Membership.findById(membershipId)
		.then((membership) => {
			res.locals.membership = membership;
			next();
		})
		.catch((error) => {
			console.log(`Error fetching membership by ID: ${error.message}`);
			next(error);
		});
	},
	/* Displays information of one membership */
	showView: (req, res) => {
		res.render("memberships/show");
	},

	/* Displays a form to edit membership information */
	editView: (req, res) => {
		res.render("memberships/edit")
	},
	/* Updates membership information in database */
	update: (req, res, next) => {
		let membershipId = req.params.id,
		membershipParams = getMembershipParams(req.body);
		Membership.findByIdAndUpdate(membershipId, {
		$set: membershipParams,
		})
		.then((membership) => {
			res.locals.redirect = `/memberships/${membershipId}`;
			res.locals.membership = membership;
			next();
		})
		.catch((error) => {
			console.log(`Error updating membership by ID: ${error.message}`);
			next(error);
		});
	},

	/* Adds the specified membership to the current user's profile */
	enrollUser: (req, res, next) => {
		let user = res.locals.currentUser,
            membershipId = req.params.id;
		Membership.findById(membershipId)
			.then((membership) => {
				// User already has the membership
				if (user.membership.includes(membership._id)) {
					req.flash("error", 
					`You are already registered for the ${membership.type} membership.`);
				// Add membership to user
				} else {
					user.membership.push(membership._id);
					user.save();
					req.flash("success", 
					`You are now enrolled as a ${membership.type} member.`);
				}
				res.locals.redirect = "/memberships";
				next();
			})
			.catch((error) => {
				req.flash("error",`Error enrolling in membership: ${error.message}`);
				next(error);
			});
	},

	/* Deletes membership from database */
	delete: (req, res, next) => {
		if (req.user) {
		let membershipId = req.params.id;
		Membership.findByIdAndRemove(membershipId)
			.then(() => {
			res.locals.redirect = "/memberships";
			next();
			})
			.catch((error) => {
			console.log(`Error deleting membership by ID: ${error.message}`);
			next();
			});
		} else {
		req.flash("error", "You must be logged in to delete a membership.");
		res.redirect("/users/login");
		}
	},

	/* Ensures req fields follow model specifications */
	validate: (req, res, next) => {
		req.check("type", "Type cannot be empty.").notEmpty();
		req.check("duration", "Duration cannot be empty.").notEmpty();
		req.check("price", "Price cannot be empty.").notEmpty();
		req.getValidationResult().then((error) => {
		if (!error.isEmpty()) {
			let messages = error.array().map((e) => e.msg);
			req.skip = true;
			req.flash("error", messages.join(" and "));
			res.locals.redirect = "/memberships/new";
			next();
		} else {
			next();
		}
		});
	},
};

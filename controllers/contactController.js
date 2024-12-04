const Contact = require("../models/contact");

const getParams = (body) => {
	return {
		name: body.name,
		email: body.email,
		title: body.title,
		issue: body.issue,
	}
};

module.exports = {

	/* Displays the next view according to the redirect path */
	redirectView: (req, res, next) => {
		let redirectPath = res.locals.redirect;
		if (redirectPath) res.redirect(redirectPath);
		else next();
	},

	/* Makes all contact queries available to view */
    index: (req, res, next) => {
		Contact.find()
		.then((contacts) => {
			res.locals.contacts = contacts;
			next();
		})
		.catch((error) => {
			console.log(`Error fetching contact message: ${error.message}`);
			next(error);
		});
    },

    /* Displays a table containing all contact queries */
    indexView: (req, res) => {
		res.render("contacts/index");
    },
	
	/* Displays a form to create contact queries */
	new: (req, res) => {
		res.render("contacts/new")
	},
	
	/* Creates a new contact query in the database */
	create: (req, res, next) => {
		if (req.skip) return next();
		let contactParams = getParams(req.body);
        Contact.create(contactParams)
		.then(contact => {
			req.flash("success",
				`${contact.title} was sent. 
				Please expect a reply in 3-5 business days.`);
			res.locals.redirect = "/";
			next();
		})
		.catch(error => {
			req.flash("error",
				`Failed to send message because: ${error.message}`);
			res.locals.redirect = "/contact/new";
			next();
		});
	},

	/* Makes specified contact query available to view */
	show: (req, res, next) => {
		let contactId = req.params.id;
		Contact.findById(contactId)
		.then((contact) => {
			res.locals.contact = contact;
			next();
		})
		.catch((error) => {
			console.log(`Error fetching contact message by ID: ${error.message}`);
			next(error);
		});
	},

	/* Displays information of one contact query */
	showView: (req, res) => {
		res.render("contacts/show");
	},

	/* Deletes contact information from database */
	delete: (req, res, next) => {
		let contactId = req.params.id;
		Contact.findByIdAndRemove(contactId)
		.then(() => {
			res.locals.redirect = "/contact";
			next();
		})
		.catch((error) => {
			console.log(`Error deleting contact message by ID: ${error.message}`);
			next();
		});
	},

	/* Ensures req fields follow model specifications */
	validate: (req, res, next) => {
		console.log(req.body);
		req.check("name", "Name cannot be empty").notEmpty();
		req.check("email", "Email is invalid").isEmail();
		req.check("title", "Title cannot be empty").notEmpty();
		req.check("issue", "Issue cannot be empty").notEmpty();
		req.getValidationResult().then((error) => {
			if (!error.isEmpty()) {
				let messages = error.array().map((e) => e.msg);
				req.skip = true;
				req.flash("error", messages.join(" and "));
				res.locals.redirect = "/contact/new";
			}
		});
		next();
	  },
};



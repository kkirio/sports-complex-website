const Facility = require("../models/facility");
const User = require("../models/user");

//create a facility parameter function to reduce code redundancy
const getFacilityParams = (body) => {
  return {
    name: body.name,
    type: body.type,
    description: body.description,
  };
};
//CRUD functions for facility data
module.exports = {

	/* Displays the next view according to the redirect path */
	redirectView: (req, res, next) => {
		let redirectPath = res.locals.redirect;
		if (redirectPath) res.redirect(redirectPath);
		else next();
	},

	/* Makes all facilities available to view */
	index: (req, res, next) => {
		Facility.find()
		.then((facilities) => {
			res.locals.facilities = facilities;
			next();
		})
		.catch((error) => {
			console.log(`Error fetching facilities: ${error.message}`);
			next(error);
		});
	},
    /* Displays a table containing all facilities */
	indexView: (req, res) => {
		res.render("facilities/index");
	},

	/* Display form to create a facility */
	new: (req, res) => {
		res.render("facilities/new");
	},
	/* Creates a new event in the database */
	create: (req, res, next) => {
		if (req.skip) next();
		let facilityParams = getFacilityParams(req.body);
		Facility.create(facilityParams)
		.then((facility) => {
			req.flash("success", `${facility.title}'s created successfully!`);
			res.locals.redirect = "/facilities";
			res.locals.facility = facility;
			next();
		})
		.catch((error) => {
			console.log(`Error saving facility: ${error.message}`);
			res.locals.redirect = "/facilities";
			req.flash(
			"error",
			`Failed to create facility because: ${error.message}`
			);
			next();
		});
	},

	/* Makes specified facility available to view */
	show: (req, res, next) => {
		let facilityId = req.params.id;
		Facility.findById(facilityId)
		.then((facility) => {
			res.locals.facility = facility;
			next();
		})
		.catch((error) => {
			console.log(`Error fetching facility by ID: ${error.message}`);
			next(error);
		});
	},
  	/* Displays information of one facility */
	showView: (req, res) => {
		res.render("facilities/show");
	},

	/* Displays a form to edit facility information */
	editView: (req, res) => {
		res.render("facilities/edit");
	},
	/* Updates facility information in database */
	update: (req, res, next) => {
		let facilityId = req.params.id,
		facilityParams = getFacilityParams(req.body);
		Facility.findByIdAndUpdate(facilityId, {
		$set: facilityParams,
		})
		.then((facility) => {
			res.locals.redirect = `/facilities/${facilityId}`;
			res.locals.facility = facility;
			next();
		})
		.catch((error) => {
			console.log(`Error updating facility by ID: ${error.message}`);
			next(error);
		});
	},

  	/* Deletes facility from database */
	delete: (req, res, next) => {
		let facilityId = req.params.id;
		Facility.findByIdAndRemove(facilityId)
		.then(() => {
		res.locals.redirect = "/facilities";
		next();
		})
		.catch((error) => {
		console.log(`Error deleting facility by ID: ${error.message}`);
		next();
		});
	},

  	/* Ensures req fields follow model specifications */
	validate: (req, res, next) => {
		req.check("name", "Name cannot be empty.").notEmpty();
		req.check("description", "Description cannot be empty.").notEmpty();
		req.check("type", "Type cannot be empty.").notEmpty();
		req.getValidationResult().then((error) => {
		if (!error.isEmpty()) {
			let messages = error.array().map((e) => e.msg);
			req.skip = true;
			req.flash("error", messages.join(" and "));
			res.locals.redirect = "/facilities/new";
			next();
		} else {
			next();
		}
		});
	},
};

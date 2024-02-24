const Event = require("../models/event");
const User = require("../models/user");

//create a event parameter function to reduce code redundancy
const getEventParams = (body) => {
  return {
    name: body.name,
    description: body.description,
    location: body.location,
    date: body.date,
  };
};
//CRUD functions for events data manipulation
module.exports = {

	/* Displays the next view according to the redirect path */
	redirectView: (req, res, next) => {
		let redirectPath = res.locals.redirect;
		if (redirectPath) res.redirect(redirectPath);
		else next();
	},

	/* Makes all events available to view */
	index: (req, res, next) => {
		Event.find({})
		.then((events) => {
			res.locals.events = events;
			next();
		})
		.catch((error) => {
			console.log(`Error fetching events: ${error.message}`);
			next(error);
		});
	},
    /* Displays a table containing all events */
	indexView: (req, res) => {
		res.render("events/index");
	},

	/* Displays a form to create an event */
	new: (req, res) => {
		res.render("events/new");
	},
	/* Creates a new event in the database */
	create: (req, res, next) => {
		if (req.skip) return next();
		let eventParams = getEventParams(req.body);
		Event.create(eventParams)
		.then((event) => {
		req.flash(
			"success",
			`${event.name} was created successfully!`
		);
		res.locals.redirect = "/events";
		res.locals.event = event;
		next();
		})
		.catch((error) => {
		console.log(`Error saving event: ${error.message}`);
		res.locals.redirect = "/events/new";
		req.flash(
			"error",
			`Failed to create event because: ${error.message}`
		);
		next();
		});
	},

	/* Makes specified event available to view */
	show: (req, res, next) => {
		let eventId = req.params.id;
		Event.findById(eventId)
		.then((event) => {
			res.locals.event = event;
			next();
		})
		.catch((error) => {
			console.log(`Error fetching an event by ID: ${error.message}`);
			next(error);
		});
	},
	/* Displays information of one event */
	showView: (req, res) => {
		res.render("events/show");
	},

	/* Displays a form to edit event information */
	edit: (req, res, next) => {
		let eventId = req.params.id
		Event.findById(eventId)
		.then((event) => {
		res.render("events/edit", {
			event: event,
		});
		})
		.catch((error) => {
		console.log(`Error fetching event by ID: ${error.message}`);
		next(error);
		});
	},
	/* Updates event information in database */
	update: (req, res, next) => {
		let eventId = req.params.id,
		eventParams = getEventParams(req.body);
		Event.findByIdAndUpdate(eventId, {
		$set: eventParams,
		})
		.then((event) => {
			res.locals.redirect = `/events/${eventId}`;
			res.locals.event = event;
			next();
		})
		.catch((error) => {
			console.log(`Error updating event by ID: ${error.message}`);
			next(error);
		});
	},

	/* Deletes event from database */
	delete: (req, res, next) => {
	let eventId = req.params.id
	Event.findByIdAndRemove(eventId)
		.then(() => {
		res.locals.redirect = "/events";
		next();
		})
		.catch((error) => {
		console.log(`Error deleting event by ID: ${error.message}`);
		next();
		});
	},

	/* Ensures req fields follow model specifications */
	validate: (req, res, next) => {
		req.check("name", "Name cannot be empty.").notEmpty();
		req.check("description", "Description cannot be empty.").notEmpty();
		req.check("location", "Location cannot be empty.").notEmpty();
		req.check("date", "date cannot be empty.").notEmpty();
		req.getValidationResult().then((error) => {
		if (!error.isEmpty()) {
			let messages = error.array().map((e) => e.msg);
			req.skip = true;
			req.flash("error", messages.join(" and "));
			res.locals.redirect = "/events/new";
			next();
		} else {
			next();
		}
		});
	},
};

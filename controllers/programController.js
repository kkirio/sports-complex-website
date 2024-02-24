const Program = require("../models/program");
const User = require("../models/user");

//function to create program data in MongoDB
const getProgramParams = (body) => {
  return {
    name: body.name,
    description: body.description,
    schedule: body.schedule,
    instructor: body.instructor,
  };
};

//CRUD functions for program
module.exports = {

	/* Displays the next view according to the redirect path */
	redirectView: (req, res, next) => {
		let redirectPath = res.locals.redirect;
		if (redirectPath) res.redirect(redirectPath);
		else next();
	},

	/* Makes all programs available to view */
	index: (req, res, next) => {
		Program.find()
		.then((programs) => {
			res.locals.programs = programs;
			next();
		})
		.catch((error) => {
			console.log(`Error fetching programs: ${error.message}`);
			next(error);
		});
	},
	/* Displays a table containing all programs */
	indexView: (req, res) => {
		res.render("programs/index");
	},

	/* Displays a form to create a program */
	new: (req, res) => {
		res.render("programs/new");
	},
	/* Creates a new program in the database */
	create: (req, res, next) => {
		let programParams = getProgramParams(req.body);

		Program.create(programParams)
		.then((program) => {
			req.flash("success", `${program.name} was created successfully!`);
			res.locals.redirect = "/programs";
			res.locals.program = program;
			next();
		})
		.catch((error) => {
			res.locals.redirect = "/programs";
			req.flash(
			"error",
			`Failed to create program because: ${error.message}`
			);
			next();
		});
	},
	
	/* Makes specified program available to view */
	show: (req, res, next) => {
		let programId = req.params.id;
		Program.findById(programId)
		.then((program) => {
			res.locals.program = program;
			next();
		})
		.catch((error) => {
			console.log(`Error fetching program by ID: ${error.message}`);
			next(error);
		});
	},
  	/* Displays information of one program */
	showView: (req, res) => {
		res.render("programs/show");
	},

	/* Displays a form to edit program information */
	edit: (req, res, next) => {
		let programId = req.params.id;
		Program.findById(programId)
		.then((program) => {
			res.render("programs/edit", {
			program: program,
			});
		})
		.catch((error) => {
			console.log(`Error fetching program by ID: ${error.message}`);
			next(error);
		});
	},
	/* Updates program information in database */
	update: (req, res, next) => {
		let programId = req.params.id,
		programParams = getProgramParams(req.body);
		Program.findByIdAndUpdate(programId, {
		$set: programParams,
		})
		.then((program) => {
			res.locals.redirect = `/programs/${programId}`;
			res.locals.program = program;
			next();
		})
		.catch((error) => {
			console.log(`Error updating program by ID: ${error.message}`);
			next(error);
		});
  	},

	/* Deletes membership from database */
	delete: (req, res, next) => {
		let programId = req.params.id;
		Program.findByIdAndRemove(programId)
		.then(() => {
			res.locals.redirect = "/programs";
			next();
		})
		.catch((error) => {
			console.log(`Error deleting program by ID: ${error.message}`);
			next();
		});
	},

	/* Ensures req fields follow model specifications */
	validate: (req, res, next) => {
		req.check("name", "Name cannot be empty.").notEmpty();
		req.check("description", "Description cannot be empty.").notEmpty();
		req.check("schedule", "Schedule cannot be empty.").notEmpty();
		req.check("instructor", "Instructor cannot be empty.").notEmpty();
		req.getValidationResult().then((error) => {
		if (!error.isEmpty()) {
			let messages = error.array().map((e) => e.msg);
			req.skip = true;
			req.flash("error", messages.join(" and "));
			res.locals.redirect = "/programs/new";
			next();
		} else {
			next();
		}
		});
	},
};

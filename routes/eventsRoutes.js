const router = require("express").Router();
const eventsController = require("../controllers/eventsController");
const usersController = require("../controllers/usersController");

// Display all events
router.get("/", eventsController.index, eventsController.indexView);

// Create new events. Restricted to admin.
router.get("/new", usersController.isAdmin, eventsController.new);
router.post("/create",
	usersController.isAdmin,
	eventsController.validate,
	eventsController.create,
	eventsController.redirectView);

// Display one event
router.get("/:id", eventsController.show, eventsController.showView);

// Edit an event. Restricted to admin.
router.get("/:id/edit", usersController.isAdmin, eventsController.edit);
router.put("/:id/update",
	usersController.isAdmin,
	eventsController.validate,
	eventsController.update,
	eventsController.redirectView
);

// Delete an event. Restricted to admin.
router.delete("/:id/delete",
	usersController.isAdmin,
	eventsController.delete,
	eventsController.redirectView
);

module.exports = router;
const router = require("express").Router();
const contactController = require("../controllers/contactController");
const usersController = require("../controllers/usersController");


// Display all contact messages. Restricted to admin.
router.get("/", 
	usersController.isAdmin,
	contactController.index,
	contactController.indexView);

// Create contact message. Available to all website visitors.
router.get("/new", contactController.new);
router.post("/create",
	contactController.validate,
	contactController.create,
	contactController.redirectView);

// Display one contact message. Restricted to admin.
router.get("/:id", 
	usersController.isAdmin,
	contactController.show,
	contactController.showView);

// Delete a contact message. Restricted to admin.
router.delete("/:id/delete",
usersController.isAdmin,
contactController.delete,
contactController.redirectView);

module.exports = router;
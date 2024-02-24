const router = require("express").Router();
const usersController = require("../controllers/usersController");

// Display all users. Restricted to admin.
router.get("/", 
	usersController.isAdmin,
	usersController.index,
	usersController.indexView);

// Create a new user
router.get("/new", usersController.new);
router.post("/create",
  usersController.validate,
  usersController.create,
  usersController.redirectView);

// Login and logout
router.get("/login", usersController.login);
router.post("/login", usersController.authenticate);
router.get("/logout", usersController.logout, usersController.redirectView);

// Display one user. Restricted to the current user or admin.
router.get("/:id", 
	usersController.isAuthenticated,
	usersController.show,
	usersController.showView);

// Edit a user. Restricted to the current user or admin.
router.get("/:id/edit",
	usersController.isAuthenticated,
	usersController.show,
	usersController.editView);
router.put("/:id/update", 
	usersController.isAuthenticated,
	usersController.update,
	usersController.redirectView);

// Delete a user. Restricted to the current user or admin.
router.delete(
	"/:id/delete",
	usersController.isAuthenticated,
	usersController.delete,
	usersController.redirectView);

module.exports = router;

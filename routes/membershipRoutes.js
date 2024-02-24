const router = require("express").Router();
const membershipController = require("../controllers/membershipController");
const usersController = require("../controllers/usersController");

// Display all memberships
router.get("/", membershipController.index, membershipController.indexView);

// Create new memberships. Restricted to admin.
router.get("/new", usersController.isAdmin,  membershipController.new,);
router.post("/create",
	usersController.isAdmin,
	membershipController.validate,
	membershipController.create, 
	membershipController.redirectView);

// Display one membership
router.get("/:id", membershipController.show, membershipController.showView);

// Edit a membership. Restricted to admin.
router.get("/:id/edit", 
	usersController.isAdmin,
	membershipController.show,
	membershipController.editView);
router.put(
  "/:id/update",
  usersController.isAdmin,
  membershipController.validate,
  membershipController.update,
  membershipController.redirectView
);

// Enroll a user in a membership. Restricted to logged in users.
router.get("/:id/enrollUser",
	usersController.isAuthenticated,
	membershipController.enrollUser,
	membershipController.redirectView);


// Delete a membership. Restricted to admin.
router.delete(
  "/:id/delete",
  usersController.isAdmin,
  membershipController.delete,
  membershipController.redirectView
);

module.exports = router;
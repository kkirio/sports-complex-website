const router = require("express").Router();
const programController = require("../controllers/programController");
const usersController = require("../controllers/usersController");

// Display all programs
router.get("/", programController.index, programController.indexView);

// Create a new program. Restricted to admin.
router.get("/new", usersController.isAdmin, programController.new,);
router.post("/create",
	usersController.isAdmin,
	programController.validate,
	programController.create, 
	programController.redirectView);

// Display one program
router.get("/:id", programController.show, programController.showView);

// Edit a program. Restricted to admin.
router.get("/:id/edit", usersController.isAdmin, programController.edit);
router.put(
  "/:id/update",
  usersController.isAdmin,
  programController.validate,
  programController.update,
  programController.redirectView
);

// Delete a program. Restricted to admin.
router.delete(
  "/:id/delete",
  usersController.isAdmin,
  programController.delete,
  programController.redirectView
);

module.exports = router;
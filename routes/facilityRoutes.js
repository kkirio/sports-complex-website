const router = require("express").Router();
const facilityController = require("../controllers/facilityController");
const usersController = require("../controllers/usersController");

// Display all facilities
router.get("/", facilityController.index, facilityController.indexView);

// Create new facilities. Restricted to admin.
router.get("/new", usersController.isAdmin, facilityController.new);
router.post("/create", 
	usersController.isAdmin,
	facilityController.validate,
	facilityController.create,
	facilityController.redirectView);

// Display one facility
router.get("/:id", facilityController.show, facilityController.showView);

// Edit a facility. Restricted to admin.
router.get("/:id/edit",
	usersController.isAdmin,
	facilityController.show,
	facilityController.editView);
router.put("/:id/update",
	usersController.isAdmin,
	facilityController.validate,
	facilityController.update,
	facilityController.redirectView);

// Delete a facility. Restricted to admin.
router.delete("/:id/delete",
  usersController.isAdmin,
  facilityController.delete,
  facilityController.redirectView);

module.exports = router;
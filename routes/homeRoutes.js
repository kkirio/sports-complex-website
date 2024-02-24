const homeController = require("../controllers/homeController");
const router = require("express").Router();

//routes for general pages.
router.get("/", homeController.displayHome);
router.get("/about", homeController.displayAbout);

module.exports = router;

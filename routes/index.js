const router = require("express").Router();
const homeRoutes = require("./homeRoutes"),
  errorRoutes = require("./errorRoutes"),
  facilityRoutes = require("./facilityRoutes"),
  programRoutes = require("./programRoutes"),
  eventsRoutes = require("./eventsRoutes"),
  membershipRoutes = require("./membershipRoutes"),
  contactRoutes = require("./contactRoutes"),
  userRoutes = require("./userRoutes");

router.use("/facilities", facilityRoutes);
router.use("/programs", programRoutes);
router.use("/events", eventsRoutes);
router.use("/memberships", membershipRoutes);
router.use("/contact", contactRoutes);
router.use("/users", userRoutes);
router.use("/", homeRoutes);
router.use("/", errorRoutes);

module.exports = router;

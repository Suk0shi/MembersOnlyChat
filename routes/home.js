const express = require("express");
const router = express.Router();

// Require controller modules.
const message_controller = require("../controllers/messageController");
const user_controller = require("../controllers/userController");


/// User ROUTES ///

// GET home page.
router.get("/login", user_controller.login);

router.get("/signUp", user_controller.signUp);

router.post("/signUp", user_controller.signUp_post);

router.get("/joinClub", user_controller.joinClub);

router.post("/joinClub", user_controller.joinClub_post);

router.get("/admin", user_controller.admin);

router.post("/admin", user_controller.admin_post);

router.get("/", message_controller.messageboard);

router.post("/", message_controller.message_post);

router.get("/message/:id/delete", message_controller.message_delete_get);

router.post("/message/:id/delete", message_controller.message_delete_post);


module.exports = router;
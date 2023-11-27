const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

// Define your routes
router.get("/users", userController.getAllUsers);
router.get("/users/:userId", userController.getSingleUser);
router.put("/users/:userId", userController.updateUser);
router.delete("/users/:userId", userController.deleteUser);

module.exports = router;

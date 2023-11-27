const { executeQuery } = require("../config/db");

const userController = {
  //get all users

  getAllUsers: async (req, res) => {
    const query = `SELECT * FROM USERS`;
    try {
      const result = await executeQuery(query);
      res.json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  //get single user

  getSingleUser: async (req, res) => {
    const user_id = req.params.userId;
    const query = `select * from users where user_id = ?`;
    try {
      const result = await executeQuery(query, [user_id]);
      console.log(result);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  //   ======================================================
  updateUser: async (req, res) => {
    const userId = req.params.userId;
    const { user_bio, user_email, user_password } = req.body;
    const query =
      "UPDATE users SET user_bio = ?, user_email = ?, user_password = ? WHERE user_id = ?";
    try {
      await executeQuery(query, [user_bio, user_email, user_password, userId]);
      res.json({ user_id: userId, user_bio, user_email, user_password });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  deleteUser: async (req, res) => {
    const userId = req.params.userId;
    const query = "DELETE FROM users WHERE user_id = ?";
    try {
      await executeQuery(query, [userId]);
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};
module.exports = userController;

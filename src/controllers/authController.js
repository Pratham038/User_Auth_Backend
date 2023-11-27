const { executeQuery } = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { use } = require("../routes/authRoutes");

const authController = {
  registerUser: async (req, res) => {
    const { user_email, user_password } = req.body;
    console.log("Received data:", { user_email, user_password });

    // Check if the email already exists
    const checkEmailQuery = "SELECT * FROM users WHERE user_email = ?";
    try {
      const existingUser = await executeQuery(checkEmailQuery, [user_email]);
      if (existingUser.length > 0) {
        // Email already exists, send a response
        return res.status(400).json({ error: "User already exists" });
      }

      // Hash the password before storing it
      const hashedPassword = await bcrypt.hash(user_password, 10);

      // Email doesn't exist, proceed with user registration
      const insertUserQuery =
        "INSERT INTO users (user_email, user_password) VALUES (?, ?)";

      const result = await executeQuery(insertUserQuery, [
        user_email,
        hashedPassword,
      ]);

      if (result && result.insertId) {
        res.status(201).json({
          user_id: result.insertId,
          user_email,
        });
      } else {
        console.error(
          "Error creating user: InsertId not available in result",
          result
        );
        res.status(500).json({ error: "Internal Server Error" });
      }
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  loginUser: async (req, res) => {
    const { user_email, user_password } = req.body;

    // Check if the user with the provided email exists
    const query = "SELECT * FROM users WHERE user_email = ?";
    try {
      const result = await executeQuery(query, [user_email]);

      if (result.length === 0) {
        // User not found
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // User found, compare hashed passwords
      const user = result[0];
      const isPasswordValid = await bcrypt.compare(
        user_password,
        user.user_password
      );

      if (!isPasswordValid) {
        // Passwords don't match
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Passwords match, create a new access token for the user
      const accessToken = jwt.sign(
        {
          user_id: user.user_id,
          user_email: user.user_email,
          expiresIn: "1h", // Set the expiration time for the token
        },
        `${process.env.SECRET_KEY}`
      );

      // Insert the access token into the access_tokens table
      const insertTokenQuery =
        "INSERT INTO access_tokens (user_id, token, expiration_time,user_email) VALUES (?, ?, ?,?)";
      const expirationTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      await executeQuery(insertTokenQuery, [
        user.user_id,
        accessToken,
        expirationTime,
        user.user_email,
      ]);

      res.status(200).json({
        accessToken,
        user_email: user.user_email, // Include user email in the response
      });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = authController;

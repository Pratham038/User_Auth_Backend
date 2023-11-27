const express = require("express");
const bodyParser = require("body-parser");
const db = require("../server/src/config/db");
const userRoutes = require("./src/routes/userRoutes");
const authRoutes = require("./src/routes/authRoutes");

const cors = require("cors");

const app = express();

const port = process.env.APP_PORT;
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use("/api", userRoutes);
app.use("/api", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello ");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

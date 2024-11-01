const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/errorMiddleware");
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const app = express();

const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Route Middleware
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);

// Routes
app.get("/", (req, res) => {
  res.send("Home Page!");
});

// Error Middleware
app.use(errorHandler);

// Connect to DB and start server
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })
    })
    .catch((err) => console.log(err));

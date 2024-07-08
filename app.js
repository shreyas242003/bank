const express = require("express");
const userRouter = require("./routes/userRoutes");
const homeRouter = require("./routes/homeRouter");
const path = require("path");
const adminRouter = require("./routes/adminRoute");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

app.use(express.json());

app.use("/public", express.static(path.join(__dirname, "public")));

app.use(cookieParser());
app.use(cors());
app.use("/api/v1/users", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/home", homeRouter);
module.exports = app;

// const app = require("./app");
// const http = require("http");
// port = 3000;
// const server = app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const User = require("./model/userSchema");
dotenv.config({ path: "./config.env" });
const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true, // Add this for newer versions of Mongoose
  })
  .then(() => {
    console.log("DB connection successful!");
  })
  .catch((err) => {
    console.error("DB connection error:", err);
    process.exit(1); // Exit process with non-zero code to indicate failure
  });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
// const jsonuser = fs.readFileSync(`${__dirname}/dev-data/user.json`, "utf-8");
// const importData = async () => {
//   try {
//     const user = JSON.parse(jsonuser);
//     await User.create(user);
//     console.log("Data successfully loaded");
//   } catch (err) {
//     console.log(err);
//   }
// };
// importData();

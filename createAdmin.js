// const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
// const dotenv = require("dotenv");
// const User = require("../model/userSchema");
// dotenv.config({ path: "../config.env" });
// const DB = process.env.DATABASE.replace(
//   "<password>",
//   process.env.DATABASE_PASSWORD
// );
// mongoose
//   .connect(DB, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true, // Add this for newer versions of Mongoose
//   })
//   .then(() => {
//     console.log("DB connection successful!");
//   })
//   .catch((err) => {
//     console.error("DB connection error:", err);
//     process.exit(1); // Exit process with non-zero code to indicate failure
//   });
// const createAdmin = async () => {
//   const username = "admin";
//   const email = "admin1@gmail.com";
//   const password = "admin123";
//   const passwordConfirm = "admin123";
//   console.log("email", email);
//   const newAdmin = await User.create({
//     username: username,
//     email: email,
//     password: password,
//     passwordConfirm: passwordConfirm,
//     role: "admin",
//   });
//   await newAdmin.save();
//   console.log("Admin user created successfully!", newAdmin);
//   mongoose.connection.close();
// };
// createAdmin();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const User = require("./model/userSchema"); // Adjust the path if necessary
dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connection successful!");
  })
  .catch((err) => {
    console.error("DB connection error:", err);
    process.exit(1);
  });

const createAdmin = async () => {
  const username = "bigroot";
  const email = "admin2@gmail.com";
  const password = "admin123";
  const passwordConfirm = "admin123"; // Provide passwordConfirm here

  console.log("email", email);

  try {
    const newAdmin = await User.create({
      username: username,
      email: email,
      password: password,
      passwordConfirm: passwordConfirm,
      role: "admin",
    });

    console.log("Admin user created successfully!", newAdmin);
    await newAdmin.save({ validateBeforeSave: false });
  } catch (err) {
    console.error("Error creating admin user:", err);
  } finally {
    mongoose.connection.close();
  }
};

createAdmin();

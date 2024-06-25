const UserRequest = require("../model/userRequestSchema");
const User = require("../model/userSchema");
exports.getPendingRequests = async (req, res) => {
  const users = await UserRequest.find({ status: "pending" });
  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
  console.log(users);
};
exports.approveRequest = async (req, res) => {
  const userId = req.params.id;
  const uniqueAccountNumber = generateUniqueAccountNumber();
  const randomPassword = generateRandomPassword();
  console.log("Pass", randomPassword);
  const userRequest = await UserRequest.findByIdAndUpdate(
    userId,
    { status: "approved" },
    { new: true }
  );

  const newUser = await User.create({
    username: userRequest.username,
    password: randomPassword,
    passwordConfirm: randomPassword,
    email: userRequest.email,
    role: "user",
    personalInfo: userRequest.personalInfo,
    dateofBirth: userRequest.dateofBirth,
    accountInfo: {
      accountNumber: uniqueAccountNumber,
      accountType: "savings",
      balance: 500,
    },
  });
  res.status(201).json({
    status: "success",
    message: "User request approved and user created",
    data: {
      newUser,
    },
  });
};
function generateUniqueAccountNumber() {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}
function generateRandomPassword() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < 8; i++) {
    password += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return password;
}
// username: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   role: { type: String, enum: ["user", "admin"], default: "user" },
//   personalInfo: {
//     firstName: { type: String, required: true },
//     lastName: { type: String, required: true },
//     phone: { type: String, required: true },
//     address: {
//       street: { type: String, required: true },
//       city: { type: String, required: true },
//       state: { type: String, required: true },
//       zip: { type: String, required: true },
//       country: { type: String, required: true },
//     },
//     dateofBirth: { type: Date },
//   },

////////
// username: { type: String, required: true, unique: true },
// password: { type: String, required: true },
// passwordConfirm: {
//   type: String,
//   required: true,
//   validate: {
//     validator: function (el) {
//       return el === this.password;
//     },
//     message: "Passwords are not the same!",
//   },
// },
// email: { type: String, required: true, unique: true },
// role: { type: String, enum: ["user", "admin"], default: "user" },
// personalInfo: {
//   firstName: { type: String },
//   lastName: { type: String },
//   phone: { type: String },
//   address: {
//     street: { type: String },
//     city: { type: String },
//     state: { type: String },
//     zip: { type: String },
//     country: { type: String },
//   },
//   dateOfBirth: { type: Date },
//   ssn: { type: String },
// },
// accountInfo: {
//   accountNumber: { type: String },
//   accountType: { type: String, enum: ["savings", "checking"] },
//   balance: { type: Number },
//   createdAt: { type: Date, default: Date.now },
// },

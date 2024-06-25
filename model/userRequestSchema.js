const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userRequestSchema = new Schema({
  username: { type: String, required: true },

  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  personalInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
      country: { type: String, required: true },
    },
  },
  dateofBirth: { type: Date },
  accountInfo: {
    accountNumber: { type: String },
    accountType: { type: String, enum: ["savings", "checking"] },
    balance: { type: Number },
    createdAt: { type: Date, default: Date.now },
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

const UserRequest = mongoose.model("UserRequest", userRequestSchema);

module.exports = UserRequest;

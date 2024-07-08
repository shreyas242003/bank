const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // Corrected package name
const crypto = require("crypto");
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  amount: { type: Number, required: true },
  type: { type: String, enum: ["income", "expense"] },
  date: { type: Date, default: Date.now },
  description: { type: String },
});
const creditDetailSchema = new Schema({
  pct_tl_open_L6M: { type: Number },
  pct_tl_closed_L6M: { type: Number },
  Tot_TL_closed_L12M: { type: Number },
  pct_tl_closed_L12M: { type: Number },
  Tot_Missed_Pmnt: { type: Number },
  CC_TL: { type: Number },
  Home_TL: { type: Number },
  PL_TL: { type: Number },
  Secured_TL: { type: Number },
  Unsecured_TL: { type: Number },
  Other_TL: { type: Number },
  Age_Oldest_TL: { type: Number },
  Age_Newest_TL: { type: Number },
  time_since_recent_payment: { type: Number },
  max_recent_level_of_deliq: { type: Number },
  num_deliq_6_12mts: { type: Number },
  num_times_60p_dpd: { type: Number },
  num_std_12mts: { type: Number },
  num_sub: { type: Number },
  num_sub_6mts: { type: Number },
  num_sub_12mts: { type: Number },
  num_dbt: { type: Number },
  num_dbt_12mts: { type: Number },
  num_lss: { type: Number },
  recent_level_of_deliq: { type: Number },
  CC_enq_L12m: { type: Number },
  PL_enq_L12m: { type: Number },
  time_since_recent_enq: { type: Number },
  enq_L3m: { type: Number },
  NETMONTHLYINCOME: { type: Number },

  Time_With_Curr_Empr: { type: Number },
  CC_Flag: { type: Number },
  PL_Flag: { type: Number },
  pct_CC_enq_L6m_of_ever: { type: Number },
  pct_PL_enq_L6m_of_ever: { type: Number },
  HL_Flag: { type: Number },
  GL_Flag: { type: Number },

  last_prod_enq2: { type: String },
  first_prod_enq2: { type: String },
});
const loanDetailSchema = new Schema({
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  netMonthlyIncome: { type: Number, required: true },
  maritalStatus: { type: Number, enum: [0, 1], required: true },
  education: {
    type: Number,
    enum: [1, 2, 3, 3, 4, 1, 3],
    required: true,
  },
  gender: { type: String, enum: ["male", "female"], required: true },
  fatherName: { type: String, required: true },
  occupation: { type: String, required: true },
});
const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  passwordConfirm: {
    type: String,
    required: true,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  personalInfo: {
    firstName: { type: String },
    lastName: { type: String },
    phone: { type: String },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zip: { type: String },
      country: { type: String },
    },
    dateOfBirth: { type: Date },
  },
  accountInfo: {
    accountNumber: { type: String },
    accountType: { type: String, enum: ["savings", "checking"] },
    balance: { type: Number },
    createdAt: { type: Date, default: Date.now },
  },
  transactions: [transactionSchema],
  creditDetails: [creditDetailSchema],
  loanDetails: [loanDetailSchema],
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});
userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;

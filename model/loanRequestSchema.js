const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const loanDetailSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  netMonthlyIncome: { type: Number, required: true },
  maritalStatus: { type: String, enum: ["single", "married"], required: true },
  education: {
    type: String,
    enum: [
      "SSC",
      "12TH",
      "GRADUATE",
      "UNDER GRADUATE",
      "POST GRADUATE",
      "OTHERS",
    ],
    required: true,
  },
  gender: { type: String, enum: ["male", "female"], required: true },
  fatherName: { type: String, required: true },
  occupation: { type: String, required: true },

  // Home Loan Fields
  propertyAddress: { type: String },
  propertyType: {
    type: String,
    enum: ["singleFamily", "multiFamily", "condo", "townhouse", "other"],
  },
  purchasePrice: { type: Number },
  downPayment: { type: Number },
  loanAmount: { type: Number },
  loanTerm: { type: String, enum: ["15", "30"] },
  propertyUse: {
    type: String,
    enum: ["primary", "secondary", "investment"],
  },

  // Personal Loan Fields
  employerName: { type: String },
  jobTitle: { type: String },
  annualIncome: { type: Number },
  loanPurpose: { type: String },

  // Additional Loan Fields
  existingLoanAmount: { type: Number },
  existingLoanTerm: { type: String },
  outstandingBalance: { type: Number },
  monthlyEMI: { type: Number },
  newLoanAmount: { type: Number },
  newLoanTerm: { type: String },
  purposeOfAdditionalLoan: { type: String },

  // Consumer Loan Fields
  itemToPurchase: { type: String },
  retailerName: { type: String },
  purchasePrice: { type: Number },
  downPayment: { type: Number },
  loanAmount: { type: Number },
  loanTerm: { type: String },
  purposeOfLoan: { type: String },

  loanType: {
    type: String,
    enum: ["home", "personal", "additional", "consumer"],
    default: "home",
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});

const LoanRequest = mongoose.model("LoanRequest", loanDetailSchema);

module.exports = LoanRequest;

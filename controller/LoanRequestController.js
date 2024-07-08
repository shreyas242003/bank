const LoanRequest = require("../model/loanRequestSchema");
const User = require("../model/userSchema");
exports.getLoanRequests = async (req, res) => {
  const users = await LoanRequest.find();
  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
  console.log(users);
};
exports.submitLoanRequest = async (req, res) => {
  // Extract form data from request body

  const formData = req.body;
  try {
    const newLoanRequest = new LoanRequest(formData);
    await newLoanRequest.save();
    const user = await User.findByIdAndUpdate(
      newLoanRequest.id,
      {
        $set: { "creditDetails.NETMONTHLYINCOME": formData.netMonthlyIncome },
      },
      { new: true }
    );
    res.status(201).json({
      message: "Loan request submitted successfully",
      loanRequest: newLoanRequest,
    });
  } catch (error) {
    console.error("Error submitting loan request:", error);
    res
      .status(500)
      .json({ message: "Failed to submit loan request", error: error.message });
  }
};

const { InferenceSession, Tensor } = require("onnxruntime-node");
const loanRequest = require("../model/loanRequestSchema");
const User = require("../model/userSchema");
const path = require("path");
async function prediction(inputData) {
  // Load the ONNX model
  try {
    const modelPath = path.resolve(__dirname, "xgb_model.onnx");
    const session = await InferenceSession.create(modelPath);

    // Prepare input data
    // const inputData = new Float32Array([
    //   0.875, 0.125, 1, 0.125, 2, 1, 0, 0, 1, 7, 1, 9, 1, 42, 0, 0, 0, 0, 0, 0, 0,
    //   0, 0, 0, 0, 1, 1, 46, 5, 25000, 245, 1, 0, 1.0, 1.0, 0, 0, 2, 1, 0, 0, 1, 0,
    //   0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    // ]);

    const inputName = session.inputNames[0]; // Assuming only one input

    // Create an OnnxValue object for the input data
    const tensor = new Tensor("float32", inputData, [1, inputData.length]);

    // Perform inference
    const output = await session.run({ [inputName]: tensor });
    console.log("Predictions:", output?.probabilities?.data);
    const probabilities = output?.probabilities?.data;
    const maxProbabilityIndex = probabilities.indexOf(
      Math.max(...probabilities)
    );

    // Define labels P1, P2, P3, P4 based on your model's output
    const labels = ["P0", "P1", "P2", "P3"];

    // Return the label with the highest probability
    const maxProbabilityLabel = labels[maxProbabilityIndex];

    return maxProbabilityLabel;
  } catch (error) {
    console.error("Error during prediction:", error);
    throw error;
  }
}

// Run the prediction function

exports.predict = async (req, res) => {
  try {
    const loanUser = await loanRequest.findById(req.params.id);
    if (!loanUser) {
      return res
        .status(404)
        .json({ status: "error", message: "Loan user not found" });
    }

    const user = await User.findById(loanUser.id);
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }
    const { creditDetails } = user;
    const { gender, maritalStatus, education } = loanUser;

    const transformedValuesLast = [0, 0, 0, 0, 0, 0]; // AL, CC, consumer loan, HL, PL, others for last_prod_enq2
    const transformedValuesFirst = [0, 0, 0, 0, 0, 0]; // AL, CC, consumer loan, HL, PL, others for first_prod_enq2

    const transformedGender = [0, 0];
    const transformedMaritalStatus = [0, 0];
    let transformedEducation = 1;
    const setEducationValue = (eduType) => {
      switch (eduType) {
        case "12TH":
          transformedEducation = 2; // 12th
          break;
        case "GRADUATE":
          transformedEducation = 3; // Graduate
          break;
        case "UNDER GRADUATE":
          transformedEducation = 3; // Under Graduate (assuming same as Graduate)
          break;
        case "POST-GRADUATE":
          transformedEducation = 4; // Post Graduate
          break;
        default:
          transformedEducation = 1; // Others
          break;
      }
    };

    if (gender === "male") {
      transformedGender[1] = 1; // male
    } else if (gender === "female") {
      transformedGender[0] = 1; // female
    }
    if (maritalStatus === "single") {
      transformedMaritalStatus[1] = 1; // single
    } else if (maritalStatus === "married") {
      transformedMaritalStatus[0] = 1; // married
    }

    const setValues = (prodType, transformedValues) => {
      switch (prodType) {
        case "AL":
          transformedValues[0] = 1; // AL
          break;
        case "CC":
          transformedValues[1] = 1; // CC
          break;
        case "consumer loan":
          transformedValues[2] = 1; // consumer loan
          break;
        case "HL":
          transformedValues[3] = 1; // HL
          break;
        case "PL":
          transformedValues[4] = 1; // PL
          break;
        default:
          transformedValues[5] = 1; // others
          break;
      }
    };
    setEducationValue(education);
    // Set values for last_prod_enq2

    setValues(creditDetails[0].last_prod_enq2, transformedValuesLast);
    // Set values for first_prod_enq2
    setValues(creditDetails[0].first_prod_enq1, transformedValuesFirst);
    const orderOfKeys = [
      "pct_tl_open_L6M",
      "pct_tl_closed_L6M",
      "Tot_TL_closed_L12M",
      "pct_tl_closed_L12M",
      "Tot_Missed_Pmnt",
      "CC_TL",
      "Home_TL",
      "PL_TL",
      "Secured_TL",
      "Unsecured_TL",
      "Other_TL",
      "Age_Oldest_TL",
      "Age_Newest_TL",
      "time_since_recent_payment",
      "max_recent_level_of_deliq",
      "num_deliq_6_12mts",
      "num_times_60p_dpd",
      "num_std_12mts",
      "num_sub",
      "num_sub_6mts",
      "num_sub_12mts",
      "num_dbt",
      "num_dbt_12mts",
      "num_lss",
      "recent_level_of_deliq",
      "CC_enq_L12m",
      "PL_enq_L12m",
      "time_since_recent_enq",
      "enq_L3m",
      "NETMONTHLYINCOME",
      "Time_With_Curr_Empr",
      "CC_Flag",
      "PL_Flag",
      "pct_PL_enq_L6m_of_ever",
      "pct_CC_enq_L6m_of_ever",
      "HL_Flag",
      "GL_Flag",
      // "last_prod_enq2",
      // "first_prod_enq2",
    ];
    const creditDetailsObject = creditDetails[0];
    const creditDetailsArray = orderOfKeys.map(
      (key) => creditDetailsObject[key]
    );
    console.log("Array", creditDetailsArray);
    const finalArray = [
      ...creditDetailsArray,
      transformedEducation,
      ...transformedMaritalStatus,
      ...transformedGender,
      ...transformedValuesLast,
      ...transformedValuesFirst,
    ];

    const predictions = await prediction(finalArray);
    res.status(200).json({
      status: "success",
      data: {
        predictions,
      },
    });
  } catch (error) {
    console.error("Error predicting loan:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

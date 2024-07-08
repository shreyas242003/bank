const express = require("express");
const User = require("../model/userSchema");
exports.getUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
};
exports.createUser = async (req, res) => {
  const newUser = await User.create(req.body);
  try {
    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("userId", req.user);
    const user = await User.findById(userId).select("-password"); // Adjust the fields to exclude password or any sensitive data
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

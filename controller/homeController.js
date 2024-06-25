const fs = require("fs");
const path = require("path");

exports.getHomeData = (req, res, next) => {
  const filePath = path.join(__dirname, "..", "dev-data", "home.json");
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({
        status: "fail",
        message: err,
      });
    }
    const homeData = JSON.parse(data);
    res.status(200).json({
      status: "success",
      data: {
        home: homeData,
      },
    });
  });
};

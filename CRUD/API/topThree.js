const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express();

router.get("/topThree", (req, res, next) => {
  const jsonFilePath = path.join(__dirname, "../../DATA/myFiles.json");
  if (!fs.existsSync(jsonFilePath)) {
    res.send("Data doesn't exists");
  }
  const empJSON = require(jsonFilePath);
  count = 0;
  empJSON.sort((a, b) => b.salary - a.salary);
  for (let i = 2; i < empJSON.length; i++) {
    if (empJSON[i].salary === empJSON[i + 1].salary) {
      continue;
    } else {
      count = i + 1;
      console.log(empJSON.slice(0, i + 1));
      break;
    }
  }
  res.json(empJSON.slice(0, count));
});

router.get("/average", (req, res, next) => {
  let total = 0;
  const jsonFilePath = path.join(__dirname, "../../DATA/myFiles.json");
  if (!fs.existsSync(jsonFilePath)) {
    res.send("Data doesn't exists");
  }
  const empJSON = require(jsonFilePath);
  let div = empJSON.length;
  empJSON.map((elem) => {
    total += elem.salary;
  });
  let avg = total / div;
  res.send("the average Salary of " + empJSON.length + " employees is " + avg);
});

router.get("/department", (req, res, next) => {
  const department = req.query.department;
  const jsonFilePath = path.join(__dirname, "../../DATA/myFiles.json");
  if (!fs.existsSync(jsonFilePath)) {
    res.send("Data doesn't exists");
  }
  const empJSON = require(jsonFilePath);
  const arr = empJSON.filter((elem) => elem.department === department);
  arr.sort((a, b) => b.salary - a.salary);
  let maxSal = arr[0].salary;
  let minSal = arr[arr.length - 1].salary;
  res.send(
    `The max and min salary of department ${department} is ${maxSal} and ${minSal}`
  );
});
module.exports = router;

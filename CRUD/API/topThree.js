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

//Get employees by department

router.get("/department", (req, res, next) => {
  const department = req.query.dpt;
  const jsonFilePath = path.join(__dirname, "../../DATA/myFiles.json");
  if (!fs.existsSync(jsonFilePath)) {
    res.send("Data doesn't exists");
  }
  const empJSON = require(jsonFilePath);
  const arr = empJSON.filter((elem) => elem.department === department);
  if (arr.length === 0) res.send("No Employees in the department ");
  else res.send(arr);
});

//Average salary of all the employees in department

router.get("/department/average/all", (req, res, next) => {
  const jsonFilePath = path.join(__dirname, "../../DATA/myFiles.json");
  if (!fs.existsSync(jsonFilePath)) {
    res.send("Data doesn't exists");
  }
  const empJSON = require(jsonFilePath);
  const dptObj = {};
  empJSON.map((e) => {
    dptObj[e.department] = [];
  });
  empJSON.map((e) => {
    dptObj[e.department].push(e.salary);
  });
  let responseString = "";
  Object.keys(dptObj).forEach((key) => {
    const salaries = dptObj[key];
    let sum = 0;
    for (let i = 0; i < salaries.length; i++) {
      sum += salaries[i];
    }
    let avg = sum / salaries.length;
    responseString += `The average sal of the department ${key} is ${avg}\n`;
  });
  res.send(responseString);
});

//Get employees on performance rating

router.get("/performance", (req, res, next) => {
  const performance = req.query.performance;
  const jsonFilePath = path.join(__dirname, "../../DATA/myFiles.json");
  if (!fs.existsSync(jsonFilePath)) {
    res.send("Data doesn't exists");
  }
  const empJSON = require(jsonFilePath);
  const arr = empJSON.filter((elem) => elem.performance >= performance);
  if (arr.length === 0) res.send("No Employees with that performance range ");
  else res.send(arr);
});

//Get average Salary by department

router.get("/department/sal", (req, res, next) => {
  const department = req.query.dpt;
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

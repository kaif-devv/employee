const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express();
const bcrypt = require("bcrypt");

const {
  allFieldsVerify,
  passVerify,
  nameVerify,
  ageVerify,
  dptVerify,
  positionVerify,
} = require("../Auth/dataVerify"); 

function fieldsVerify(req, res, next) {
  const { name, age, email, password, salary, position, department } = req.body;
  let proceed = allFieldsVerify(
    name,
    age,
    email,
    password,
    salary,
    position,
    department
  );
  if (proceed) {
    next();
  } else {
    res.send("All fields required");
  }
}

function passwordCheck(req, res, next) {
  let proceed = passVerify(req.body.password);
  if (proceed) {
    next();
  } else {
    res.send(
      "Password must include uppercase, lowercase, number, and special character"
    );
  }
}

function nameCheck(req, res, next) {
  const name = req.body.name;
  if (!nameVerify(name)) {
    res.send("Name should start with a letter");
  } else {
    next();
  }
}

function ageCheck(req, res, next) {
  const age = req.body.age;
  if (!ageVerify(age)) {
    res.send("Enter the correct age");
  } else {
    next();
  }
}

function dptCheck(req, res, next) {
  const department = req.body.department;
  if (!dptVerify(department)) {
    res.send("Enter the correct department");
  } else {
    next();
  }
}

function positionCheck(req, res, next) {
  const position = req.body.position;
  if (!positionVerify(position)) {
    res.send("Enter the correct position");
  } else {
    next();
  }
}

function createEmployee(req, res, next) {
  const { name, age, email, password, position, salary, department } = req.body;
  const jsonFilePath = path.join(__dirname, "../DATA/myFiles.json");
  if (!fs.existsSync(jsonFilePath)) {
    fs.writeFileSync(jsonFilePath, "[]");
  }
  const empJSON = require(jsonFilePath);
  const updatedId = empJSON.length > 0 ? empJSON[empJSON.length - 1].id + 1 : 1;
  const index = empJSON.findIndex((elem) => elem.email === email);
  if (index === -1) {
    bcrypt.hash(password, 5, async function (err, hash) {
      let d = Date(Date.now()).slice(4,15);
      const newEmployee = {
        name,
        age,
        email,
        id: updatedId,
        position,
        salary,
        password: hash,
        department,
        joinDate :d,
        performance: 3
      };
      empJSON.push(newEmployee);
      fs.writeFileSync(jsonFilePath, JSON.stringify(empJSON));
      res.status(201).json("New Employee has been created successfully");
    });
  } else {
    res.send("Employee already exists ");
  }
}

router.post(
  "/create",
  fieldsVerify,
  passwordCheck,
  nameCheck,
  ageCheck,
  dptCheck,
  positionCheck,
  createEmployee
);

module.exports = router;

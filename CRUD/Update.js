const express = require("express");
const fs = require("fs");
const bcrypt = require("bcrypt");
const router = express();
const path = require("path");
const { jwtVerify } = require("../Auth/verifyToken");
const {
  passVerify,
  nameVerify,
  ageVerify,
  dptVerify,
  positionVerify,
} = require("../Auth/dataVerify");

function jwtVerification(req, res, next) {
  const token = req.header("jwt_key");
  try {
    jwtVerify(token);
    next();
  } catch (error) {
    res.send("Invalid user");
  }
}

function fileVerify(req, res, next) {
  const jsonFilePath = path.join(__dirname, "../DATA/myFiles.json");
  if (!fs.existsSync(jsonFilePath)) {
    res.send("Data doesn't exists");
  } else {
    next();
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

function updatingEmployee(req, res, next) {
  const updateEmployee = req.body;
  const prevPassword = updateEmployee.prevPassword;

  const id = parseInt(req.params.id);
  const jsonFilePath = path.join(__dirname, "../DATA/myFiles.json");
  const empJSON = require(jsonFilePath);
  const index = empJSON.findIndex((elem) => elem.id === id); //0
  if (index === -1) {
    res.send("Employee not found");
  }
  if (updateEmployee.name) {
    empJSON[index].name = updateEmployee.name;
  }
  if (updateEmployee.age) {
    empJSON[index].age = updateEmployee.age;
  }
  if (updateEmployee.department) {
    empJSON[index].department = updateEmployee.department;
  }
  if (updateEmployee.position) {
    empJSON[index].position = updateEmployee.position;
  }
  if (updateEmployee.email) {
    let ei = empJSON.findIndex((elem) => elem.email === updateEmployee.email); //1
    if (ei !== -1 && ei !== index)
      res.send("Employee with this email already exists");
    else {
      empJSON[index].email = updateEmployee.email;
    }
  }
  if (updateEmployee.password) {
    if (!prevPassword) {
      res.send("Please enter old password");
    } else {
      const comp = bcrypt.compareSync(prevPassword, empJSON[index].password);
      if (!comp) {
        res.send("Your old password is incorrect");
      } else {
        const hash = bcrypt.hashSync(updateEmployee.password, 5);
        empJSON[index].password = hash;
        res.send("Password updated successfully");
      }
    }
  }
  fs.writeFileSync(jsonFilePath, JSON.stringify(empJSON));
  next();
}

router.put(
  "/update/:id",
  jwtVerification,
  fileVerify,
  nameCheck,
  passwordCheck,
  ageCheck,
  dptCheck,
  positionCheck,
  updatingEmployee,
  (req, res) => {
    res.send("Employee details updated successfully ");
  }
);

module.exports = router;

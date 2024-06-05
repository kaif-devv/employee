const express = require("express");
const fs = require("fs");
const bcrypt = require("bcrypt");
const router = express();
const path = require("path");
const {empJson} = require("../Auth/FunctionCalls");
const { jwtVerify } = require("../Auth/verifyToken");
const {
  fileExists,
  passVerify,
  nameVerify,
  ageVerify,
  dptVerify,
  positionVerify,
  performanceVerify,
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

  const historyPath = path.join(__dirname, "../DATA/history.json");
  const jsonFilePath = path.join(__dirname, "../DATA/myfiles.json");

  const empHistory = require(historyPath);
  const empHistoryId =
    empHistory.length > 0
      ? empHistory[empHistory.length - 1].empHistoryId + 1
      : 1;

  const updatedOBJ = {
    id: id,
    empHistoryId: empHistoryId,
    updatedOn: Date(Date.now()).slice(4,33),
  };
  const empJSON = empJson();
  const index = empJSON.findIndex((elem) => elem.id === id); //

  if (index === -1) {
    res.send("Employee not found");
  }
  if (updateEmployee.name) {
    updatedOBJ.name = {
      prevName: empJSON[index].name,
      currentName: updateEmployee.name,
    };
    empJSON[index].name = updateEmployee.name;
  }
  if (updateEmployee.salary) {
    updatedOBJ.salary = {
      prevSalary: empJSON[index].salary,
      currentSalary: updateEmployee.salary,
    };
    empJSON[index].salary = updateEmployee.salary;
  }
  if (updateEmployee.age) {
    updatedOBJ.age = {
      prevAge: empJSON[index].age,
      currentAge: updateEmployee.age,
    };
    empJSON[index].age = updateEmployee.age;
  }
  if (updateEmployee.department) {
    updatedOBJ.department = {
      prevDpt: empJSON[index].department,
      currentDpt: updateEmployee.department,
    };
    empJSON[index].department = updateEmployee.department;
  }
  if (updateEmployee.position) {
    updatedOBJ.position = {
      prevPosition: empJSON[index].position,
      currentPosition: updateEmployee.position,
    };
    empJSON[index].position = updateEmployee.position;
  }
  if (updateEmployee.performance) {
    updatedOBJ.performance = {
      prevPerformance: empJSON[index].performance,
      currentPerformance: updateEmployee.performance,
    };
    empJSON[index].performance = updateEmployee.performance;
  }
  if (updateEmployee.email) {
    let ei = empJSON.findIndex((elem) => elem.email === updateEmployee.email); //1
    if (ei !== -1 && ei !== index)
      res.send("Employee with this email already exists");
    else {
      updatedOBJ.email = {
        prevEmail: empJSON[index].email,
        currentEmail: updateEmployee.email,
      };
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
        updatedOBJ.password = {
          prevpassword: empJSON[index].password,
          currentpassword: hash
        };
        updatedOBJ.password = hash;
        res.send("Password updated successfully");
      }
    }
  }
  empHistory.push(updatedOBJ);
  fs.writeFileSync(historyPath, JSON.stringify(empHistory));
  fs.writeFileSync(jsonFilePath, JSON.stringify(empJSON));
  next();
}

function performanceCheck(req, res, next) {
  const performance = req.body.performance;
  let proceed = performanceVerify(performance);
  if (proceed) next();
  else {
    res.send("Enter the performance rating between 0 and 5");
  }
}

router.put(
  "/update/:id",
  fileExists,
  jwtVerification,
  fileVerify,
  nameCheck,
  passwordCheck,
  ageCheck,
  dptCheck,
  positionCheck,
  performanceCheck,
  updatingEmployee,
  (req, res) => {
    res.send("Employee details updated successfully ");
  }
);

module.exports = router;

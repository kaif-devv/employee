const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config();
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");

//Class related to JWT Operations
class Jwt {
  //Verifying the Token
  static jwtVerify(token) {
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    const verify = jwt.verify(token, jwtSecretKey);
    return verify;
  }
  //Generating the Token
  static generateToken(payload) {
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    const token = jwt.sign(payload, jwtSecretKey);
    return token;
  }
}

//Class related to API calls

class Api extends Jwt {
  //Getting the Top Three Elements
  static topThree(req, res, next) {
    const empJSON = Api.empJson(); // using the static class
    let count = 0;
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
  }

  static empJson() {
    const jsonFilePath = path.join(__dirname, "../DATA/myFiles.json");
    const empJSON = require(jsonFilePath);
    if (empJSON) return empJSON;
    else return false;
  }

  static performance(req, res, next) {
    const performance = req.query.performance;
    const empJSON = Api.empJson(); // using the static class
    const arr = empJSON.filter((elem) => elem.performance >= performance);
    if (arr.length === 0) res.send("No Employees with that performance range ");
    else res.send(arr);
  }

  static getAverage(req, res) {
    let total = 0;
    const empJSON = Api.empJson(); // using the static class
    let div = empJSON.length;
    empJSON.map((elem) => {
      total += elem.salary;
    });
    let avg = total / div;
    res.send(
      "the average and Total Salary of " +
        empJSON.length +
        " employees is " +
        avg +
        " and " +
        total
    );
  }

  static topThree(req, res, next) {
    const empJSON = Api.empJson(); // using the static class
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
  }

  static performance(req, res, next) {
    const performance = req.query.performance;
    const empJSON = Api.empJson(); // using the static class
    const arr = empJSON.filter((elem) => elem.performance >= performance);
    if (arr.length === 0) res.send("No Employees with that performance range ");
    else res.send(arr);
  }

  static dptCount(req, res, next) {
    const department = req.query.dpt;
    const empJSON = Api.empJson(); // using the static class
    const arr = empJSON.filter((elem) => elem.department === department);
    if (arr.length === 0) res.send("No Employees in the department ");
    else
      res.send(
        `Number of employees in the ${department} department are ${arr.length}`
      );
  }

  static dptAvg(req, res, next) {
    const empJSON = Api.empJson(); // using the static class
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
  }

  static empDpt(req, res, next) {
    const department = req.query.dpt;
    const empJSON = Api.empJson(); // using the static class
    const arr = empJSON.filter((elem) => elem.department === department);
    if (arr.length === 0) res.send("No Employees in the department ");
    else res.send(arr);
  }

  static avgDptSal(req, res) {
    const department = req.query.dpt;
    const jsonFilePath = path.join(__dirname, "../DATA/myFiles.json");
    const empJSON = require(jsonFilePath);
    const arr = empJSON.filter((elem) => elem.department === department);
    arr.sort((a, b) => b.salary - a.salary);
    let maxSal = arr[0].salary;
    let minSal = arr[arr.length - 1].salary;
    res.send(
      `The max and min salary of department ${department} is ${maxSal} and ${minSal}`
    );
  }

  static sortBy(data, order, field) {
    if (order === 1) {
      return data.sort((a, b) => a[field] - b[field]);
    } else if (order == -1) {
      return data.sort((a, b) => b[field] - a[field]);
    }
  }
  static sortParam(req, res) {
    const field = req.query.field;
    const order = parseInt(req.params.id);
    const empJSON = Api.empJson(); // using the static class
    Api.sortBy(empJSON, order, field); //sorting function
    res.json(empJSON);
  }

  static updateAll(req, res) {
    const toBeUpdatedEmployeIds = req.body.ids;
    const salary = parseInt(req.query.salary);
    //toBeUpdatedEmployeIds is an array of multiple ids which we have to update the salary
    const jsonFilePath = path.join(__dirname, "../DATA/myFiles.json");
    const empJSON = require(jsonFilePath);
    toBeUpdatedEmployeIds.map((id) => {
      const index = empJSON.findIndex((elem) => elem.id === id);
      empJSON[index].salary = salary;
    });
    fs.writeFileSync(jsonFilePath, JSON.stringify(empJSON));
    res.send("Salaries updated successfully");
  }

  static historyData(req, res, next) {
    const id = parseInt(req.params.id);
    const empJSON = Api.empJson(); // using the static class
    const index = empJSON.findIndex((elem) => elem.id === id);
    if (index === -1) {
      res.send("Employee not found");
    }
    const historyFilePath = path.join(__dirname, "../DATA/history.json");
    const historyJSON = require(historyFilePath);
    let filteredEmployees = historyJSON.filter((elem) => elem.id === id);
    let vari = filteredEmployees[filteredEmployees.length - 1];
    res.send(
      `The employee update history of the employee \n ${JSON.stringify(
        empJSON[index]
      )} \n is \n ${JSON.stringify(vari)}`
    );
  }

  static report(req, res, next) {
    var csvJSON = require("csvjson");
    let downloadPath = path.join(__dirname, "../DATA/report.csv");
    const empJSON = Api.empJson(); // using the static class
    const dptObj = {};
    empJSON.map((e) => {
      dptObj[e.department] = [];
    });
    empJSON.map((e) => {
      dptObj[e.department].push(e.salary);
    });
    let csvObj = [];
    Object.keys(dptObj).forEach((key) => {
      const salaries = dptObj[key];
      let sum = 0;
      for (let i = 0; i < salaries.length; i++) {
        sum += salaries[i];
      }
      let average = sum / salaries.length;
      csvObj.push({
        department: key,
        totalExpenditure: sum,
        averageSal: average,
      });
    });
    const csvData = csvJSON.toCSV(JSON.stringify(csvObj), { headers: "key" });
    fs.writeFileSync(downloadPath, csvData);
    res.download(downloadPath);
  }
}

//Class related to User Login,register and update

class User extends Api {
  static login(req, res, next) {
    const bcrypt = require("bcrypt");
    const empJSON = Api.empJson();
    const { email, password } = req.body;
    const employee = empJSON.find((ele) => ele.email === email);
    if (!employee) res.send("Invalid Credentials or Employee doesn't exist");
    bcrypt.compare(password, employee.password, async (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
      }
      if (!result) {
        return res.send("Your password is incorrect");
      }
      const payload = {
        email: email,
        isAdmin: true,
      };
      const token = Jwt.generateToken(payload); // Generated Token by jwt static generate method
      res.append("jwt_key", token);
      res.send("Login successful , token generated is " + token);
    });
  }

  static createEmployee(req, res, next) {
    const { name, age, email, password, position, salary, department } =
      req.body;
    const jsonFilePath = path.join(__dirname, "../DATA/myFiles.json");
    if (!fs.existsSync(jsonFilePath)) {
      fs.writeFileSync(jsonFilePath, "[]");
    }
    const empJSON = Api.empJson();
    const updatedId =
      empJSON.length > 0 ? empJSON[empJSON.length - 1].id + 1 : 1;
    const index = empJSON.findIndex((elem) => elem.email === email);
    if (index === -1) {
      bcrypt.hash(password, 5, async function (err, hash) {
        let d = Date(Date.now()).slice(4, 15);
        const newEmployee = {
          name,
          age,
          email,
          id: updatedId,
          position,
          salary,
          password: hash,
          department,
          joinDate: d,
          performance: 3,
        };
        empJSON.push(newEmployee);
        fs.writeFileSync(jsonFilePath, JSON.stringify(empJSON));
        res.status(201).json("New Employee has been created successfully");
      });
    } else {
      res.send("Employee already exists ");
    }
  }

  static updateEmployee(req, res, next) {
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
      updatedOn: Date(Date.now()).slice(4, 33),
    };
    const empJSON = require(jsonFilePath);
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
            currentpassword: hash,
          };
          updatedOBJ.password = hash;
          res.send("Password updated successfully");
        }
      }
    }
    empHistory.push(updatedOBJ);
    fs.writeFileSync(historyPath, JSON.stringify(empHistory));
    fs.writeFileSync(jsonFilePath, JSON.stringify(empJSON));
    return next();
  }
}

//Class related to Crud Operations

class Crud extends User {
  static jwtVerification(req, res, next) {
    const token = req.header("jwt_key");
    try {
      Jwt.jwtVerify(token);
      next();
    } catch (error) {
      res.send("Invalid user");
    }
  }

  static fileExists(req, res, next) {
    const fs = require("fs");
    const path = require("path");
    const jsonFilePath = path.join(__dirname, "../DATA/myFiles.json");
    if (!fs.existsSync(jsonFilePath)) {
      res.send("Data doesn't exists");
    } else {
      next();
    }
  }

  static read(req, res, next) {
    const empJSON = Api.empJson();
    const name = req.query.name;
    const employ = empJSON.filter((elem) => elem.name === name);
    if (employ.length === 0) res.send("employee not found");
    res.json(employ);
  }

  static search(req, res, next) {
    const empJSON = Api.empJson();
    const id = parseInt(req.params.id);
    const e = empJSON.find((elem) => elem.id === id);
    if (!e) res.send("Employee not found");
    else {
      res.send(e);
    }
  }

  static deleteById(req, res, next) {
    const empJSON = Api.empJson();
    const id = parseInt(req.params.id);
    const index = empJSON.findIndex((elem) => elem.id === id);
    if (index === -1) res.send("Employee not found");
    else {
      empJSON.splice(index, 1);
      fs.writeFileSync("./DATA/myFiles.json", JSON.stringify(empJSON));
      res.send("Employee deleted successfully");
    }
  }

  static getAll(req, res, next) {
    const empJSON = Api.empJson();
    if (empJSON) res.json(empJSON);
    else {
      res.send("Employee list empty");
    }
  }

  static getPaginated(req, res, next) {
    const id = parseInt(req.params.id);
    const empJSON = Api.empJson();
    if (empJSON) {
      //pagination for 4 employees
      const start = (id - 1) * 4;
      const end = id * 4;
      const result = empJSON.slice(start, end);
      res.json(result);
    } else {
      res.send("Employee list empty");
    }
  }
}

//Class related to verrification of Input Fields 

class dataVerify extends Crud {
  static fieldsVerify(req, res, next) {
    const { name, age, email, password, salary, position, department } =
      req.body;
    if (
      !name ||
      !age ||
      !position ||
      !password ||
      !salary ||
      !email ||
      !department
    ) {
      res.send("All fields required");
    } else {
      next();
    }
  }

  static passwordCheck(req, res, next) {
    const password = req.body.password;
    if (!password) {
      return next();
    }
    const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    let capitalFlag = false;
    let numFlag = false;
    let smallFlag = false;
    let specialFlag = false;

    for (let i = 0; i < password.length; i++) {
      const char = password[i];
      if (/[A-Z]/.test(char)) {
        capitalFlag = true;
      } else if (/[a-z]/.test(char)) {
        smallFlag = true;
      } else if (/[0-9]/.test(char)) {
        numFlag = true;
      } else if (specialCharRegex.test(char)) {
        specialFlag = true;
      }
    }
    if (!capitalFlag || !numFlag || !specialFlag || !smallFlag) {
      res.send(
        "Password must include uppercase, lowercase, number, and special character"
      );
    } else {
      return next();
    }
  }

  static nameCheck(req, res, next) {
    const name = req.body.name;
    if (!name) {
      return next();
    }
    if (name.charAt(0) <= "9") {
      res.send("Name should start with a letter");
    } else {
      return next();
    }
  }

  static ageCheck(req, res, next) {
    const age = req.body.age;
    if (!age) {
      return next();
    }
    if (age < 18 || age > 60) {
      res.send("Enter the correct age");
    } else {
      return next();
    }
  }

  static dptCheck(req, res, next) {
    const department = req.body.department;
    if (!department) {
      return next();
    }
    if (
      department !== "frontend" &&
      department !== "backend" &&
      department !== "fullstack"
    ) {
      res.send("Enter the correct department");
    } else {
      return next();
    }
  }

  static positionCheck(req, res, next) {
    const position = req.body.position;
    if (!position) {
     return next();
    }
    if (position !== "SDE1" && position !== "SDE2" && position !== "SDE3") {
      res.send("Enter the correct position");
    } else {
     return next();
    }
  }

  static performanceVerify(req, res, next) {
    const performance = req.body.performance;
    if (!performance) {
      return next();
    }
    if (performance > "5" || performance < "0") {
      res.send("Enter the performance rating between 0 and 5");
    } else {
      return next();
    }
  }
}

module.exports = { Jwt, Api, User, Crud, dataVerify };

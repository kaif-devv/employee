const { Api } = require("./apiClass");
const { Jwt } = require("./jwtClass");
const fs = require("fs");
import { Response } from "express";
const path = require("path");
const bcrypt = require("bcrypt");

import { empSchema, updateSchema, historySchema } from "./schemas";

class User extends Api {
  static login(
    req: { body: { email: string; password: any } },
    res: {
      send: (arg0: string) => void;
      status: (arg0: number) => {
        (): any;
        new (): any;
        send: { (arg0: any): any; new (): any };
      };
      append: (arg0: string, arg1: string) => void;
    },
    next: any
  ) {
    const bcrypt = require("bcrypt");
    const empJSON = Api.empJson();
    const { email, password } = req.body;
    const employee = empJSON.find(
      (ele: { email: string }) => ele.email === email
    );
    if (!employee) {
      res.send("Invalid Credentials or Employee doesn't exist");
      return;
    }
    bcrypt.compare(
      password,
      employee.password,
      async (err: Error, result: boolean) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Internal Server Error");
        }
        if (!result) {
          return res.send("Your password is incorrect");
        }
        const payload: {
          email: string;
          isAdmin: boolean;
        } = {
          email: email,
          isAdmin: true,
        };
        const token: string = Jwt.generateToken(payload); // Generated Token by jwt static generate method
        res.append("jwt_key", token);
        res.send("Login successful , token generated is " + token);
      }
    );
  }

  static createEmployee(
    req: {
      body: {
        name: string;
        age: number;
        email: string;
        password: string;
        position: string;
        salary: number;
        department: string;
      };
    },
    res: {
      status: (arg0: number) => {
        (): any;
        new (): any;
        json: { (arg0: any): void; new (): any };
      };
      send: (arg0: any) => void;
    },
    next: any
  ) {
    const { name, age, email, password, position, salary, department } =
      req.body;
    const jsonFilePath = path.join(__dirname, "../DATA/myFiles.json");
    if (!fs.existsSync(jsonFilePath)) {
      fs.writeFileSync(jsonFilePath, "[]");
    }
    const empJSON: empSchema[] = Api.empJson();
    const updatedId: number =
      empJSON.length > 0 ? empJSON[empJSON.length - 1].id + 1 : 1;
    const index: number = empJSON.findIndex(
      (elem: { email: string }) => elem.email === email
    );
    if (index === -1) {
      bcrypt.hash(password, 5, async function (err: any, hash: any) {
        let d = Date.now().toString().slice(4, 33);
        const newEmployee: empSchema = {
          name,
          age,
          email,
          id: updatedId,
          position,
          salary,
          password: hash,
          department,
          joinDate: d,
          performance: "3",
        };
        empJSON.push(newEmployee);
        fs.writeFileSync(jsonFilePath, JSON.stringify(empJSON));
        res.status(201).json("New Employee has been created successfully");
      });
    } else {
      res.send("Employee already exists ");
    }
  }

  static updateEmployee(
    req: { body: any; params: { id: string } },
    res: Response,
    next: any
  ) {
    const updateEmployee: updateSchema = req.body;
    const prevPassword = updateEmployee.prevPassword;
    const id: number = parseInt(req.params.id);

    const historyPath: string = path.join(__dirname, "../DATA/history.json");
    const jsonFilePath: string = path.join(__dirname, "../DATA/myfiles.json");

    const empHistory = require(historyPath);
    const empHistoryId: number =
      empHistory.length > 0
        ? empHistory[empHistory.length - 1].empHistoryId + 1
        : 1;
    const updatedOBJ: historySchema = {
      id: id,
      empHistoryId: empHistoryId,
      updatedOn: Date.now().toString().slice(4, 33),
    };
    const empJSON = require(jsonFilePath);
    const index = empJSON.findIndex((elem: { id: number }) => elem.id === id); //

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
      let ei = empJSON.findIndex(
        (elem: { email: any }) => elem.email === updateEmployee.email
      ); //1
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
    res.send("Employe updated successfullyy");
  }
}
module.exports = { User };

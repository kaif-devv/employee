const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config();
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");

type schema = {
  id: number;
  name: string;
  age: number;
  email: string;
  position: string;
  salary: number;
  password: string;
  department: string;
  performance: string;
};

//Class related to JWT Operations
class Jwt {
  //Verifying the Token
  static jwtVerify(token: any) {
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    const verify = jwt.verify(token, jwtSecretKey);
    return verify;
  }
  //Generating the Token
  static generateToken(payload: any) {
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    const token = jwt.sign(payload, jwtSecretKey);
    return token;
  }
}

//Class related to API calls

class Api extends Jwt {
  //Getting the Top Three Elements
  static topThree(req: any, res: any, next: any) {
    const empJSON: false | schema[] = Api.empJson(); // using the static class
    if (empJSON) {
      let count = 0;
      empJSON.sort((a, b) => b.salary - a.salary);
      for (let i = 2; i < empJSON.length; i++) {
        if (empJSON[i].salary === empJSON[i + 1].salary) {
          continue;
        } else {
          count = i + 1;
          break;
        }
      }
      res.json(empJSON.slice(0, count));
    } else {
      res.send("File doesnt exists");
    }
  }

  static empJson() {
    const jsonFilePath = path.join(__dirname, "../DATA/myFiles.json");
    const empJSON: schema[] = require(jsonFilePath);
    if (empJSON) return empJSON;
    else return false;
  }

  static getAverage(req: any, res: any, next: any) {
    let total = 0;
    const empJSON: false | schema[] = Api.empJson(); // using the static class
    if (empJSON) {
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
    } else {
      res.send("Data doesn't exists");
    }
  }

  static performance(req: any, res: any, next: any) {
    const performance = req.query.performance;
    const empJSON: false | schema[] = Api.empJson(); // using the static
    if (empJSON) {
      const arr = empJSON.filter((elem) => elem.performance >= performance);
      if (arr.length === 0)
        res.send("No Employees with that performance range ");
      else res.send(arr);
    } else {
      res.send("Data doesn't exists");
    }
  }

  static dptCount(req: any, res: any, next: any) {
    const department = req.query.dpt;
    const empJSON: false | schema[] = Api.empJson(); // using the static class
    if (empJSON) {
      const arr = empJSON.filter((elem) => elem.department === department);
      if (arr.length === 0) res.send("No Employees in the department ");
      else
        res.send(
          `Number of employees in the ${department} department are ${arr.length}`
        );
    } else {
      res.send("Data doesn't exists");
    }
  }

  static dptAvg(req: any, res: any, next: any) {
    const empJSON: false | schema[] = Api.empJson(); // using the static class

    if (empJSON) {
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
    } else {
      res.send("Data doesn't exists");
    }
  }

  static empDpt(req: any, res: any, next: any) {
    const department = req.query.dpt;
    const empJSON: false | schema[] = Api.empJson(); // using the static class

    if (empJSON) {
      const arr = empJSON.filter((elem) => elem.department === department);
      if (arr.length === 0) res.send("No Employees in the department ");
      else res.send(arr);
    } else {
      res.send("Data doesn't exists");
    }
  }

  static avgDptSal(req: any, res: any, next: any) {
    const department = req.query.dpt;

    const empJSON: false | schema[] = Api.empJson();
    if (empJSON) {
      const arr = empJSON.filter((elem) => elem.department === department);
      arr.sort((a, b) => b.salary - a.salary);
      let maxSal = arr[0].salary;
      let minSal = arr[arr.length - 1].salary;
      res.send(
        `The max and min salary of department ${department} is ${maxSal} and ${minSal}`
      );
    } else {
      res.send("Data doesn't exists");
    }
  }

  static sortBy(data: schema[], order: number, field: string) {
    if (order === 1) {
      return data.sort((a, b) => a[field] - b[field]);
    } else if (order == -1) {
      return data.sort((a, b) => b[field] - a[field]);
    }
  }
  static sortParam(req: any, res: any, next: any) {
    const field = req.query.field;
    const order = parseInt(req.params.id);
    const empJSON: false | schema[] = Api.empJson(); // using the static class
    if (empJSON) {
      res.json(empJSON);
      Api.sortBy(empJSON, order, field); //sorting function
    } else {
      res.send("Data doesn't exists");
    }
  }

  static updateAll(req: any, res: any, next: any) {
    const toBeUpdatedEmployeIds = req.body.ids;
    const salary: number = parseInt(req.query.salary);
    //toBeUpdatedEmployeIds is an array of multiple ids which we have to update the salary
    const jsonFilePath = path.join(__dirname, "../DATA/myFiles.json");
    const empJSON = require(jsonFilePath);
    toBeUpdatedEmployeIds.map((id: number) => {
      const index = empJSON.findIndex((elem :any) => elem.id === id);
      empJSON[index].salary = salary;
    });
    fs.writeFileSync(jsonFilePath, JSON.stringify(empJSON));
    res.send("Salaries updated successfully");
  }

  static historyData(req: any, res: any, next: any) {
    const id = parseInt(req.params.id);
    const empJSON: false | schema[] = Api.empJson(); // using the static class
    if (empJSON) {
      const index = empJSON.findIndex((elem) => elem.id === id);
      if (index === -1) {
        res.send("Employee not found");
      }
      const historyFilePath = path.join(__dirname, "../DATA/history.json");
      const historyJSON = require(historyFilePath);
      let filteredEmployees = historyJSON.filter((elem:any) => elem.id === id);
      let vari = filteredEmployees[filteredEmployees.length - 1];
      res.send(
        `The employee update history of the employee \n ${JSON.stringify(
          empJSON[index]
        )} \n is \n ${JSON.stringify(vari)}`
      );
    } else {
      res.send("Data doesn't exists");
    }
  }

  static report(req: any, res: any, next: any) {
    var csvJSON = require("csvjson");
    let downloadPath = path.join(__dirname, "../DATA/report.csv");
    const empJSON: false | schema[] = Api.empJson(); // using the static class

    if (empJSON) {
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
    } else {
      res.send("Data doesn't exists");
    }
  }
}
module.exports = { Jwt, Api };

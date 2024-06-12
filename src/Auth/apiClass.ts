const {Jwt} = require('./jwtClass')
const fs = require('fs')
import { Response, Request } from "express";
const path = require('path')

import { empSchema, updateSchema, historySchema,dptSchema,posSchema } from "./schemas";

class Api extends Jwt {
    //Getting the Top Three Elements
    static topThree(req: null, res: Response) {
      const empJSON: empSchema[] = Api.empJson(); // using the static class
      if (empJSON) {
        let count = 0;
        empJSON.sort(
          (a: { salary: number }, b: { salary: number }) => b.salary - a.salary
        );
        for (let i = 2; i < empJSON.length; i++) {
          if (empJSON[i].salary === empJSON[i + 1].salary) {
            continue;
          } else {
            count = i + 1;
            break;
          }
        }
        let arr = empJSON.slice(0, count);
        res.send(arr);
      } else {
        res.send("Data doesn't exists");
      }
    }
  
    static empJson() {
      const jsonFilePath = path.join(__dirname, "../DATA/myFiles.json");
      const empJSON: empSchema[] = require(jsonFilePath);
      return empJSON;
    }
  
    static performance(req: Request, res: Response, next: any) {
      const performance = req.query.performance;
      if (performance) {
        const empJSON: empSchema[] = Api.empJson(); // using the static class
        const arr: empSchema[] = empJSON.filter(
          (elem: { performance: any }) => elem.performance >= performance
        );
        if (arr.length === 0)
          res.send("No Employees with that performance range ");
        else res.send(arr);
      } else {
        res.send("Empty response sent");
      }
    }
  
    static getAverage(req: null, res: Response) {
      let total = 0;
      const empJSON: empSchema[] = Api.empJson(); // using the static class
      let div: number = empJSON.length;
      empJSON.map((elem: { salary: number }) => {
        total += elem.salary;
      });
      let avg: number = total / div;
      res.send(
        "the average and Total Salary of " +
          empJSON.length +
          " employees is " +
          avg +
          " and " +
          total
      );
    }
  
    static dptCount(
      req: { query: { dpt: dptSchema } },
      res: { send: (arg0: string) => void },
      next: any
    ) {
      const department: dptSchema = req.query.dpt;
      const empJSON: empSchema[] = Api.empJson(); // using the static class
      const arr: empSchema[] = empJSON.filter(
        (elem: { department: string }) => elem.department === department
      );
      if (arr.length === 0) res.send("No Employees in the department ");
      else
        res.send(
          `Number of employees in the ${department} department are ${arr.length}`
        );
    }
  
    static dptAvg(req: null, res: Response, next: any) {
      const empJSON = Api.empJson(); // using the static class
      const dptObj: { [key: string]: number[] } = {}; // Add index signature to dptObj
      empJSON.map((e: { department: string }) => {
        dptObj[e.department] = [];
      });
      empJSON.map((e: { department: string; salary: number }) => {
        dptObj[e.department].push(e.salary);
      });
      let responseString: string = "";
      Object.keys(dptObj).forEach((key) => {
        const salaries: number[] = dptObj[key];
        let sum = 0;
        for (let i = 0; i < salaries.length; i++) {
          sum += salaries[i];
        }
        let avg: number = sum / salaries.length;
        responseString += `The average sal of the department ${key} is ${avg}\n`;
      });
      res.send(responseString);
    }
  
    static empDpt(req: { query: { dpt: dptSchema } }, res: Response, next: any) {
      const department: dptSchema = req.query.dpt;
      const empJSON: empSchema[] = Api.empJson(); // using the static class
      const arr: empSchema[] = empJSON.filter(
        (elem: { department: string }) => elem.department === department
      );
      if (arr.length === 0) res.send("No Employees in the department ");
      else res.send(arr);
    }
  
    static avgDptSal(req: { query: { dpt: dptSchema } }, res: Response) {
      const department: dptSchema = req.query.dpt;
      const jsonFilePath: string = path.join(__dirname, "../DATA/myFiles.json");
      const empJSON: empSchema[] = require(jsonFilePath);
      const arr = empJSON.filter(
        (elem: { department: any }) => elem.department === department
      );
      arr.sort(
        (a: { salary: number }, b: { salary: number }) => b.salary - a.salary
      );
      let maxSal: number = arr[0].salary;
      let minSal: number = arr[arr.length - 1].salary;
      res.send(
        `The max and min salary of department ${department} is ${maxSal} and ${minSal}`
      );
    }
  
    static sortBy(data: any[], order: number, field: string | number) {
      if (order === 1) {
        return data.sort(
          (a: { [x: string]: number }, b: { [x: string]: number }) =>
            a[field] - b[field]
        );
      } else if (order == -1) {
        return data.sort(
          (a: { [x: string]: number }, b: { [x: string]: number }) =>
            b[field] - a[field]
        );
      }
    }
    static sortParam(
      req: { query: { field: string }; params: { id: string } },
      res: Response
    ) {
      const field: string = req.query.field;
      const order: number = parseInt(req.params.id);
      const empJSON: empSchema[] = Api.empJson(); // using the static class
      Api.sortBy(empJSON, order, field); //sorting function
      res.json(empJSON);
    }
  
    static updateAll(
      req: { body: { ids: number[] }; query: { salary: string } },
      res: Response
    ) {
      const toBeUpdatedEmployeIds: number[] = req.body.ids;
      const salary: number = parseInt(req.query.salary);
      //toBeUpdatedEmployeIds is an array of multiple ids which we have to update the salary
      const jsonFilePath: string = path.join(__dirname, "../DATA/myFiles.json");
      const empJSON: empSchema[] = require(jsonFilePath);
      toBeUpdatedEmployeIds.map((id: any) => {
        const index: number = empJSON.findIndex(
          (elem: { id: any }) => elem.id === id
        );
        empJSON[index].salary = salary;
      });
      fs.writeFileSync(jsonFilePath, JSON.stringify(empJSON));
      res.send("Salaries updated successfully");
    }
  
    static historyData(
      req: { params: { id: string } },
      res: Response,
      next: any
    ) {
      const id: number = parseInt(req.params.id);
      const empJSON: empSchema[] = Api.empJson(); // using the static class
      const index: number = empJSON.findIndex(
        (elem: { id: number }) => elem.id === id
      );
      if (index === -1) {
        res.send("Employee not found");
      }
      const historyFilePath: string = path.join(
        __dirname,
        "../DATA/history.json"
      );
      const historyJSON = require(historyFilePath);
      let filteredEmployees = historyJSON.filter(
        (elem: { id: number }) => elem.id === id
      );
      let vari = filteredEmployees[filteredEmployees.length - 1];
  
      res.send(
        `The employee update history of the employee \n ${JSON.stringify(
          empJSON[index]
        )} \n is \n ${JSON.stringify(vari)}`
      );
    }
  
    static report(req: any, res: { download: (arg0: any) => void }, next: any) {
      var csvJSON = require("csvjson");
      let downloadPath: string = path.join(__dirname, "../DATA/report.csv");
      const empJSON: empSchema[] = Api.empJson(); // using the static class
      const dptObj: { [key: string]: number[] } = {};
      empJSON.map((e: { department: string | number }) => {
        dptObj[e.department] = [];
      });
      empJSON.map((e: { department: string | number; salary: any }) => {
        dptObj[e.department].push(e.salary);
      });
      let csvObj: {
        department: string;
        totalExpenditure: number;
        averageSal: number;
      }[] = [];
      Object.keys(dptObj).forEach((key) => {
        const salaries: number[] = dptObj[key];
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
module.exports = {Api}
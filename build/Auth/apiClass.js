"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Jwt } = require('./jwtClass');
const fs = require('fs');
const path = require('path');
class Api extends Jwt {
    //Getting the Top Three Elements
    static topThree(req, res) {
        const empJSON = Api.empJson(); // using the static class
        if (empJSON) {
            let count = 0;
            empJSON.sort((a, b) => b.salary - a.salary);
            for (let i = 2; i < empJSON.length; i++) {
                if (empJSON[i].salary === empJSON[i + 1].salary) {
                    continue;
                }
                else {
                    count = i + 1;
                    break;
                }
            }
            let arr = empJSON.slice(0, count);
            res.send(arr);
        }
        else {
            res.send("Data doesn't exists");
        }
    }
    static empJson() {
        const jsonFilePath = path.join(__dirname, "../DATA/myFiles.json");
        const empJSON = require(jsonFilePath);
        return empJSON;
    }
    static performance(req, res, next) {
        const performance = req.query.performance;
        if (performance) {
            const empJSON = Api.empJson(); // using the static class
            const arr = empJSON.filter((elem) => elem.performance >= performance);
            if (arr.length === 0)
                res.send("No Employees with that performance range ");
            else
                res.send(arr);
        }
        else {
            res.send("Empty response sent");
        }
    }
    static getAverage(req, res) {
        let total = 0;
        const empJSON = Api.empJson(); // using the static class
        let div = empJSON.length;
        empJSON.map((elem) => {
            total += elem.salary;
        });
        let avg = total / div;
        res.send("the average and Total Salary of " +
            empJSON.length +
            " employees is " +
            avg +
            " and " +
            total);
    }
    static dptCount(req, res, next) {
        const department = req.query.dpt;
        const empJSON = Api.empJson(); // using the static class
        const arr = empJSON.filter((elem) => elem.department === department);
        if (arr.length === 0)
            res.send("No Employees in the department ");
        else
            res.send(`Number of employees in the ${department} department are ${arr.length}`);
    }
    static dptAvg(req, res, next) {
        const empJSON = Api.empJson(); // using the static class
        const dptObj = {}; // Add index signature to dptObj
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
        if (arr.length === 0)
            res.send("No Employees in the department ");
        else
            res.send(arr);
    }
    static avgDptSal(req, res) {
        const department = req.query.dpt;
        const jsonFilePath = path.join(__dirname, "../DATA/myFiles.json");
        const empJSON = require(jsonFilePath);
        const arr = empJSON.filter((elem) => elem.department === department);
        arr.sort((a, b) => b.salary - a.salary);
        let maxSal = arr[0].salary;
        let minSal = arr[arr.length - 1].salary;
        res.send(`The max and min salary of department ${department} is ${maxSal} and ${minSal}`);
    }
    static sortBy(data, order, field) {
        if (order === 1) {
            return data.sort((a, b) => a[field] - b[field]);
        }
        else if (order == -1) {
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
        res.send(`The employee update history of the employee \n ${JSON.stringify(empJSON[index])} \n is \n ${JSON.stringify(vari)}`);
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
module.exports = { Api };

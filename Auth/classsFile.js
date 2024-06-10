var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var dotenv = require("dotenv");
var jwt = require("jsonwebtoken");
dotenv.config();
var path = require("path");
var fs = require("fs");
var bcrypt = require("bcrypt");
//Class related to JWT Operations
var Jwt = /** @class */ (function () {
    function Jwt() {
    }
    //Verifying the Token
    Jwt.jwtVerify = function (token) {
        var jwtSecretKey = process.env.JWT_SECRET_KEY;
        var verify = jwt.verify(token, jwtSecretKey);
        return verify;
    };
    //Generating the Token
    Jwt.generateToken = function (payload) {
        var jwtSecretKey = process.env.JWT_SECRET_KEY;
        var token = jwt.sign(payload, jwtSecretKey);
        return token;
    };
    return Jwt;
}());
//Class related to API calls
var Api = /** @class */ (function (_super) {
    __extends(Api, _super);
    function Api() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    //Getting the Top Three Elements
    Api.topThree = function (req, res, next) {
        var empJSON = Api.empJson(); // using the static class
        if (empJSON) {
            var count = 0;
            empJSON.sort(function (a, b) { return b.salary - a.salary; });
            for (var i = 2; i < empJSON.length; i++) {
                if (empJSON[i].salary === empJSON[i + 1].salary) {
                    continue;
                }
                else {
                    count = i + 1;
                    break;
                }
            }
            res.json(empJSON.slice(0, count));
        }
        else {
            res.send("File doesnt exists");
        }
    };
    Api.empJson = function () {
        var jsonFilePath = path.join(__dirname, "../DATA/myFiles.json");
        var empJSON = require(jsonFilePath);
        if (empJSON)
            return empJSON;
        else
            return false;
    };
    Api.getAverage = function (req, res, next) {
        var total = 0;
        var empJSON = Api.empJson(); // using the static class
        if (empJSON) {
            var div = empJSON.length;
            empJSON.map(function (elem) {
                total += elem.salary;
            });
            var avg = total / div;
            res.send("the average and Total Salary of " +
                empJSON.length +
                " employees is " +
                avg +
                " and " +
                total);
        }
        else {
            res.send("Data doesn't exists");
        }
    };
    Api.performance = function (req, res, next) {
        var performance = req.query.performance;
        var empJSON = Api.empJson(); // using the static
        if (empJSON) {
            var arr = empJSON.filter(function (elem) { return elem.performance >= performance; });
            if (arr.length === 0)
                res.send("No Employees with that performance range ");
            else
                res.send(arr);
        }
        else {
            res.send("Data doesn't exists");
        }
    };
    Api.dptCount = function (req, res, next) {
        var department = req.query.dpt;
        var empJSON = Api.empJson(); // using the static class
        if (empJSON) {
            var arr = empJSON.filter(function (elem) { return elem.department === department; });
            if (arr.length === 0)
                res.send("No Employees in the department ");
            else
                res.send("Number of employees in the ".concat(department, " department are ").concat(arr.length));
        }
        else {
            res.send("Data doesn't exists");
        }
    };
    Api.dptAvg = function (req, res, next) {
        var empJSON = Api.empJson(); // using the static class
        if (empJSON) {
            var dptObj_1 = {};
            empJSON.map(function (e) {
                dptObj_1[e.department] = [];
            });
            empJSON.map(function (e) {
                dptObj_1[e.department].push(e.salary);
            });
            var responseString_1 = "";
            Object.keys(dptObj_1).forEach(function (key) {
                var salaries = dptObj_1[key];
                var sum = 0;
                for (var i = 0; i < salaries.length; i++) {
                    sum += salaries[i];
                }
                var avg = sum / salaries.length;
                responseString_1 += "The average sal of the department ".concat(key, " is ").concat(avg, "\n");
            });
            res.send(responseString_1);
        }
        else {
            res.send("Data doesn't exists");
        }
    };
    Api.empDpt = function (req, res, next) {
        var department = req.query.dpt;
        var empJSON = Api.empJson(); // using the static class
        if (empJSON) {
            var arr = empJSON.filter(function (elem) { return elem.department === department; });
            if (arr.length === 0)
                res.send("No Employees in the department ");
            else
                res.send(arr);
        }
        else {
            res.send("Data doesn't exists");
        }
    };
    Api.avgDptSal = function (req, res, next) {
        var department = req.query.dpt;
        var empJSON = Api.empJson();
        if (empJSON) {
            var arr = empJSON.filter(function (elem) { return elem.department === department; });
            arr.sort(function (a, b) { return b.salary - a.salary; });
            var maxSal = arr[0].salary;
            var minSal = arr[arr.length - 1].salary;
            res.send("The max and min salary of department ".concat(department, " is ").concat(maxSal, " and ").concat(minSal));
        }
        else {
            res.send("Data doesn't exists");
        }
    };
    Api.sortBy = function (data, order, field) {
        if (order === 1) {
            return data.sort(function (a, b) { return a[field] - b[field]; });
        }
        else if (order == -1) {
            return data.sort(function (a, b) { return b[field] - a[field]; });
        }
    };
    Api.sortParam = function (req, res, next) {
        var field = req.query.field;
        var order = parseInt(req.params.id);
        var empJSON = Api.empJson(); // using the static class
        if (empJSON) {
            res.json(empJSON);
            Api.sortBy(empJSON, order, field); //sorting function
        }
        else {
            res.send("Data doesn't exists");
        }
    };
    Api.updateAll = function (req, res, next) {
        var toBeUpdatedEmployeIds = req.body.ids;
        var salary = parseInt(req.query.salary);
        //toBeUpdatedEmployeIds is an array of multiple ids which we have to update the salary
        var jsonFilePath = path.join(__dirname, "../DATA/myFiles.json");
        var empJSON = require(jsonFilePath);
        toBeUpdatedEmployeIds.map(function (id) {
            var index = empJSON.findIndex(function (elem) { return elem.id === id; });
            empJSON[index].salary = salary;
        });
        fs.writeFileSync(jsonFilePath, JSON.stringify(empJSON));
        res.send("Salaries updated successfully");
    };
    Api.historyData = function (req, res, next) {
        var id = parseInt(req.params.id);
        var empJSON = Api.empJson(); // using the static class
        if (empJSON) {
            var index = empJSON.findIndex(function (elem) { return elem.id === id; });
            if (index === -1) {
                res.send("Employee not found");
            }
            var historyFilePath = path.join(__dirname, "../DATA/history.json");
            var historyJSON = require(historyFilePath);
            var filteredEmployees = historyJSON.filter(function (elem) { return elem.id === id; });
            var vari = filteredEmployees[filteredEmployees.length - 1];
            res.send("The employee update history of the employee \n ".concat(JSON.stringify(empJSON[index]), " \n is \n ").concat(JSON.stringify(vari)));
        }
        else {
            res.send("Data doesn't exists");
        }
    };
    Api.report = function (req, res, next) {
        var csvJSON = require("csvjson");
        var downloadPath = path.join(__dirname, "../DATA/report.csv");
        var empJSON = Api.empJson(); // using the static class
        if (empJSON) {
            var dptObj_2 = {};
            empJSON.map(function (e) {
                dptObj_2[e.department] = [];
            });
            empJSON.map(function (e) {
                dptObj_2[e.department].push(e.salary);
            });
            var csvObj_1 = [];
            Object.keys(dptObj_2).forEach(function (key) {
                var salaries = dptObj_2[key];
                var sum = 0;
                for (var i = 0; i < salaries.length; i++) {
                    sum += salaries[i];
                }
                var average = sum / salaries.length;
                csvObj_1.push({
                    department: key,
                    totalExpenditure: sum,
                    averageSal: average,
                });
            });
            var csvData = csvJSON.toCSV(JSON.stringify(csvObj_1), { headers: "key" });
            fs.writeFileSync(downloadPath, csvData);
            res.download(downloadPath);
        }
        else {
            res.send("Data doesn't exists");
        }
    };
    return Api;
}(Jwt));
module.exports = { Jwt: Jwt, Api: Api };

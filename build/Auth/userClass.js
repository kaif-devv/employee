"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const { Api } = require('./apiClass');
const { Jwt } = require('./jwtClass');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
class User extends Api {
    static login(req, res, next) {
        const bcrypt = require("bcrypt");
        const empJSON = Api.empJson();
        const { email, password } = req.body;
        const employee = empJSON.find((ele) => ele.email === email);
        if (!employee) {
            res.send("Invalid Credentials or Employee doesn't exist");
            return;
        }
        bcrypt.compare(password, employee.password, (err, result) => __awaiter(this, void 0, void 0, function* () {
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
        }));
    }
    static createEmployee(req, res, next) {
        const { name, age, email, password, position, salary, department } = req.body;
        const jsonFilePath = path.join(__dirname, "../DATA/myFiles.json");
        if (!fs.existsSync(jsonFilePath)) {
            fs.writeFileSync(jsonFilePath, "[]");
        }
        const empJSON = Api.empJson();
        const updatedId = empJSON.length > 0 ? empJSON[empJSON.length - 1].id + 1 : 1;
        const index = empJSON.findIndex((elem) => elem.email === email);
        if (index === -1) {
            bcrypt.hash(password, 5, function (err, hash) {
                return __awaiter(this, void 0, void 0, function* () {
                    let d = Date.now().toString().slice(4, 33);
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
                        performance: "3",
                    };
                    empJSON.push(newEmployee);
                    fs.writeFileSync(jsonFilePath, JSON.stringify(empJSON));
                    res.status(201).json("New Employee has been created successfully");
                });
            });
        }
        else {
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
        const empHistoryId = empHistory.length > 0
            ? empHistory[empHistory.length - 1].empHistoryId + 1
            : 1;
        const updatedOBJ = {
            id: id,
            empHistoryId: empHistoryId,
            updatedOn: Date.now().toString().slice(4, 33),
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
            }
            else {
                const comp = bcrypt.compareSync(prevPassword, empJSON[index].password);
                if (!comp) {
                    res.send("Your old password is incorrect");
                }
                else {
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

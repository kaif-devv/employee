"use strict";
//THIS IS A SPARE CODE WHICH CONTAINS ALL THE CLASSES AND METHODS IN ONE SINGLE FILE. THIS WILL BE ONLY USED FOR MINOR DEBUGGING. REST OTHER CLASS FILES HAVE THEIR INDIVIDUAL CLASSES AND METHODS
Object.defineProperty(exports, "__esModule", { value: true });
// const dotenv = require("dotenv");
// const jwt = require("jsonwebtoken");
// dotenv.config();
// const path = require("path");
// const fs = require("fs");
// const bcrypt = require("bcrypt");
// import { Response, Request } from "express";
// import { empSchema, updateSchema, historySchema,dptSchema,posSchema } from "./schemas";
// //Class related to JWT Operations
// class Jwt {
//   //Verifying the Token
//   static jwtVerify(token: string) {
//     let jwtSecretKey = process.env.JWT_SECRET_KEY;
//     const verify = jwt.verify(token, jwtSecretKey);
//     return verify;
//   }
//   //Generating the Token
//   static generateToken(payload: { email: string; isAdmin: boolean }) {
//     let jwtSecretKey = process.env.JWT_SECRET_KEY;
//     const token = jwt.sign(payload, jwtSecretKey);
//     return token;
//   }
// }
// //Class related to API calls
// class Api extends Jwt {
//   //Getting the Top Three Elements
//   static topThree(req: null, res: Response) {
//     const empJSON: empSchema[] = Api.empJson(); // using the static class
//     if (empJSON) {
//       let count = 0;
//       empJSON.sort(
//         (a: { salary: number }, b: { salary: number }) => b.salary - a.salary
//       );
//       for (let i = 2; i < empJSON.length; i++) {
//         if (empJSON[i].salary === empJSON[i + 1].salary) {
//           continue;
//         } else {
//           count = i + 1;
//           break;
//         }
//       }
//       let arr = empJSON.slice(0, count);
//       res.send(arr);
//     } else {
//       res.send("Data doesn't exists");
//     }
//   }
//   static empJson() {
//     const jsonFilePath = path.join(__dirname, "../DATA/myFiles.json");
//     const empJSON: empSchema[] = require(jsonFilePath);
//     return empJSON;
//   }
//   static performance(req: Request, res: Response, next: any) {
//     const performance = req.query.performance;
//     if (performance) {
//       const empJSON: empSchema[] = Api.empJson(); // using the static class
//       const arr: empSchema[] = empJSON.filter(
//         (elem: { performance: any }) => elem.performance >= performance
//       );
//       if (arr.length === 0)
//         res.send("No Employees with that performance range ");
//       else res.send(arr);
//     } else {
//       res.send("Empty response sent");
//     }
//   }
//   static getAverage(req: null, res: Response) {
//     let total = 0;
//     const empJSON: empSchema[] = Api.empJson(); // using the static class
//     let div: number = empJSON.length;
//     empJSON.map((elem: { salary: number }) => {
//       total += elem.salary;
//     });
//     let avg: number = total / div;
//     res.send(
//       "the average and Total Salary of " +
//         empJSON.length +
//         " employees is " +
//         avg +
//         " and " +
//         total
//     );
//   }
//   static dptCount(
//     req: { query: { dpt: dptSchema } },
//     res: { send: (arg0: string) => void },
//     next: any
//   ) {
//     const department: dptSchema = req.query.dpt;
//     const empJSON: empSchema[] = Api.empJson(); // using the static class
//     const arr: empSchema[] = empJSON.filter(
//       (elem: { department: string }) => elem.department === department
//     );
//     if (arr.length === 0) res.send("No Employees in the department ");
//     else
//       res.send(
//         `Number of employees in the ${department} department are ${arr.length}`
//       );
//   }
//   static dptAvg(req: null, res: Response, next: any) {
//     const empJSON = Api.empJson(); // using the static class
//     const dptObj: { [key: string]: number[] } = {}; // Add index signature to dptObj
//     empJSON.map((e: { department: string }) => {
//       dptObj[e.department] = [];
//     });
//     empJSON.map((e: { department: string; salary: number }) => {
//       dptObj[e.department].push(e.salary);
//     });
//     let responseString: string = "";
//     Object.keys(dptObj).forEach((key) => {
//       const salaries: number[] = dptObj[key];
//       let sum = 0;
//       for (let i = 0; i < salaries.length; i++) {
//         sum += salaries[i];
//       }
//       let avg: number = sum / salaries.length;
//       responseString += `The average sal of the department ${key} is ${avg}\n`;
//     });
//     res.send(responseString);
//   }
//   static empDpt(req: { query: { dpt: dptSchema } }, res: Response, next: any) {
//     const department: dptSchema = req.query.dpt;
//     const empJSON: empSchema[] = Api.empJson(); // using the static class
//     const arr: empSchema[] = empJSON.filter(
//       (elem: { department: string }) => elem.department === department
//     );
//     if (arr.length === 0) res.send("No Employees in the department ");
//     else res.send(arr);
//   }
//   static avgDptSal(req: { query: { dpt: dptSchema } }, res: Response) {
//     const department: dptSchema = req.query.dpt;
//     const jsonFilePath: string = path.join(__dirname, "../DATA/myFiles.json");
//     const empJSON: empSchema[] = require(jsonFilePath);
//     const arr = empJSON.filter(
//       (elem: { department: any }) => elem.department === department
//     );
//     arr.sort(
//       (a: { salary: number }, b: { salary: number }) => b.salary - a.salary
//     );
//     let maxSal: number = arr[0].salary;
//     let minSal: number = arr[arr.length - 1].salary;
//     res.send(
//       `The max and min salary of department ${department} is ${maxSal} and ${minSal}`
//     );
//   }
//   static sortBy(data: any[], order: number, field: string | number) {
//     if (order === 1) {
//       return data.sort(
//         (a: { [x: string]: number }, b: { [x: string]: number }) =>
//           a[field] - b[field]
//       );
//     } else if (order == -1) {
//       return data.sort(
//         (a: { [x: string]: number }, b: { [x: string]: number }) =>
//           b[field] - a[field]
//       );
//     }
//   }
//   static sortParam(
//     req: { query: { field: string }; params: { id: string } },
//     res: Response
//   ) {
//     const field: string = req.query.field;
//     const order: number = parseInt(req.params.id);
//     const empJSON: empSchema[] = Api.empJson(); // using the static class
//     Api.sortBy(empJSON, order, field); //sorting function
//     res.json(empJSON);
//   }
//   static updateAll(
//     req: { body: { ids: number[] }; query: { salary: string } },
//     res: Response
//   ) {
//     const toBeUpdatedEmployeIds: number[] = req.body.ids;
//     const salary: number = parseInt(req.query.salary);
//     //toBeUpdatedEmployeIds is an array of multiple ids which we have to update the salary
//     const jsonFilePath: string = path.join(__dirname, "../DATA/myFiles.json");
//     const empJSON: empSchema[] = require(jsonFilePath);
//     toBeUpdatedEmployeIds.map((id: any) => {
//       const index: number = empJSON.findIndex(
//         (elem: { id: any }) => elem.id === id
//       );
//       empJSON[index].salary = salary;
//     });
//     fs.writeFileSync(jsonFilePath, JSON.stringify(empJSON));
//     res.send("Salaries updated successfully");
//   }
//   static historyData(
//     req: { params: { id: string } },
//     res: Response,
//     next: any
//   ) {
//     const id: number = parseInt(req.params.id);
//     const empJSON: empSchema[] = Api.empJson(); // using the static class
//     const index: number = empJSON.findIndex(
//       (elem: { id: number }) => elem.id === id
//     );
//     if (index === -1) {
//       res.send("Employee not found");
//     }
//     const historyFilePath: string = path.join(
//       __dirname,
//       "../DATA/history.json"
//     );
//     const historyJSON = require(historyFilePath);
//     let filteredEmployees = historyJSON.filter(
//       (elem: { id: number }) => elem.id === id
//     );
//     let vari = filteredEmployees[filteredEmployees.length - 1];
//     res.send(
//       `The employee update history of the employee \n ${JSON.stringify(
//         empJSON[index]
//       )} \n is \n ${JSON.stringify(vari)}`
//     );
//   }
//   static report(req: any, res: { download: (arg0: any) => void }, next: any) {
//     var csvJSON = require("csvjson");
//     let downloadPath: string = path.join(__dirname, "../DATA/report.csv");
//     const empJSON: empSchema[] = Api.empJson(); // using the static class
//     const dptObj: { [key: string]: number[] } = {};
//     empJSON.map((e: { department: string | number }) => {
//       dptObj[e.department] = [];
//     });
//     empJSON.map((e: { department: string | number; salary: any }) => {
//       dptObj[e.department].push(e.salary);
//     });
//     let csvObj: {
//       department: string;
//       totalExpenditure: number;
//       averageSal: number;
//     }[] = [];
//     Object.keys(dptObj).forEach((key) => {
//       const salaries: number[] = dptObj[key];
//       let sum = 0;
//       for (let i = 0; i < salaries.length; i++) {
//         sum += salaries[i];
//       }
//       let average = sum / salaries.length;
//       csvObj.push({
//         department: key,
//         totalExpenditure: sum,
//         averageSal: average,
//       });
//     });
//     const csvData = csvJSON.toCSV(JSON.stringify(csvObj), { headers: "key" });
//     fs.writeFileSync(downloadPath, csvData);
//     res.download(downloadPath);
//   }
// }
// //Class related to User Login,register and update
// class User extends Api {
//   static login(
//     req: { body: { email: string; password: any } },
//     res: {
//       send: (arg0: string) => void;
//       status: (arg0: number) => {
//         (): any;
//         new (): any;
//         send: { (arg0: any): any; new (): any };
//       };
//       append: (arg0: string, arg1: string) => void;
//     },
//     next: any
//   ) {
//     const bcrypt = require("bcrypt");
//     const empJSON = Api.empJson();
//     const { email, password } = req.body;
//     const employee = empJSON.find(
//       (ele: { email: string }) => ele.email === email
//     );
//     if (!employee) {
//       res.send("Invalid Credentials or Employee doesn't exist");
//       return;
//     }
//     bcrypt.compare(
//       password,
//       employee.password,
//       async (err: Error, result: boolean) => {
//         if (err) {
//           console.error(err);
//           return res.status(500).send("Internal Server Error");
//         }
//         if (!result) {
//           return res.send("Your password is incorrect");
//         }
//         const payload: {
//           email: string;
//           isAdmin: boolean;
//         } = {
//           email: email,
//           isAdmin: true,
//         };
//         const token: string = Jwt.generateToken(payload); // Generated Token by jwt static generate method
//         res.append("jwt_key", token);
//         res.send("Login successful , token generated is " + token);
//       }
//     );
//   }
//   static createEmployee(
//     req: {
//       body: {
//         name: string;
//         age: number;
//         email: string;
//         password: string;
//         position: string;
//         salary: number;
//         department: string;
//       };
//     },
//     res: {
//       status: (arg0: number) => {
//         (): any;
//         new (): any;
//         json: { (arg0: any): void; new (): any };
//       };
//       send: (arg0: any) => void;
//     },
//     next: any
//   ) {
//     const { name, age, email, password, position, salary, department } =
//       req.body;
//     const jsonFilePath = path.join(__dirname, "../DATA/myFiles.json");
//     if (!fs.existsSync(jsonFilePath)) {
//       fs.writeFileSync(jsonFilePath, "[]");
//     }
//     const empJSON: empSchema[] = Api.empJson();
//     const updatedId: number =
//       empJSON.length > 0 ? empJSON[empJSON.length - 1].id + 1 : 1;
//     const index: number = empJSON.findIndex(
//       (elem: { email: string }) => elem.email === email
//     );
//     if (index === -1) {
//       bcrypt.hash(password, 5, async function (err: any, hash: any) {
//         let d = Date.now().toString().slice(4, 33);
//         const newEmployee: empSchema = {
//           name,
//           age,
//           email,
//           id: updatedId,
//           position,
//           salary,
//           password: hash,
//           department,
//           joinDate: d,
//           performance: "3",
//         };
//         empJSON.push(newEmployee);
//         fs.writeFileSync(jsonFilePath, JSON.stringify(empJSON));
//         res.status(201).json("New Employee has been created successfully");
//       });
//     } else {
//       res.send("Employee already exists ");
//     }
//   }
//   static updateEmployee(
//     req: { body: any; params: { id: string } },
//     res: Response,
//     next: any
//   ) {
//     const updateEmployee: updateSchema = req.body;
//     const prevPassword = updateEmployee.prevPassword;
//     const id: number = parseInt(req.params.id);
//     const historyPath: string = path.join(__dirname, "../DATA/history.json");
//     const jsonFilePath: string = path.join(__dirname, "../DATA/myfiles.json");
//     const empHistory = require(historyPath);
//     const empHistoryId: number =
//       empHistory.length > 0
//         ? empHistory[empHistory.length - 1].empHistoryId + 1
//         : 1;
//     const updatedOBJ: historySchema = {
//       id: id,
//       empHistoryId: empHistoryId,
//       updatedOn: Date.now().toString().slice(4, 33),
//     };
//     const empJSON = require(jsonFilePath);
//     const index = empJSON.findIndex((elem: { id: number }) => elem.id === id); //
//     if (index === -1) {
//       res.send("Employee not found");
//     }
//     if (updateEmployee.name) {
//       updatedOBJ.name = {
//         prevName: empJSON[index].name,
//         currentName: updateEmployee.name,
//       };
//       empJSON[index].name = updateEmployee.name;
//     }
//     if (updateEmployee.salary) {
//       updatedOBJ.salary = {
//         prevSalary: empJSON[index].salary,
//         currentSalary: updateEmployee.salary,
//       };
//       empJSON[index].salary = updateEmployee.salary;
//     }
//     if (updateEmployee.age) {
//       updatedOBJ.age = {
//         prevAge: empJSON[index].age,
//         currentAge: updateEmployee.age,
//       };
//       empJSON[index].age = updateEmployee.age;
//     }
//     if (updateEmployee.department) {
//       updatedOBJ.department = {
//         prevDpt: empJSON[index].department,
//         currentDpt: updateEmployee.department,
//       };
//       empJSON[index].department = updateEmployee.department;
//     }
//     if (updateEmployee.position) {
//       updatedOBJ.position = {
//         prevPosition: empJSON[index].position,
//         currentPosition: updateEmployee.position,
//       };
//       empJSON[index].position = updateEmployee.position;
//     }
//     if (updateEmployee.performance) {
//       updatedOBJ.performance = {
//         prevPerformance: empJSON[index].performance,
//         currentPerformance: updateEmployee.performance,
//       };
//       empJSON[index].performance = updateEmployee.performance;
//     }
//     if (updateEmployee.email) {
//       let ei = empJSON.findIndex(
//         (elem: { email: any }) => elem.email === updateEmployee.email
//       ); //1
//       if (ei !== -1 && ei !== index)
//         res.send("Employee with this email already exists");
//       else {
//         updatedOBJ.email = {
//           prevEmail: empJSON[index].email,
//           currentEmail: updateEmployee.email,
//         };
//         empJSON[index].email = updateEmployee.email;
//       }
//     }
//     if (updateEmployee.password) {
//       if (!prevPassword) {
//         res.send("Please enter old password");
//       } else {
//         const comp = bcrypt.compareSync(prevPassword, empJSON[index].password);
//         if (!comp) {
//           res.send("Your old password is incorrect");
//         } else {
//           const hash = bcrypt.hashSync(updateEmployee.password, 5);
//           empJSON[index].password = hash;
//           updatedOBJ.password = {
//             prevpassword: empJSON[index].password,
//             currentpassword: hash,
//           };
//           updatedOBJ.password = hash;
//           res.send("Password updated successfully");
//         }
//       }
//     }
//     empHistory.push(updatedOBJ);
//     fs.writeFileSync(historyPath, JSON.stringify(empHistory));
//     fs.writeFileSync(jsonFilePath, JSON.stringify(empJSON));
//     res.send("Employe updated successfullyy");
//   }
// }
// //Class related to Crud Operations
// class Crud extends User {
//   static jwtVerification(
//     req: { header: (arg0: string) => string },
//     res: Response,
//     next: () => void
//   ) {
//     const token: string = req.header("jwt_key");
//     try {
//       Jwt.jwtVerify(token);
//       next();
//     } catch (error) {
//       res.send("Invalid user");
//     }
//   }
//   static fileExists(
//     req: any,
//     res: { send: (arg0: string) => void },
//     next: () => void
//   ) {
//     const fs = require("fs");
//     const path = require("path");
//     const jsonFilePath: string = path.join(__dirname, "../DATA/myFiles.json");
//     if (!fs.existsSync(jsonFilePath)) {
//       res.send("Data doesn't exists");
//     } else {
//       next();
//     }
//   }
//   static read(
//     req: { query: { name: string } },
//     res: { send: (arg0: string) => void; json: (arg0: {}[]) => void },
//     next: any
//   ) {
//     const empJSON: empSchema[] = Api.empJson();
//     const name: string = req.query.name;
//     const employ: empSchema[] = empJSON.filter(
//       (elem: { name: string }) => elem.name === name
//     );
//     if (employ.length === 0) res.send("employee not found");
//     res.json(employ);
//   }
//   static search(
//     req: { params: { id: string } },
//     res: { send: (arg0: {}) => void },
//     next: any
//   ) {
//     const empJSON: empSchema[] = Api.empJson();
//     const id: number = parseInt(req.params.id);
//     const e = empJSON.find((elem: { id: number }) => elem.id === id);
//     if (!e) res.send("Employee not found");
//     else {
//       res.send(e);
//     }
//   }
//   static deleteById(
//     req: { params: { id: string } },
//     res: { send: (arg0: string) => void },
//     next: any
//   ) {
//     const empJSON: empSchema[] = Api.empJson();
//     const id: number = parseInt(req.params.id);
//     const index: number = empJSON.findIndex(
//       (elem: { id: number }) => elem.id === id
//     );
//     if (index === -1) res.send("Employee not found");
//     else {
//       empJSON.splice(index, 1);
//       fs.writeFileSync("./DATA/myFiles.json", JSON.stringify(empJSON));
//       res.send("Employee deleted successfully");
//     }
//   }
//   static getAll(
//     req: any,
//     res: { json: (arg0: {}) => void; send: (arg0: string) => void },
//     next: any
//   ) {
//     const empJSON: empSchema[] = Api.empJson();
//     if (empJSON) res.json(empJSON);
//     else {
//       res.send("Employee list empty");
//     }
//   }
//   static getPaginated(
//     req: { params: { id: string } },
//     res: { json: (arg0: {}) => void; send: (arg0: string) => void },
//     next: any
//   ) {
//     const id: number = parseInt(req.params.id);
//     const empJSON: empSchema[] = Api.empJson();
//     if (empJSON) {
//       //pagination for 4 employees
//       const start: number = (id - 1) * 4;
//       const end: number = id * 4;
//       const result: empSchema[] = empJSON.slice(start, end);
//       res.json(result);
//     } else {
//       res.send("Employee list empty");
//     }
//   }
// }
// //Class related to verrification of Input Fields
// class dataVerify extends Crud {
//   static fieldsVerify(
//     req: {
//       body: {
//         name: string;
//         age: number;
//         email: string;
//         password: any;
//         salary: number;
//         position: string;
//         department: string;
//       };
//     },
//     res: { send: (arg0: string) => void },
//     next: () => void
//   ) {
//     const { name, age, email, password, salary, position, department } =
//       req.body;
//     if (
//       !name ||
//       !age ||
//       !position ||
//       !password ||
//       !salary ||
//       !email ||
//       !department
//     ) {
//       res.send("All fields required");
//     } else {
//       next();
//     }
//   }
//   static passwordCheck(
//     req: { body: { password: any } },
//     res: { send: (arg0: string) => void },
//     next: () => any
//   ) {
//     const password: any = req.body.password;
//     if (!password) {
//       return next();
//     }
//     const specialCharRegex: any = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
//     let capitalFlag: boolean = false;
//     let numFlag: boolean = false;
//     let smallFlag: boolean = false;
//     let specialFlag: boolean = false;
//     for (let i = 0; i < password.length; i++) {
//       const char: string = password[i];
//       if (/[A-Z]/.test(char)) {
//         capitalFlag = true;
//       } else if (/[a-z]/.test(char)) {
//         smallFlag = true;
//       } else if (/[0-9]/.test(char)) {
//         numFlag = true;
//       } else if (specialCharRegex.test(char)) {
//         specialFlag = true;
//       }
//     }
//     if (!capitalFlag || !numFlag || !specialFlag || !smallFlag) {
//       res.send(
//         "Password must include uppercase, lowercase, number, and special character"
//       );
//     } else {
//       return next();
//     }
//   }
//   static nameCheck(
//     req: { body: { name: string } },
//     res: { send: (arg0: string) => void },
//     next: () => any
//   ) {
//     const name: string = req.body.name;
//     if (!name) {
//       return next();
//     }
//     if (name.charAt(0) <= "9") {
//       res.send("Name should start with a letter");
//     } else {
//       return next();
//     }
//   }
//   static ageCheck(
//     req: { body: { age: number } },
//     res: { send: (arg0: string) => void },
//     next: () => any
//   ) {
//     const age: number = req.body.age;
//     if (!age) {
//       return next();
//     }
//     if (age < 18 || age > 60) {
//       res.send("Enter the correct age");
//     } else {
//       return next();
//     }
//   }
//   static dptCheck(
//     req: { body: { department: dptSchema } },
//     res: { send: (arg0: string) => void },
//     next: () => any
//   ) {
//     const department: string = req.body.department;
//     if (!department) {
//       return next();
//     }
//     if (
//       department !== "frontend" &&
//       department !== "backend" &&
//       department !== "fullstack"
//     ) {
//       res.send("Enter the correct department");
//     } else {
//       return next();
//     }
//   }
//   static positionCheck(
//     req: { body: { position: posSchema } },
//     res: { send: (arg0: string) => void },
//     next: () => any
//   ) {
//     const position: posSchema = req.body.position;
//     if (!position) {
//       return next();
//     }
//     if (position !== "SDE1" && position !== "SDE2" && position !== "SDE3") {
//       res.send("Enter the correct position");
//     } else {
//       return next();
//     }
//   }
//   static performanceVerify(
//     req: { body: { performance: string } },
//     res: { send: (arg0: string) => void },
//     next: () => any
//   ) {
//     const performance: string = req.body.performance;
//     if (!performance) {
//       return next();
//     }
//     if (performance > "5" || performance < "0") {
//       res.send("Enter the performance rating between 0 and 5");
//     } else {
//       return next();
//     }
//   }
// }
// // module.exports = { Jwt, Api, User, Crud, dataVerify };

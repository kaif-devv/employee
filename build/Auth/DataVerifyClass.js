"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Crud } = require('./CrudClass');
class dataVerify extends Crud {
    static fieldsVerify(req, res, next) {
        const { name, age, email, password, salary, position, department } = req.body;
        if (!name ||
            !age ||
            !position ||
            !password ||
            !salary ||
            !email ||
            !department) {
            res.send("All fields required");
        }
        else {
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
            }
            else if (/[a-z]/.test(char)) {
                smallFlag = true;
            }
            else if (/[0-9]/.test(char)) {
                numFlag = true;
            }
            else if (specialCharRegex.test(char)) {
                specialFlag = true;
            }
        }
        if (!capitalFlag || !numFlag || !specialFlag || !smallFlag) {
            res.send("Password must include uppercase, lowercase, number, and special character");
        }
        else {
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
        }
        else {
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
        }
        else {
            return next();
        }
    }
    static dptCheck(req, res, next) {
        const department = req.body.department;
        if (!department) {
            return next();
        }
        if (department !== "frontend" &&
            department !== "backend" &&
            department !== "fullstack") {
            res.send("Enter the correct department");
        }
        else {
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
        }
        else {
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
        }
        else {
            return next();
        }
    }
}
module.exports = { dataVerify };

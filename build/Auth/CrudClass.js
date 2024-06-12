"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Jwt, User, Api } = require("./userClass");
const fs = require("fs");
class Crud extends User {
    static jwtVerification(req, res, next) {
        const token = req.header("jwt_key");
        try {
            Jwt.jwtVerify(token);
            next();
        }
        catch (error) {
            res.send("Invalid user");
        }
    }
    static fileExists(req, res, next) {
        const fs = require("fs");
        const path = require("path");
        const jsonFilePath = path.join(__dirname, "../DATA/myFiles.json");
        if (!fs.existsSync(jsonFilePath)) {
            res.send("Data doesn't exists");
        }
        else {
            next();
        }
    }
    static read(req, res, next) {
        const empJSON = Api.empJson();
        const name = req.query.name;
        const employ = empJSON.filter((elem) => elem.name === name);
        if (employ.length === 0)
            res.send("employee not found");
        res.json(employ);
    }
    static search(req, res, next) {
        const empJSON = Api.empJson();
        const id = parseInt(req.params.id);
        const e = empJSON.find((elem) => elem.id === id);
        if (!e)
            res.send("Employee not found");
        else {
            res.send(e);
        }
    }
    static deleteById(req, res, next) {
        const empJSON = Api.empJson();
        const id = parseInt(req.params.id);
        const index = empJSON.findIndex((elem) => elem.id === id);
        if (index === -1)
            res.send("Employee not found");
        else {
            empJSON.splice(index, 1);
            fs.writeFileSync("./DATA/myFiles.json", JSON.stringify(empJSON));
            res.send("Employee deleted successfully");
        }
    }
    static getAll(req, res, next) {
        const empJSON = Api.empJson();
        if (empJSON)
            res.json(empJSON);
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
        }
        else {
            res.send("Employee list empty");
        }
    }
}
module.exports = { Crud };

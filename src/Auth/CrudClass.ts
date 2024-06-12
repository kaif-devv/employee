const { Jwt, User, Api } = require("./userClass");
const fs = require("fs");
import { Response } from "express";
import {
  empSchema,
} from "./schemas";

class Crud extends User {
  static jwtVerification(
    req: { header: (arg0: string) => string },
    res: Response,
    next: () => void
  ) {
    const token: string = req.header("jwt_key");
    try {
      Jwt.jwtVerify(token);
      next();
    } catch (error) {
      res.send("Invalid user");
    }
  }

  static fileExists(
    req: any,
    res: { send: (arg0: string) => void },
    next: () => void
  ) {
    const fs = require("fs");
    const path = require("path");
    const jsonFilePath: string = path.join(__dirname, "../DATA/myFiles.json");
    if (!fs.existsSync(jsonFilePath)) {
      res.send("Data doesn't exists");
    } else {
      next();
    }
  }

  static read(
    req: { query: { name: string } },
    res: { send: (arg0: string) => void; json: (arg0: {}[]) => void },
    next: any
  ) {
    const empJSON: empSchema[] = Api.empJson();
    const name: string = req.query.name;
    const employ: empSchema[] = empJSON.filter(
      (elem: { name: string }) => elem.name === name
    );
    if (employ.length === 0) res.send("employee not found");
    res.json(employ);
  }

  static search(
    req: { params: { id: string } },
    res: { send: (arg0: {}) => void },
    next: any
  ) {
    const empJSON: empSchema[] = Api.empJson();
    const id: number = parseInt(req.params.id);
    const e = empJSON.find((elem: { id: number }) => elem.id === id);
    if (!e) res.send("Employee not found");
    else {
      res.send(e);
    }
  }

  static deleteById(
    req: { params: { id: string } },
    res: { send: (arg0: string) => void },
    next: any
  ) {
    const empJSON: empSchema[] = Api.empJson();
    const id: number = parseInt(req.params.id);
    const index: number = empJSON.findIndex(
      (elem: { id: number }) => elem.id === id
    );
    if (index === -1) res.send("Employee not found");
    else {
      empJSON.splice(index, 1);
      fs.writeFileSync("./DATA/myFiles.json", JSON.stringify(empJSON));
      res.send("Employee deleted successfully");
    }
  }

  static getAll(
    req: any,
    res: { json: (arg0: {}) => void; send: (arg0: string) => void },
    next: any
  ) {
    const empJSON: empSchema[] = Api.empJson();
    if (empJSON) res.json(empJSON);
    else {
      res.send("Employee list empty");
    }
  }

  static getPaginated(
    req: { params: { id: string } },
    res: { json: (arg0: {}) => void; send: (arg0: string) => void },
    next: any
  ) {
    const id: number = parseInt(req.params.id);
    const empJSON: empSchema[] = Api.empJson();
    if (empJSON) {
      //pagination for 4 employees
      const start: number = (id - 1) * 4;
      const end: number = id * 4;
      const result: empSchema[] = empJSON.slice(start, end);
      res.json(result);
    } else {
      res.send("Employee list empty");
    }
  }
}
module.exports = { Crud };

const { Crud } = require("./CrudClass");
import { dptSchema, posSchema } from "./schemas";

class dataVerify extends Crud {
  static fieldsVerify(
    req: {
      body: {
        name: string;
        age: number;
        email: string;
        password: any;
        salary: number;
        position: string;
        department: string;
      };
    },
    res: { send: (arg0: string) => void },
    next: () => void
  ) {
    const { name, age, email, password, salary, position, department } =
      req.body;
    if (
      !name ||
      !age ||
      !position ||
      !password ||
      !salary ||
      !email ||
      !department
    ) {
      res.send("All fields required");
    } else {
      next();
    }
  }

  static passwordCheck(
    req: { body: { password: any } },
    res: { send: (arg0: string) => void },
    next: () => any
  ) {
    const password: any = req.body.password;
    if (!password) {
      return next();
    }
    const specialCharRegex: any = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    let capitalFlag: boolean = false;
    let numFlag: boolean = false;
    let smallFlag: boolean = false;
    let specialFlag: boolean = false;

    for (let i = 0; i < password.length; i++) {
      const char: string = password[i];
      if (/[A-Z]/.test(char)) {
        capitalFlag = true;
      } else if (/[a-z]/.test(char)) {
        smallFlag = true;
      } else if (/[0-9]/.test(char)) {
        numFlag = true;
      } else if (specialCharRegex.test(char)) {
        specialFlag = true;
      }
    }
    if (!capitalFlag || !numFlag || !specialFlag || !smallFlag) {
      res.send(
        "Password must include uppercase, lowercase, number, and special character"
      );
    } else {
      return next();
    }
  }

  static nameCheck(
    req: { body: { name: string } },
    res: { send: (arg0: string) => void },
    next: () => any
  ) {
    const name: string = req.body.name;
    if (!name) {
      return next();
    }
    if (name.charAt(0) <= "9") {
      res.send("Name should start with a letter");
    } else {
      return next();
    }
  }

  static ageCheck(
    req: { body: { age: number } },
    res: { send: (arg0: string) => void },
    next: () => any
  ) {
    const age: number = req.body.age;
    if (!age) {
      return next();
    }
    if (age < 18 || age > 60) {
      res.send("Enter the correct age");
    } else {
      return next();
    }
  }

  static dptCheck(
    req: { body: { department: dptSchema } },
    res: { send: (arg0: string) => void },
    next: () => any
  ) {
    const department: string = req.body.department;
    if (!department) {
      return next();
    }
    if (
      department !== "frontend" &&
      department !== "backend" &&
      department !== "fullstack"
    ) {
      res.send("Enter the correct department");
    } else {
      return next();
    }
  }

  static positionCheck(
    req: { body: { position: posSchema } },
    res: { send: (arg0: string) => void },
    next: () => any
  ) {
    const position: posSchema = req.body.position;
    if (!position) {
      return next();
    }
    if (position !== "SDE1" && position !== "SDE2" && position !== "SDE3") {
      res.send("Enter the correct position");
    } else {
      return next();
    }
  }

  static performanceVerify(
    req: { body: { performance: string } },
    res: { send: (arg0: string) => void },
    next: () => any
  ) {
    const performance: string = req.body.performance;
    if (!performance) {
      return next();
    }
    if (performance > "5" || performance < "0") {
      res.send("Enter the performance rating between 0 and 5");
    } else {
      return next();
    }
  }
}

module.exports = { dataVerify };

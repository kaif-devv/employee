const express = require("express");
const router = express();

const { fileExists } = require("../../Auth/dataVerify");
const {
  getAverage,
  topThree,
  performance,
  dptCount,
  dptAvg,
  empDpt,
  avgDptSal,
  sortParam,
  updateAll,
  historyData,
  report,
} = require("../../Auth/FunctionCalls");

//Top three employees with high salary

router.get("/topThree", fileExists, topThree);

//Average and total salary of all employees

router.get("/average", fileExists, getAverage);

//Report which generates CSV

router.get("/report", fileExists, report);

//Get employees by department

router.get("/department", fileExists, empDpt);

//Employee Count by department

router.get("/department/count", fileExists, dptCount);

//Average salary of all the employees in department

router.get("/department/average/all", fileExists, dptAvg);

//Get employees on performance rating

router.get("/performance", fileExists, performance);

//Get average Salary by department

router.get("/department/sal", fileExists, avgDptSal);

//endpoint to fetch employees sorted by a specific field (e.g., name, salary, joining date), Allow sorting in both ascending and descending order

router.get("/sort/:id", fileExists, sortParam);

//Create an endpoint to update multiple employee records in one request, This can be used to apply a common change to a specific group of employees (e.g., annual salary increment).

router.put("/updateall", fileExists, updateAll);

//Implement a feature to track changes to employee records, Create an endpoint to fetch the history of changes made to a specific employee record. Store previous versions of employee data and create an endpoint to fetch the change history for a specific employee.

router.get("/history/:id", fileExists, historyData);

module.exports = router;

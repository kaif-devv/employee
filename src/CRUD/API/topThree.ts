const express = require("express");
const router = express();

const { Api } = require("../../Auth/apiClass");
const { Crud } = require("../../Auth/CrudClass");


//Top three employees with high salary

router.get("/topThree", Crud.fileExists, Api.topThree);

//Average and total salary of all employees

router.get("/average", Crud.fileExists, Api.getAverage);

// //Report which generates CSV

router.get("/report", Crud.fileExists, Api.report);

//Get employees by department

router.get("/department", Crud.fileExists, Api.empDpt);

//Employee Count by department

router.get("/department/count", Crud.fileExists, Api.dptCount);

//Average salary of all the employees in department

router.get("/department/average/all", Crud.fileExists, Api.dptAvg);

//Get employees on performance rating

router.get("/performance", Crud.fileExists, Api.performance);

//Get average Salary by department

router.get("/department/sal", Crud.fileExists, Api.avgDptSal);

//endpoint to fetch employees sorted by a specific field (e.g., name, salary, joining date), Allow sorting in both ascending and descending order

router.get("/sort/:id", Crud.fileExists, Api.sortParam);

//Create an endpoint to update multiple employee records in one request, This can be used to apply a common change to a specific group of employees (e.g., annual salary increment).

router.put("/updateall", Crud.fileExists, Api.updateAll);

//Implement a feature to track changes to employee records, Create an endpoint to fetch the history of changes made to a specific employee record. Store previous versions of employee data and create an endpoint to fetch the change history for a specific employee.

router.get("/history/:id", Crud.fileExists, Api.historyData);

module.exports = router;

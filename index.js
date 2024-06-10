const express = require("express");
const readRoute = require("./CRUD/Read.ts");
const createRoute = require("./CRUD/Create.ts");
const deleteRoute = require("./CRUD/Delete.ts");
const updateRoute = require("./CRUD/Update.ts");
const searchRoute = require("./CRUD/Search.ts");
const loginRoute = require("./CRUD/Login.ts");
const topThreeEmp = require("./CRUD/API/topThree")
const allRoute = require("./CRUD/All.ts");

const app = express();
const port = 3000;

// const jsonFilePath = path.join(__dirname, "./DATA/myFiles.json");
// const empJSON = require(jsonFilePath)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json("Home");
});

//top three

app.use(topThreeEmp)
//login

app.use('/login' ,loginRoute)

//get all

app.use(allRoute)

//create an employee

app.use(createRoute);

//delete an Employee

app.use(deleteRoute);
//read an employee through query

app.use(readRoute);

//Update an Employee

app.use(updateRoute);

//searching through params

app.use(searchRoute);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

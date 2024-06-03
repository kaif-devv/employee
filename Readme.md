send the data into the object csvObj such that it has {
    depatrment: frontend,
    total : xx ,
    average xx
}

router.get("/report", (req, res, next) => {
  let total = 0;
  const jsonFilePath = path.join(__dirname, "../../DATA/myFiles.json");
  if (!fs.existsSync(jsonFilePath)) {
    res.send("Data doesn't exists");
  }
  const empJSON = require(jsonFilePath);
  let div = empJSON.length;
  empJSON.map((elem) => {
    total += elem.salary;
  });
  let avg = total / div;

  let responseString = "";
  const dptObj = {};
  empJSON.map((e) => {
    dptObj[e.department] = [];
  });
  empJSON.map((e) => {
    dptObj[e.department].push(e.salary);
  });
  let csvObj = {};
  Object.keys(dptObj).forEach((key) => {
    const salaries = dptObj[key]; 
    let sum = 0;
    for (let i = 0; i < salaries.length; i++) {
      sum += salaries[i];
    }
    responseString += `Department: ${key} , Total: ${sum}\n`;
  });
  res.send(`The salary expenditure is ${total} and Average salary is ${avg} \n \n The Salary distributions across different departments are: \n ${responseString}`);
});
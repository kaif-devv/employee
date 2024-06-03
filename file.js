const arr = {
  frontend: [8000],
  backend: [7000, 5520, 6520, 7520],
  fullstack: [9230, 5520, 6020],
  back: [2000,500,2540,12,2522]
};

// for (const department in arr) {
//   if (arr.hasOwnProperty(department)) {
//     const salaries = arr[department];
//     const sum = salaries.reduce((acc, salary) => acc + salary, 0);
//     const average = sum / salaries.length;
//     console.log(`The average sal of ${department} is ${average}`);
//   }
// }

Object.keys(arr).forEach
(key => {
  const salaries = arr[key];
  let sum = 0;
  for(let i = 0;i<salaries.length;i++){
    sum += salaries[i]
  }
 let avg = sum/salaries.length
  console.log(`The average sal of ${key} is ${avg}`);
});


// Object.keys(arr).forEach(key => {
//   const salaries = arr[key];
//   const sum = salaries.reduce((acc, salary) => acc + salary, 0);
//   const average = sum / salaries.length;
//   console.log(`The average sal of ${key} is ${average}`);
// });

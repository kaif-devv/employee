interface Product {
  id: number;
  name: string;
  type: String;
}

function getProduct(id: number): Product {
  return {
    id: id,
    name: `Gadgets of 360 in ${id + 1}`,
    type: "h",
  };
}

const car: { type: string; model: string; year: number } = {
  type: "Toyota",
  model: "Corolla",
  year: 4,
};

let employee: [string, string, number?] = ["skills", "Job"];

console.log(employee[1]);

const arr: number[] = [1, 2, 3];
const a: { [key: string]: number|string } = { kaif: 1 , ksit:5, "5": "5"};

const employees = [
    {
        name: "John Doe",
        age: 30,
        id: 1,
        position: "Software Engineer",
        department: "Engineering"
    },
    {
        name: "Jane",
        age: 25,
        id: 2,
        position: "UX Designer",
        department: "Design"
    },
    {
        name: "Mark Johnson",
        age: 35,
        id: 3,
        position: "Marketing Manager",
        department: "Marketing"
    }
];

module.exports = JSON.stringify(employees);

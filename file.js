const jwt = require('jsonwebtoken');
const token = 'yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InBhQGdtYWlsLmNvbSIsImlkIjozLCJpYXQiOjE3MTY5Njg5OTd9.6mZqYfbf5DZMVUYoHNWRmgwy-cFjxtdaSfJIF8AJcV8'
try {
var decoded = jwt.verify(token, 'SECRET_KEY');
console.log(decoded)
  
} catch (error) {
  console.log(error);
}

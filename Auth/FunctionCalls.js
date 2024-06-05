function sortBy(data, order, field) {
  if (order === 1) {
   return data.sort((a, b) => a[field] - b[field]);
  } else if (order == -1) {
  return  data.sort((a, b) => b[field] - a[field]);
  }
}

module.exports = {sortBy}
// utils/dateFormatter.js
const formatDate = (date) => {
    if (!date) return null;
  
    const d = new Date(date);
    const day = (`0${d.getUTCDate()}`).slice(-2);
    const month = (`0${d.getUTCMonth() + 1}`).slice(-2); // Months are zero-based in JavaScript
    const year = d.getUTCFullYear();
  
    return `${day}-${month}-${year}`;
  };
  
  module.exports = { formatDate };
  
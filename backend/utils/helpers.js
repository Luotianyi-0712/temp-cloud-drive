const { nanoid } = require('nanoid');

// Generate random access code
function generateAccessCode(length = 6) {
  return nanoid(length);
}

// Calculate expiration date
function calculateExpirationDate(days = 7) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

module.exports = {
  generateAccessCode,
  calculateExpirationDate
};

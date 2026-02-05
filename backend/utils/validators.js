// Email validation
const isValidEmail = (email) => {
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(email);
};

// Password strength validation
const isStrongPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
};

// MongoDB ObjectId validation
const isValidObjectId = (id) => {
  const regex = /^[0-9a-fA-F]{24}$/;
  return regex.test(id);
};

// URL validation
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

// Date validation
const isValidDate = (date) => {
  return date instanceof Date && !isNaN(date);
};

// Sanitize input (remove HTML tags)
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.replace(/<[^>]*>/g, '');
};

// Validate array of IDs
const areValidObjectIds = (ids) => {
  if (!Array.isArray(ids)) return false;
  return ids.every(id => isValidObjectId(id));
};

module.exports = {
  isValidEmail,
  isStrongPassword,
  isValidObjectId,
  isValidUrl,
  isValidDate,
  sanitizeInput,
  areValidObjectIds
};
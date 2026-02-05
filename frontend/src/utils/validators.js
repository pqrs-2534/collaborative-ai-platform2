// Validate required field
export const required = (value) => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return 'This field is required';
  }
  return null;
};

// Validate email
export const email = (value) => {
  if (!value) return null;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(value)) {
    return 'Please enter a valid email address';
  }
  return null;
};

// Validate password
export const password = (value) => {
  if (!value) return null;
  if (value.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  return null;
};

// Validate strong password
export const strongPassword = (value) => {
  if (!value) return null;
  if (value.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  if (!/[A-Z]/.test(value)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/[a-z]/.test(value)) {
    return 'Password must contain at least one lowercase letter';
  }
  if (!/[0-9]/.test(value)) {
    return 'Password must contain at least one number';
  }
  return null;
};

// Validate password match
export const passwordMatch = (value, compareValue) => {
  if (value !== compareValue) {
    return 'Passwords do not match';
  }
  return null;
};

// Validate min length
export const minLength = (min) => (value) => {
  if (!value) return null;
  if (value.length < min) {
    return `Must be at least ${min} characters`;
  }
  return null;
};

// Validate max length
export const maxLength = (max) => (value) => {
  if (!value) return null;
  if (value.length > max) {
    return `Must be no more than ${max} characters`;
  }
  return null;
};

// Validate URL
export const url = (value) => {
  if (!value) return null;
  try {
    new URL(value);
    return null;
  } catch (error) {
    return 'Please enter a valid URL';
  }
};

// Validate number
export const number = (value) => {
  if (!value) return null;
  if (isNaN(value)) {
    return 'Please enter a valid number';
  }
  return null;
};

// Validate min number
export const minNumber = (min) => (value) => {
  if (!value) return null;
  if (Number(value) < min) {
    return `Must be at least ${min}`;
  }
  return null;
};

// Validate max number
export const maxNumber = (max) => (value) => {
  if (!value) return null;
  if (Number(value) > max) {
    return `Must be no more than ${max}`;
  }
  return null;
};

// Validate date
export const date = (value) => {
  if (!value) return null;
  const dateObj = new Date(value);
  if (isNaN(dateObj.getTime())) {
    return 'Please enter a valid date';
  }
  return null;
};

// Validate future date
export const futureDate = (value) => {
  if (!value) return null;
  const dateObj = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (dateObj < today) {
    return 'Date must be in the future';
  }
  return null;
};

// Compose multiple validators
export const composeValidators = (...validators) => (value) => {
  for (let validator of validators) {
    const error = validator(value);
    if (error) return error;
  }
  return null;
};

// Validate form
export const validateForm = (values, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach((field) => {
    const validators = Array.isArray(rules[field]) ? rules[field] : [rules[field]];
    for (let validator of validators) {
      const error = validator(values[field]);
      if (error) {
        errors[field] = error;
        break;
      }
    }
  });

  return errors;
};

// Check if form has errors
export const hasErrors = (errors) => {
  return Object.keys(errors).length > 0;
};
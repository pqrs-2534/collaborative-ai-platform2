// Sanitize user data before sending to client
const sanitizeUser = (user) => {
  const { password, resetPasswordToken, resetPasswordExpire, ...sanitized } = user.toObject();
  return sanitized;
};

// Calculate pagination
const getPagination = (page = 1, limit = 10) => {
  const skip = (parseInt(page) - 1) * parseInt(limit);
  return {
    skip,
    limit: parseInt(limit)
  };
};

// Format pagination response
const paginationResponse = (data, page, limit, total) => {
  return {
    data,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: parseInt(limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1
    }
  };
};

// Generate random color for avatars/projects
const generateRandomColor = () => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
    '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
    '#F8B739', '#52B788', '#E76F51', '#2A9D8F'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Format error messages
const formatErrorMessage = (error) => {
  if (error.errors) {
    // Mongoose validation errors
    return Object.values(error.errors).map(err => err.message).join(', ');
  }
  return error.message || 'An error occurred';
};

// Check if user has permission
const hasPermission = (user, project, requiredRole = 'team_member') => {
  const roleHierarchy = {
    'admin': 4,
    'project_manager': 3,
    'team_member': 2,
    'guest': 1
  };

  // Check if user is project owner
  if (project.owner.toString() === user._id.toString()) {
    return true;
  }

  // Find user's role in project
  const member = project.members.find(
    m => m.user.toString() === user._id.toString()
  );

  if (!member) {
    return false;
  }

  return roleHierarchy[member.role] >= roleHierarchy[requiredRole];
};

// Format date for display
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Calculate days remaining until deadline
const daysUntilDeadline = (deadline) => {
  const now = new Date();
  const end = new Date(deadline);
  const diff = end - now;
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days;
};

// Validate file type
const isValidFileType = (mimetype, allowedTypes = []) => {
  if (allowedTypes.length === 0) {
    // Default allowed types
    allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
  }
  return allowedTypes.includes(mimetype);
};

// Generate unique identifier
const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

module.exports = {
  sanitizeUser,
  getPagination,
  paginationResponse,
  generateRandomColor,
  formatErrorMessage,
  hasPermission,
  formatDate,
  daysUntilDeadline,
  isValidFileType,
  generateUniqueId
};
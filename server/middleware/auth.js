import jwt from 'jsonwebtoken';
import { collections } from '../services/dbStore.js';

const JWT_SECRET = process.env.JWT_SECRET || 'smartmanufacture_super_secret_jwt_key_2026';

// Middleware to authenticate JWT token
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authentication required. No Bearer token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const user = await collections.users.findById(decoded.id);
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'User not found or account deactivated.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.', error: error.message });
  }
};

// Middleware to authorize specific user roles
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated.' });
    }

    // Super Admin has access to all modules and operations
    if (req.user.role === 'Super Admin') {
      return next();
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Role '${req.user.role}' is not authorized to access this resource. Required: [${roles.join(', ')}]`
      });
    }

    next();
  };
};

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      role: user.role,
      department: user.department
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

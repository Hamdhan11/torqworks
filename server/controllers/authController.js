import bcrypt from 'bcryptjs';
import { collections } from '../services/dbStore.js';
import { generateToken } from '../middleware/auth.js';
import { logAudit } from '../services/workflowEngine.js';

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }

    const user = await collections.users.findOne({ username });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account is deactivated. Contact System Administrator.' });
    }

    // Update last login
    await collections.users.findByIdAndUpdate(user._id, { lastLogin: new Date().toISOString() });

    const token = generateToken(user);

    await logAudit(user, 'USER_LOGIN', 'Basis / Security', user.username, `User logged in successfully as ${user.role}`, req);

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        department: user.department,
        employeeId: user.employeeId
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error during login', error: error.message });
  }
};

export const switchRoleDemo = async (req, res) => {
  try {
    const { targetRole } = req.body;
    const user = await collections.users.findOne({ role: targetRole });
    if (!user) {
      return res.status(404).json({ success: false, message: `No user configured with role '${targetRole}'` });
    }

    const token = generateToken(user);
    return res.json({
      success: true,
      message: `Simulated role switch to ${targetRole}`,
      token,
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        department: user.department,
        employeeId: user.employeeId
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    return res.json({
      success: true,
      user: {
        id: req.user._id,
        username: req.user.username,
        fullName: req.user.fullName,
        email: req.user.email,
        role: req.user.role,
        department: req.user.department,
        employeeId: req.user.employeeId
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

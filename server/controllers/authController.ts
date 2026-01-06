import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';
import Doctor from '../models/Doctor';
import Patient from '../models/Patient';
import AuditLog from '../models/AuditLog';

const generateToken = (id: string, role: string): string => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

const createAuditLog = async (
  action: string,
  actor: string,
  actorId: string,
  role: string,
  target: string,
  targetId?: string,
  ipAddress?: string
) => {
  try {
    await AuditLog.create({
      action,
      actor,
      actorId,
      role,
      target,
      targetId,
      ipAddress,
    });
  } catch (error) {
    console.error('Error creating audit log:', error);
  }
};

// Register user
export const register = async (req: Request, res: Response) => {
  try {
    const { role, ...userData } = req.body;

    let user;
    let Model;

    switch (role) {
      case 'ADMIN':
        Model = Admin;
        break;
      case 'DOCTOR':
        Model = Doctor;
        break;
      case 'PATIENT':
        Model = Patient;
        break;
      default:
        return res.status(400).json({ message: 'Invalid role specified' });
    }

    // Check if user already exists
    const existingUser = await Model.findOne({ email: userData.email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user
    user = await Model.create(userData);

    // Create audit log
    await createAuditLog(
      'User Registration',
      user.name,
      user._id.toString(),
      role,
      'System',
      undefined,
      req.ip
    );

    // Generate token
    const token = generateToken(user._id.toString(), role);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: role,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Login user
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Please provide email, password, and role' });
    }

    let Model;
    switch (role) {
      case 'ADMIN':
        Model = Admin;
        break;
      case 'DOCTOR':
        Model = Doctor;
        break;
      case 'PATIENT':
        Model = Patient;
        break;
      default:
        return res.status(400).json({ message: 'Invalid role specified' });
    }

    // Find user and include password
    const user = await Model.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is deactivated' });
    }

    // Verify password
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Create audit log
    await createAuditLog(
      'User Login',
      user.name,
      user._id.toString(),
      role,
      'System',
      undefined,
      req.ip
    );

    // Generate token
    const token = generateToken(user._id.toString(), role);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: role,
        specialty: (user as any).specialty,
        avatar: user.avatar,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Get current user
export const getMe = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let Model;
    switch (userRole) {
      case 'ADMIN':
        Model = Admin;
        break;
      case 'DOCTOR':
        Model = Doctor;
        break;
      case 'PATIENT':
        Model = Patient;
        break;
      default:
        return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await Model.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

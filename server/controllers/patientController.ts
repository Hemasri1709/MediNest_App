import { Response } from 'express';
import Patient from '../models/Patient';
import { AuthRequest } from '../middleware/auth';

// Get all patients
export const getAllPatients = async (req: AuthRequest, res: Response) => {
  try {
    const patients = await Patient.find({ isActive: true }).select('-password');
    
    res.status(200).json({
      success: true,
      count: patients.length,
      patients,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Get single patient
export const getPatient = async (req: AuthRequest, res: Response) => {
  try {
    const patient = await Patient.findById(req.params.id).select('-password');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json({
      success: true,
      patient,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Create patient
export const createPatient = async (req: AuthRequest, res: Response) => {
  try {
    const patient = await Patient.create(req.body);

    res.status(201).json({
      success: true,
      patient,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Update patient
export const updatePatient = async (req: AuthRequest, res: Response) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).select('-password');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json({
      success: true,
      patient,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Delete patient (soft delete)
export const deletePatient = async (req: AuthRequest, res: Response) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Patient deactivated successfully',
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Get patient's medical history
export const getPatientMedicalHistory = async (req: AuthRequest, res: Response) => {
  try {
    const patient = await Patient.findById(req.params.id).select('medicalHistory');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json({
      success: true,
      medicalHistory: patient.medicalHistory,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

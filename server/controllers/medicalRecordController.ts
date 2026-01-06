import { Response } from 'express';
import MedicalRecord from '../models/MedicalRecord';
import { AuthRequest } from '../middleware/auth';

// Get all medical records
export const getAllMedicalRecords = async (req: AuthRequest, res: Response) => {
  try {
    const records = await MedicalRecord.find()
      .populate('patientId', 'name email')
      .populate('doctorId', 'name specialty')
      .sort({ date: -1 });
    
    res.status(200).json({
      success: true,
      count: records.length,
      records,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Get single medical record
export const getMedicalRecord = async (req: AuthRequest, res: Response) => {
  try {
    const record = await MedicalRecord.findById(req.params.id)
      .populate('patientId', 'name email')
      .populate('doctorId', 'name specialty');

    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    res.status(200).json({
      success: true,
      record,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Get medical records by patient
export const getPatientMedicalRecords = async (req: AuthRequest, res: Response) => {
  try {
    const records = await MedicalRecord.find({ patientId: req.params.patientId })
      .populate('doctorId', 'name specialty')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: records.length,
      records,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Create medical record
export const createMedicalRecord = async (req: AuthRequest, res: Response) => {
  try {
    const record = await MedicalRecord.create(req.body);

    res.status(201).json({
      success: true,
      record,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Update medical record
export const updateMedicalRecord = async (req: AuthRequest, res: Response) => {
  try {
    const record = await MedicalRecord.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    res.status(200).json({
      success: true,
      record,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Delete medical record
export const deleteMedicalRecord = async (req: AuthRequest, res: Response) => {
  try {
    const record = await MedicalRecord.findByIdAndDelete(req.params.id);

    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Medical record deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

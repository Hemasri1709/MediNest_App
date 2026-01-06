import { Response } from 'express';
import Doctor from '../models/Doctor';
import { AuthRequest } from '../middleware/auth';

// Get all doctors
export const getAllDoctors = async (req: AuthRequest, res: Response) => {
  try {
    const doctors = await Doctor.find({ isActive: true }).select('-password');
    
    res.status(200).json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Get single doctor
export const getDoctor = async (req: AuthRequest, res: Response) => {
  try {
    const doctor = await Doctor.findById(req.params.id).select('-password');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json({
      success: true,
      doctor,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Create doctor
export const createDoctor = async (req: AuthRequest, res: Response) => {
  try {
    const doctor = await Doctor.create(req.body);

    res.status(201).json({
      success: true,
      doctor,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Update doctor
export const updateDoctor = async (req: AuthRequest, res: Response) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).select('-password');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json({
      success: true,
      doctor,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Delete doctor (soft delete)
export const deleteDoctor = async (req: AuthRequest, res: Response) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Doctor deactivated successfully',
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Get doctors by specialty
export const getDoctorsBySpecialty = async (req: AuthRequest, res: Response) => {
  try {
    const { specialty } = req.params;
    const doctors = await Doctor.find({ 
      specialty, 
      isActive: true 
    }).select('-password');

    res.status(200).json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Get doctor's available slots
export const getDoctorAvailability = async (req: AuthRequest, res: Response) => {
  try {
    const doctor = await Doctor.findById(req.params.id).select('availableSlots');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json({
      success: true,
      availableSlots: doctor.availableSlots,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

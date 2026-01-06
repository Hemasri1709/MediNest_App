import { Response } from 'express';
import Appointment from '../models/Appointment';
import { AuthRequest } from '../middleware/auth';

// Get all appointments
export const getAllAppointments = async (req: AuthRequest, res: Response) => {
  try {
    const appointments = await Appointment.find()
      .populate('patientId', 'name email phone')
      .populate('doctorId', 'name specialty')
      .sort({ date: -1 });
    
    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Get single appointment
export const getAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId', 'name email phone')
      .populate('doctorId', 'name specialty');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json({
      success: true,
      appointment,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Get appointments by patient
export const getPatientAppointments = async (req: AuthRequest, res: Response) => {
  try {
    const appointments = await Appointment.find({ patientId: req.params.patientId })
      .populate('doctorId', 'name specialty')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Get appointments by doctor
export const getDoctorAppointments = async (req: AuthRequest, res: Response) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.params.doctorId })
      .populate('patientId', 'name email phone')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Create appointment
export const createAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const appointment = await Appointment.create(req.body);

    res.status(201).json({
      success: true,
      appointment,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Update appointment
export const updateAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json({
      success: true,
      appointment,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Delete appointment
export const deleteAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Appointment deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Update appointment status
export const updateAppointmentStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json({
      success: true,
      appointment,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

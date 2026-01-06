import express from 'express';
import {
  getAllAppointments,
  getAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  updateAppointmentStatus,
} from '../controllers/appointmentController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

router.use(authenticate); // All routes require authentication

router.get('/', authorize('ADMIN', 'DOCTOR'), getAllAppointments);
router.get('/:id', getAppointment);
router.get('/patient/:patientId', getPatientAppointments);
router.get('/doctor/:doctorId', getDoctorAppointments);
router.post('/', authorize('ADMIN', 'PATIENT', 'DOCTOR'), createAppointment);
router.put('/:id', authorize('ADMIN', 'DOCTOR', 'PATIENT'), updateAppointment);
router.delete('/:id', authorize('ADMIN', 'PATIENT'), deleteAppointment);
router.patch('/:id/status', authorize('ADMIN', 'DOCTOR'), updateAppointmentStatus);

export default router;

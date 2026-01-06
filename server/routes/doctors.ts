import express from 'express';
import {
  getAllDoctors,
  getDoctor,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorsBySpecialty,
  getDoctorAvailability,
} from '../controllers/doctorController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

router.use(authenticate); // All routes require authentication

router.get('/', getAllDoctors);
router.get('/:id', getDoctor);
router.post('/', authorize('ADMIN'), createDoctor);
router.put('/:id', authorize('ADMIN', 'DOCTOR'), updateDoctor);
router.delete('/:id', authorize('ADMIN'), deleteDoctor);
router.get('/specialty/:specialty', getDoctorsBySpecialty);
router.get('/:id/availability', getDoctorAvailability);

export default router;

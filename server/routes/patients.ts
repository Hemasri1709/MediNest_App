import express from 'express';
import {
  getAllPatients,
  getPatient,
  createPatient,
  updatePatient,
  deletePatient,
  getPatientMedicalHistory,
} from '../controllers/patientController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

router.use(authenticate); // All routes require authentication

router.get('/', authorize('ADMIN', 'DOCTOR'), getAllPatients);
router.get('/:id', authorize('ADMIN', 'DOCTOR', 'PATIENT'), getPatient);
router.post('/', authorize('ADMIN'), createPatient);
router.put('/:id', authorize('ADMIN', 'PATIENT'), updatePatient);
router.delete('/:id', authorize('ADMIN'), deletePatient);
router.get('/:id/medical-history', authorize('ADMIN', 'DOCTOR', 'PATIENT'), getPatientMedicalHistory);

export default router;

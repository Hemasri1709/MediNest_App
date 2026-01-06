import express from 'express';
import {
  getAllMedicalRecords,
  getMedicalRecord,
  getPatientMedicalRecords,
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
} from '../controllers/medicalRecordController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

router.use(authenticate); // All routes require authentication

router.get('/', authorize('ADMIN', 'DOCTOR'), getAllMedicalRecords);
router.get('/:id', authorize('ADMIN', 'DOCTOR', 'PATIENT'), getMedicalRecord);
router.get('/patient/:patientId', authorize('ADMIN', 'DOCTOR', 'PATIENT'), getPatientMedicalRecords);
router.post('/', authorize('ADMIN', 'DOCTOR'), createMedicalRecord);
router.put('/:id', authorize('ADMIN', 'DOCTOR'), updateMedicalRecord);
router.delete('/:id', authorize('ADMIN'), deleteMedicalRecord);

export default router;

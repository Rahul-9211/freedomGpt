// routes/recaptchaRoutes.js
import express from 'express';
import { handleAssessmentRequest } from '../controller/handleAssessmentRequest.js';

const router = express.Router();

router.post('/assess', handleAssessmentRequest);

export default router;
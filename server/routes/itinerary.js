import express from 'express';
import { generate, getShared, regenDay } from '../controllers/itineraryController.js';

const router = express.Router();

router.post('/generate', generate);
router.get('/share/:shareId', getShared);
router.post('/regenerate-day', regenDay);

export default router;

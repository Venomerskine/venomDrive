import express from 'express';
import venomController from '../controllers/venomDriveController.js';

const router = express.Router();

router.get("/", venomController.getMemberAuth)

export default router;
import {Router} from 'express';
import { getMasterProducts } from '../controllers/masterProduct_controller.js';

const router = Router();

router.get("/", getMasterProducts);

export default router;
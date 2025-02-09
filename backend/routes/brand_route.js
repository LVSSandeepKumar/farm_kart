import {Router} from 'express';
import { createBrand, getAllBrands, getBrandById, updateBrand } from '../controllers/brand_controller.js';

const router = Router();

router.post("/create", createBrand);
router.get("/", getAllBrands);
router.get("/:id", getBrandById);
router.put("/update/:id", updateBrand);

export default router;
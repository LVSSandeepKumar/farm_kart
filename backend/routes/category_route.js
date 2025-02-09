import {Router} from 'express';
import { createCategory, getAllCategories, getCategoryById, updateCategory } from '../controllers/category_controller.js';


const router = Router();

router.post("/create", createCategory);
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.put("/update/:id", updateCategory);

export default router;
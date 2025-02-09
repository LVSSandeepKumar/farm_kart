import prisma from "../prisma/index.js";
import logger from "../utils/logger.js";

export const createCategory = async (req,res) => {
    try {
        const { name } = req.body;
        if(!name) {
            logger.error("Category name is required");
            return res.status(400).json({ error: "Category name is required" });
        }

        const existingCategory = await prisma.category.findUnique({
            where: {
                name
            }
        });
        if(existingCategory) {
            logger.error(`Category with name ${name} already exists`);
            return res.status(400).json({ error: `Category with name ${name} already exists` });
        };

        const category = await prisma.category.create({
            data: {
                name
            }
        });
        res.status(201).json(category);
    } catch (error) {
        logger.error("Error in createCategory controller", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getAllCategories = async (req,res) => {
    try {
        const categories = await prisma.category.findMany();
        if(!categories || categories.length === 0) {
            logger.error("No categories found");
            return res.status(404).json({ error: "No categories found" });
        }
        res.status(200).json(categories);
    } catch(error) {
        logger.error("Error in getAllCategories controller", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getCategoryById = async (req,res) => {
    try {
        const { id } = req.params;
        if(!id) {
            logger.error("Category ID is required");
            return res.status(400).json({ error: "Category ID is required" });
        }

        const category = await prisma.category.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        if(!category) {
            logger.error(`Category with ID ${id} not found`);
            return res.status(404).json({ error: `Category with ID ${id} not found` });
        }

        res.status(200).json(category);
    } catch (error) {
        logger.error("Error in getCategoryById controller", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updateCategory = async (req,res) => {
    try {
        const { id } = req.params;
        if(!id) {
            logger.error("Category ID is required");
            return res.status(400).json({ error: "Category ID is required" });
        }

        const category = await prisma.category.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        if(!category) {
            logger.error(`Category with ID ${id} not found`);
            return res.status(404).json({ error: `Category with ID ${id} not found` });
        }

        const { name } = req.body;
        if(!name) {
            logger.error("Category name is required");
            return res.status(400).json({ error: "Category name is required" });
        }

        if(name === category.name) {
            logger.error("No changes detected");
            return res.status(400).json({ error: "No changes detected" });
        }

        const existingCategory = await prisma.category.findUnique({
            where: {
                name
            }
        });
        if(existingCategory) {
            logger.error(`Category with name ${name} already exists`);
            return res.status(400).json({ error: `Category with name ${name} already exists` });
        }

        const updatedCategory = await prisma.category.update({
            where: {
                id: parseInt(id)
            },
            data: {
                name
            }
        });

        res.status(200).json(updatedCategory);
    } catch (error) {
        logger.error("Error in updateCategory controller", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

import prisma from "../prisma/index.js";
import logger from "../utils/logger.js";

export const createBrand = async (req,res) => {
    try {
        const { name } = req.body;
        if(!name) {
            logger.error("Brand name is required");
            return res.status(400).json({ error: "Brand name is required" });
        }

        const existingBrand = await prisma.brand.findUnique({
            where: {
                name
            }
        });
        if(existingBrand) {
            logger.error(`Brand with name ${name} already exists`);
            return res.status(400).json({ error: `Brand with name ${name} already exists` });
        };

        const brand = await prisma.brand.create({
            data: {
                name
            }
        });
        res.status(201).json(brand);
    } catch (error) {
        logger.error("Error in createBrand controller", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getAllBrands = async (req,res) => {
    try {
        const brands = await prisma.brand.findMany();
        if(!brands || brands.length === 0) {
            logger.error("No brands found");
            return res.status(404).json({ error: "No brands found" });
        }
        res.status(200).json(brands);
    } catch(error) {
        logger.error("Error in getAllBrands controller", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getBrandById = async (req,res) => {
    try {
        const { id } = req.params;
        if(!id) {
            logger.error("Brand ID is required");
            return res.status(400).json({ error: "Brand ID is required" });
        }

        const brand = await prisma.brand.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        if(!brand) {
            logger.error(`Brand with ID ${id} not found`);
            return res.status(404).json({ error: `Brand with ID ${id} not found` });
        }

        res.status(200).json(brand);
    } catch (error) {
        logger.error("Error in getBrandById controller", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updateBrand = async (req,res) => {
    try {
        const { id } = req.params;
        if(!id) {
            logger.error("Brand ID is required");
            return res.status(400).json({ error: "Brand ID is required" });
        }

        const brand = await prisma.brand.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        if(!brand) {
            logger.error(`Brand with ID ${id} not found`);
            return res.status(404).json({ error: `Brand with ID ${id} not found` });
        }

        const { name } = req.body;
        if(!name) {
            logger.error("Brand name is required");
            return res.status(400).json({ error: "Brand name is required" });
        }

        if(name === brand.name) {
            logger.error("No changes detected");
            return res.status(400).json({ error: "No changes detected" });
        }

        const existingBrand = await prisma.brand.findUnique({
            where: {
                name
            }
        });
        if(existingBrand) {
            logger.error(`Brand with name ${name} already exists`);
            return res.status(400).json({ error: `Brand with name ${name} already exists` });
        }

        const updatedBrand = await prisma.brand.update({
            where: {
                id: parseInt(id)
            },
            data: {
                name
            }
        });

        res.status(200).json(updatedBrand);
    } catch (error) {
        logger.error("Error in updateBrand controller", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

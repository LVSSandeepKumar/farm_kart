import prisma from "../prisma/index.js";
import logger from "../utils/logger.js";

export const getMasterProducts = async (req, res) => {
  try {
    const MasterProducts = await prisma.masterProduct.findMany();
    if (!MasterProducts || MasterProducts.length === 0) {
      logger.error("No master products found");
      return res.status(404).json({ error: "No master products found" });
    }
    res.status(200).json(MasterProducts);
  } catch (error) {
    logger.error("Error in getMasterProducts controller", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createMasterProduct = async (req, res) => {
  try {
    const {} = req.body;
  } catch (error) {
    logger.error("Error in createMasterProduct controller", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
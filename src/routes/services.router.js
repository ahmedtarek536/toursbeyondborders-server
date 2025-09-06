const express = require("express");
const servicesService = require("../services/services.service");

const router = express.Router();

// GET /services - Get all services
router.get("/", async (req, res) => {
  try {
    const services = await servicesService.getAllServices();
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /services/:id - Get service by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const service = await servicesService.getServiceById(id);
    res.json(service);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// POST /services - Create new service
router.post("/", async (req, res) => {
  try {
    const { title, description, image } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ error: "Title and description are required" });
    }

    const serviceData = {
      title,
      description,
      image: image || null,
    };

    const newService = await servicesService.createService(serviceData);
    res.status(201).json(newService);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /services/:id - Update service
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (image !== undefined) updateData.image = image;

    const updatedService = await servicesService.updateService(id, updateData);
    res.json(updatedService);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /services/:id - Delete service
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await servicesService.deleteService(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

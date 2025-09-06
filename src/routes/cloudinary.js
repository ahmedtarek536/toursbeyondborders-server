const express = require('express');
const { v2: cloudinary } = require('cloudinary');
const router = express.Router();

// Configure Cloudinary with hardcoded values
cloudinary.config({
  cloud_name: 'dggdqddd7',
  api_key: '291559435659763',
  api_secret: '6ApZWyrIJN8ljbhWcdOwCxujN_Y',
});

// Delete image from Cloudinary
router.delete('/delete', async (req, res) => {
  try {
    const { public_id } = req.body;
    
    if (!public_id) {
      return res.status(400).json({ error: 'Public ID is required' });
    }

    const result = await cloudinary.uploader.destroy(public_id);
    
    if (result.result === 'ok') {
      res.json({ success: true, message: 'Image deleted successfully' });
    } else {
      res.status(400).json({ error: 'Failed to delete image', result });
    }
  } catch (error) {
    console.error('Cloudinary deletion error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Upload image to Cloudinary using multer for file handling
const multer = require('multer');
const upload = multer({ dest: 'uploads/temp/' });

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'travel_company',
      resource_type: 'auto',
    });

    // Clean up temporary file
    const fs = require('fs');
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      public_id: result.public_id,
      secure_url: result.secure_url,
      original_filename: req.file.originalname,
      bytes: result.bytes,
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ error: 'Upload failed: ' + error.message });
  }
});

module.exports = router;

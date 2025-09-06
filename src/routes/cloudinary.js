const express = require('express');
const { v2: cloudinary } = require('cloudinary');
const router = express.Router();

// Configure Cloudinary with environment variables (fallback to hardcoded for now)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dggdqddd7',
  api_key: process.env.CLOUDINARY_API_KEY || '291559435659763',
  api_secret: process.env.CLOUDINARY_API_SECRET || '6ApZWyrIJN8ljbhWcdOwCxujN_Y',
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

// Upload image to Cloudinary using memory storage (Vercel-compatible)
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Upload from buffer instead of file path
    const result = await cloudinary.uploader.upload_stream(
      {
        folder: 'travel_company',
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ error: 'Upload failed: ' + error.message });
        }

        res.json({
          success: true,
          public_id: result.public_id,
          secure_url: result.secure_url,
          original_filename: req.file.originalname,
          bytes: result.bytes,
        });
      }
    );

    // End the stream with the file buffer
    result.end(req.file.buffer);
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ error: 'Upload failed: ' + error.message });
  }
});

module.exports = router;

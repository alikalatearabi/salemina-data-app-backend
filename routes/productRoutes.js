// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const { getProductByBarcode, updateProductByBarcode, createProduct, uploadImage, uploadMainImage, uploadExtraImage, getDistinctStatusCounts } = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/:barcode', getProductByBarcode);
router.put('/:barcode', updateProductByBarcode);
router.post('/', createProduct);
router.get('/status/:username', getDistinctStatusCounts);

router.post('/image', upload.single('image'), uploadImage)
router.post('/image/main', upload.single('image'), uploadMainImage)
router.post('/image/extra', upload.single('image'), uploadExtraImage)


module.exports = router;

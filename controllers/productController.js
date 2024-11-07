// controllers/productController.js
const Product = require('../models/product');
const Minio = require('minio');

// MinIO configuration
const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_END_POINT,
    port: parseInt(process.env.MINIO_PORT),
    useSSL: false,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
});

// Get product by barcode
exports.getProductByBarcode = async (req, res) => {
    try {
        let barcode = req.params.barcode;
        const product = await Product.findOne({ barcode });

        if (!product) {
            return res.status(200).send();
        }

        if (product['Main_data_status'] === '4' || product['Main_data_status'] === '1') {
            return res.json(product); 
        } else {
            return res.status(400).json({ message: 'این محصول قابل نمایش نمی باشد' });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update product by barcode
exports.updateProductByBarcode = async (req, res) => {
    try {
        const barcode = req.params.barcode;
        const updatedData = req.body;

        if (req.body.picture_new && req.body.picture_new !== "" && req.body.picture_new.substring(0, 4) !== 'http') {
            const url = `http://${process.env.MINIO_END_POINT}:${process.env.MINIO_PORT}/images/${req.body.picture_new}`;
            updatedData.picture_new = url;
        }

        if (req.body.picture_main_info && req.body.picture_main_info !== "" && req.body.picture_main_info.substring(0, 4) !== 'http') {
            const url = `http://${process.env.MINIO_END_POINT}:${process.env.MINIO_PORT}/images/mainpic/${req.body.picture_main_info}`;
            updatedData.picture_main_info = url;
        }

        if (req.body.picture_extra_info && req.body.picture_extra_info !== "" && req.body.picture_extra_info.substring(0, 4) !== 'http') {
            const url = `http://${process.env.MINIO_END_POINT}:${process.env.MINIO_PORT}/images/extrapic/${req.body.picture_extra_info}`;
            updatedData.picture_extra_info = url;
        }

        const product = await Product.findOneAndUpdate({ barcode }, updatedData, { new: true, runValidators: true });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create new product
exports.createProduct = async (req, res) => {
    try {
        const { barcode } = req.body;
        const existingProduct = await Product.findOne({ barcode });

        if (existingProduct) {
            return res.status(400).json({ message: 'Product already exists' });
        }

        if (req.body.picture_new && req.body.picture_new !== "") {
            const url = `http://${process.env.MINIO_END_POINT}:${process.env.MINIO_PORT}/images/${req.body.picture_new}`;
            req.body.picture_new = url;
        } else {
            req.body.picture_new = null;
        }

        if (req.body.picture_main_info && req.body.picture_main_info !== "") {
            const url = `http://${process.env.MINIO_END_POINT}:${process.env.MINIO_PORT}/mainpic/${req.body.picture_main_info}`;
            req.body.picture_main_info = url;
        } else {
            req.body.picture_main_info = null;
        }

        if (req.body.picture_extra_info && req.body.picture_extra_info !== "") {
            const url = `http://${process.env.MINIO_END_POINT}:${process.env.MINIO_PORT}/extrapic/${req.body.picture_extra_info}`;
            req.body.picture_extra_info = url;
        } else {
            req.body.picture_extra_info = null;
        }

        const newProduct = new Product(req.body);
        await newProduct.save();

        res.status(201).json(newProduct);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.uploadImage = async (req, res) => {
    const { originalname, buffer } = req.file;
    const bucketName = process.env.MINIO_BUCKET;
    try {
        await minioClient.putObject(bucketName, originalname, buffer, buffer.length);
        res.status(200).json({ message: 'Image uploaded successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to upload image' });
    }
}

exports.uploadMainImage = async (req, res) => {
    const { originalname, buffer } = req.file;
    const bucketName = process.env.MINIO_MAINPIC_BUCKET;
    try {
        await minioClient.putObject(bucketName, originalname, buffer, buffer.length);
        res.status(200).json({ message: 'Image uploaded successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to upload image' });
    }
}

exports.uploadExtraImage = async (req, res) => {
    const { originalname, buffer } = req.file;
    const bucketName = process.env.MINIO_EXTRAPIC_BUCKET;
    try {
        await minioClient.putObject(bucketName, originalname, buffer, buffer.length);
        res.status(200).json({ message: 'Image uploaded successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to upload image' });
    }
}

exports.getDistinctStatusCounts = async (req, res) => {
    try {
        const { username } = req.params;
        const result = await Product.aggregate([
            {
                $match: { importer: username }
            },
            {
                $facet: {
                    Main_data_status: [
                        {
                            $group: {
                                _id: "$Main_data_status",
                                count: { $sum: 1 }
                            }
                        }
                    ],
                    Extra_data_status: [
                        {
                            $group: {
                                _id: "$Extra_data_status",
                                count: { $sum: 1 }
                            }
                        }
                    ]
                }
            }
        ]);

        // Format the result to match your desired output
        const formattedResult = {
            Main_data_status: result[0].Main_data_status.reduce((acc, cur) => {
                acc[cur._id] = cur.count;
                return acc;
            }, {}),
            Extra_data_status: result[0].Extra_data_status.reduce((acc, cur) => {
                if (cur._id) {
                    acc[cur._id] = cur.count;
                }
                return acc;
            }, {})
        };

        res.json(formattedResult);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


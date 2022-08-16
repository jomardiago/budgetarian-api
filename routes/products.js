const express = require('express');
const Product = require('../models/product');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.log('unable to fetch all products...');
    res.status(500).send(error.message);
  }
});

router.post('/', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(200).json({ success: true, message: 'product successfully created' });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.put('/:id', async (req, res) => {
  try {
    delete req.body._id;
    await Product.findByIdAndUpdate(req.params.id, {
      ...req.body,
    });
    res.status(200).json({ success: true, message: 'product successfully updated' });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;

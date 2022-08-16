const express = require('express');
const GroceryItem = require('../models/groceryItem');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const groceryItems = await GroceryItem.find();
    res.status(200).json(groceryItems);
  } catch (error) {
    console.log('unable to fetch all groceryItems...');
    res.status(500).send(error.message);
  }
});

router.post('/', async (req, res) => {
  try {
    const newGroceryItem = new GroceryItem(req.body);
    await newGroceryItem.save();
    res.status(200).json({ success: true, message: 'grocery item successfully created' });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.put('/:id', async (req, res) => {
  try {
    delete req.body._id;
    await GroceryItem.findByIdAndUpdate(req.params.id, {
      ...req.body,
    });
    res.status(200).json({ success: true, message: 'grocery item successfully updated' });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;

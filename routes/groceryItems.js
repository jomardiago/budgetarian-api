const express = require('express');
const GroceryItem = require('../models/groceryItem');
const router = express.Router();
const { extractToken, verify } = require('./utils/auth-utils');

router.get('/', async (req, res) => {
  try {
    const token = extractToken(req.headers.authorization);
    const userData = await verify(token);
    const groceryItems = await GroceryItem.find({ userId: userData._id });
    res.status(200).json(groceryItems);
  } catch (error) {
    console.log('unable to fetch all groceryItems...');
    res.status(500).send(error.message);
  }
});

router.post('/', async (req, res) => {
  try {
    const token = extractToken(req.headers.authorization);
    const userData = await verify(token);
    const newGroceryItem = new GroceryItem({
      ...req.body,
      userId: userData._id,
    });
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

router.delete('/:id', async (req, res) => {
  try {
    await GroceryItem.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'grocery item successfully deleted' });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;

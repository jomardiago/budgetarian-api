const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

const salt = 10;

router.post('/', async (req, res) => {
  try {
    const { email, username, password } = req.body;

    const user = await User.find({ $or: [{ email }, { username }] });

    if (user?.length > 0) {
      res.status(409).json({ success: false, message: 'user with email or username already exists...' });
    } else {
      const generatedSalt = await bcrypt.genSalt(salt);
      const hashedPassword = await bcrypt.hash(password, generatedSalt);
      const newUser = new User({
        email,
        username,
        password: hashedPassword,
      });
      const userData = await newUser.save();
      const token = jwt.sign({ _id: userData._id, email: userData.email, username: userData.email }, process.env.SECRET);
      res.status(200).json({ success: true, token });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;

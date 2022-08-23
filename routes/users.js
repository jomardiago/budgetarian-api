const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

const salt = 10;

router.post('/register', async (req, res) => {
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
      const userResponse = { _id: userData._id, email: userData.email, username: userData.username };
      const token = jwt.sign(userResponse, process.env.SECRET);
      res.status(200).json({ success: true, token, user: userResponse });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password: reqPassword } = req.body;

    const user = await User.findOne({ username });
    const { password } = user;
    const passwordMatch = await bcrypt.compare(reqPassword, password);
    
    if (!passwordMatch) {
      res.status(404).json({ success: false, message: 'user does not exists...' });
    } else {
      const userResponse = { _id: user._id, email: user.email, username: user.username };
      const token = jwt.sign(userResponse, process.env.SECRET);
      res.status(200).json({ success: true, token, user: userResponse });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;

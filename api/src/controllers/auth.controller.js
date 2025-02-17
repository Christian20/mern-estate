const User = require('../models/user.model');
const bcryptjs = require('bcryptjs');
const errorHandler = require('../utils/error');
const jwt = require('jsonwebtoken');

const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json({ message: 'User created successfully!' });
  } catch (error) {
    next(error);
  }
};

const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(401, 'Invalid email or password!'));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, 'Invalid email or password!'));
    }
    const token = jwt.sign( 
      { id: validUser._id }, 
      process.env.JWT_SECRET
    );
    const { password: userPassword, ...userWithoutPassword } = validUser._doc;
    res.cookie(
      'access_token', 
      token, 
      { 
        httpOnly: true, 
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) 
      }
    )
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
};

const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: userPassword, ...userWithoutPassword } = user._doc;
      res.cookie('access_token', token, { httpOnly: true });
      res.status(200).json(userWithoutPassword);
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({ 
        username: req.body.name.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-4), 
        email: req.body.email, 
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: userPassword, ...userWithoutPassword } = newUser._doc;
      res.cookie('access_token', token, { httpOnly: true });
      res.status(200).json(userWithoutPassword);
    }
  } catch (error) {
    next(error);
  }
};

const signout = (req, res) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json({ message: 'Sign out successful!' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  signin,
  google,
  signout,
};
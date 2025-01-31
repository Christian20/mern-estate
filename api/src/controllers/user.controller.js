const bcrypt = require('bcryptjs');
const User = require('../models/user.mongo');
const errorHandler = require('../utils/error');

const test = (req, res) => {
  res.json({ message: 'Api route is working!' });
};

const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    console.log('req.user', req.user);
    console.log('req.params.id', req.params.id);
    return next(errorHandler(401, 'You can only update your own account!'));
  }

  try {
    if(req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id, 
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        }
      },
      { 
        new: true
      }
    );

    const { password, ...userWithoutPassword } = updatedUser._doc;

    res.status(200).json(userWithoutPassword);

  } catch (error) {
    next(error);
  }
};

module.exports = {
  test,
  updateUser,
}
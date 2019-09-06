const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator'); //importing validator library
const User = require('../../models/Users');
const gravatar = require('gravatar'); //importing Avatar pic from email
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

//@route Get api/users
router.post(
  '/',
  [
    check('name', 'Name is required!')
      .not()
      .isEmpty(),
    check(
      'password',
      'Password length should be more than 6 characters'
    ).isLength({ min: 6 }),
    check('email', 'Please enter valid email address').isEmail()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //take our all the value from frontend body
    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      //See if user exists
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists!' }] });
      }

      //Get users gravatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });

      //Create new instance of user
      user = new User({
        name,
        email,
        avatar,
        password
      });

      //Encrypt Password
      //first take salt with 10 rounds to hash the password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      //save the user
      await user.save();

      //Return Jsonwebtoken
      const payload = { user: { id: user.id } };
      jwt.sign(
        payload,
        config.get('jwtToken'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      res.status(400).send(`Error : ${error.message}`);
    }
  }
);

module.exports = router;

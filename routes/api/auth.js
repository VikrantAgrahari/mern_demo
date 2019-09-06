const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/Users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('config');
const { check, validationResult } = require('express-validator'); //importing validator library
//route get api/Auth
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.log(`Error : ${error.message}`);
    res.status(500).send('Server Error');
  }
});

//post request to api/auth
//authenticate use rand get token
//access public

router.post(
  '/',
  [
    check('password', 'Password is required').exists(),
    check('email', 'Please enter valid email address').isEmail()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //take our all the value from frontend body
    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      //See if user exists
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      //using bcrypt to compare the password. it uses wait
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

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

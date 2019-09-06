const express = require('express');
const router = express.Router();

//route get api/profile
router.get('/', (req, res) => {
  res.send('Profile Route');
});

module.exports = router;

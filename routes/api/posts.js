const express = require('express');
const router = express.Router();

//route get api/Posts
router.get('/', (req, res) => {
  res.send('Posts Route');
});

module.exports = router;

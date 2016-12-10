var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Setup this route as admin, so if Austin is logged in then he can see who has signed up.');
});

module.exports = router;

var express = require('express');
var router = express.Router();
var controller = require('../controllers/main');

/* GET home page. */
router.get('/', function(req, res, next) {
  // controller.homePage(req, res);
  if (req.isAuthenticated()){
    res.redirect('/events');
  }  else {
    res.redirect('/login');
  }

});

// GET /logout
router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

module.exports = router;

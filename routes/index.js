var express = require('express');
var router = express.Router();
var controller = require('../controllers/main');
var importer = require('../controllers/gCalImporter');

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


// GET /seed google calendar data from api ---THIS IS TEMPORARY UNTIL I CAN AUTOMATE---
router.get('/seed', function (req, res, next) {
  if (req.isAuthenticated()){
    //res.send("show my events now!");
    console.log(process.env.HOME);
    console.log("----------------------------------------");
    console.log(process.env.HOMEPATH);
    console.log("----------------------------------------");
    console.log(process.env.USERPROFILE);
    console.log("----------------------------------------");

    importer.importEvents();
    res.redirect('/events');
  } else {
    res.redirect('/login');
  }
})

module.exports = router;

var express = require('express');
var router = express.Router();

// index.html is being rendered when user hits the root route
router.get('/', ensureAuthenticated, function(req, res){
	res.render('index');
});


// Get How To videos from /videos route
router.get('/videos', ensureAuthenticated, function(req, res){
	res.render('videos');
});

// Getting the Rush How To Videos Dashboard from /rushdash route
router.get('/rushdash', ensureAuthenticated, function(req, res){
	res.render('rushdash');
});



function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;
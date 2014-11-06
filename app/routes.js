// app/routes.js
module.exports = function(app, passport) {
	var Owner            = require('../app/models/model');
	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		res.render('index.ejs'); // load the index.ejs file
	});

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));


	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
        Owner.find({ user_email : req.user.local.email }, function(err, doc) { 
            console.log("aow"+doc[0].user_email.length);
            res.render('profile.ejs', {
            user : req.user,
            req : req, res : res,
            project : doc[0] // get the user out of session and pass to template
            });
        });
	});

	app.get('/setting', isLoggedIn, function(req, res) {
		res.render('setting.ejs');
	});
	app.post('/setting', isLoggedIn, function(req, res) {
		res.render('setting.ejs');
		var owner = new Owner({ 
        wechat_link : req.body.wechat_link, 
        ios_link : req.body.ios_link,
        user_email : req.body.user_email
    	});
		owner.save(); 
		res.redirect('/profile');
	});

	app.get('/project/:project', function(req, res) {

	Owner.find({ _id : req.params.project }, function(err, doc) { 
        console.log("aow"+doc);
        res.render('project.ejs', {
        req : req, res : res,
		project : doc[0] // get the user out of session and pass to template
		});
    });
	});
	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}

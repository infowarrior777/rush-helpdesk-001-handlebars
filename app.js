var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/loginapp');
var db = mongoose.connection;

var routes = require('./routes/index');
var users = require('./routes/users');

// Creating an instance of express
var app = express();

// Setting up Handlebars as our View Engine for Express
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

// Setting up BodyParser Middleware to parse the body in the request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


// Setting Static Folder to serve static content to the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Setting up Express Session middleware to store session data
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Setting up Passport MiddleWare
app.use(passport.initialize());
app.use(passport.session());

// Express Validator to validate a request and respond with errors
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// using Connect Flash for error messages
app.use(flash());

// Setting up Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});


// Setting up root route to use the imported routes index.js file
app.use('/', routes);

// Setting up /users route to use the imported users.js file
app.use('/users', users);

// Setting Port to production or 3000 
app.set('port', (process.env.PORT || 3000));

// Listening on port and console logging our message
app.listen(app.get('port'), function(){
	console.log('Server listening on port '+app.get('port'));
});
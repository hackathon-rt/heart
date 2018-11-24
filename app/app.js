var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var fs = require("fs");
var passport = require('passport');
var session = require('express-session');
const port = 8881;
const VKontakteStrategy = require('passport-vkontakte').Strategy;
const AuthLocalStrategy = require('passport-local').Strategy;
const dbConnect = require('./dbConnect');
 
app.set('views', __dirname + '/public');
app.engine('html', require('ejs').renderFile);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(passport.initialize());
app.use(passport.session()); 
app.use(session({secret: 'QdtVr56zP',resave: true,saveUninitialized: true})); 

app.listen(port,'0.0.0.0',function(){
	console.log('Server started');
}); 

 		dbConnect.queryDB(`SELECT * from users LIMIT 100`)
			.then(result => {
				console.log(result.rows);
			})   
			
/* 		dbConnect.queryDB(`DELETE from users where username='14114796'`)
			.then(result => {
				console.log(result.rows);
			})  */
 
/*   		dbConnect.queryDB(`INSERT INTO users (username,password) VALUES ('admin','admin')`)
			.then(result => {
				console.log(result);
			})  */
 
passport.use('local', new AuthLocalStrategy(
    function (username, password, done) {	
		dbConnect.queryDB(`SELECT * from users where username='`+username+`' and password='`+password+`' LIMIT 1`)
			.then(result => {
				if(result.rows.length){
					if (username == result.rows[0].username && password == result.rows[0].password) {
						return done(null, {
							username: result.rows[0].username
						});
					}					
				}else{
					return done(null, false, { 
						message: 'Неверный логин или пароль' 
					});					
				};
			})
    }
)); 
 
passport.use(new VKontakteStrategy({
    clientID:     '6760449', 
    clientSecret: 'JfGcUD3o1W8ckNqoaWT1',
    callbackURL:  "http://mad.su/auth/vkontakte/callback"
  },
  function(accessToken, refreshToken, params, profile, done) {

	dbConnect.queryDB(`SELECT * from users where username='`+profile.id+`' LIMIT 1`)
		.then(result => {
			if(result.rows.length){
				return done(null, {
					username: profile.displayName,
					photoUrl: profile.photos[0].value,
					profileUrl: profile.profileUrl
				});						
			}else{
				dbConnect.queryDB(`INSERT INTO users (username,is_vk) VALUES ('`+profile.id+`',true)`)
					.then(result => {
						return done(null, {
							username: profile.displayName,
							photoUrl: profile.photos[0].value,
							profileUrl: profile.profileUrl
						});	
					}) 				
			};
		})  

/*     console.log(params); 
    console.log('__________'); 
    console.log(profile); 
	console.log('__________'); 
    console.log(done);  */


  }
));

app.get('/',function(req,res){
	SesObj = req.session;
    res.render('views/index.html');
});

app.get('/auth', function (req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/');
        return;
    }
    res.render('views/login.html');
});

app.get('/sign-out', function (req, res) {
    req.logout();
    res.redirect('/');
});

app.post('/auth', 
  passport.authenticate('local', { failureRedirect: '/fail' }),
  function(req, res) {
	SesObj = req.session;
	SesObj.login=req.user.username;	  
    res.end('success');
});

app.post('/register',function(req,res){
	if(!req.session.login){
		
	}else{
		ans={ans:'error: you allready logged in'};
		res.end(JSON.stringify(ans));
	};
});

passport.authenticate('local', { failureRedirect: '/login' }),
	app.post('/auth', 
	function(req, res) {
		
    res.redirect('/');
});

app.get('/success',function(req,res){
	SesObj = req.session;
    res.end('success');	
});

app.get('/fail',function(req,res){
    res.end('fail');    
});


app.get('/auth/vkontakte',
  passport.authenticate('vkontakte'),
  function(req, res){
});
 
app.get('/auth/vkontakte/callback',
  passport.authenticate('vkontakte', {failureRedirect: '/fail'}),
  function(req, res) {
	SesObj = req.session;
	SesObj.login=req.user.username;
    res.end('/success');
  });
  
passport.serializeUser(function (user, done) {
    done(null, JSON.stringify(user));
});
 
passport.deserializeUser(function (data, done) {
    try {
        done(null, JSON.parse(data));
    } catch (e) {
        done(err)
    }
});  
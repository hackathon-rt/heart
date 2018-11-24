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
const uuid = require('uuid'); 
 
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

/*   		dbConnect.queryDB(`select * from users LIMIT 100`)
			.then(result => {
				console.log(result);
			})   */  
			
/* 		dbConnect.queryDB(`DELETE from users where username='14114796'`)
			.then(result => {
				console.log(result.rows);
			})  */
			
/* 		dbConnect.queryDB(`DELETE from users where username='eldorado'`)
			.then(result => {
				console.log(result);
			})  */			
 
/*   		dbConnect.queryDB(`INSERT INTO users (username,password) VALUES ('admin','admin')`)
			.then(result => {
				console.log(result);
			})  */
 


app.get('/',function(req,res){
	SesObj = req.session;
    res.render('views/index.html');
});

app.get('/gettasks',function(req,res){
	if(req.session.login){
		
	}
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

app.get('/register',function(req,res){
	res.render('views/register.html');
});

app.post('/uploadphoto', (req, res) => {
    if (!req.files){
            return res.status(400).send('error: no files');
    }else{
        if(req.files.upload && req.files.upload.mimetype.indexOf('image')>-1){
                let uploadedfile = req.files.upload;
                var filename=uuid.v4();
                uploadedfile.mv(__dirname + '/photos/'+filename+'.jpg' , function(err) {
                        if (err){
                               return res.status(500).send(err);
                        }else{
							
                        };
                })
        }else{
                res.send('ошибка: данный вид файлов не поддерживается');
        }
    };
});

app.get('/getdata',function(req,res){
	if(req.query.act==='getcontacts'){
		dbConnect.queryDB(`select * from contacts`)
			.then(result => {
				res.end(JSON.stringify(result.rows));
		})				
	};
	if(req.query.act==='getusers'){
		dbConnect.queryDB(`select * from users`)
			.then(result => {
				res.end(JSON.stringify(result.rows));
		})				
	};	
	if(req.query.act==='gettasks'){
		dbConnect.queryDB(`select * from tasks`)
			.then(result => {
				res.end(JSON.stringify(result.rows));
		})				
	};		
});

app.get('/setdata',function(req,res){
	if(req.query.act==='deleteuser' && req.query.username){
		dbConnect.queryDB(`DELETE from users where username='`+req.query.username+`'`)
			.then(result => {
				ans={ans:'success'};
				res.end(JSON.stringify(ans));
		})				
	};	
});

app.post('/register',function(req,res){
	if(!req.session.login){
		if(req.body.username && req.body.password ){			
			dbConnect.queryDB(`SELECT * from users where username='`+req.body.username+`' LIMIT 1`)
				.then(result => {
					if(result.rows.length){
						ans={ans:'error: login allready exist'};
						res.end(JSON.stringify(ans));					
					}else{
						dbConnect.queryDB(`INSERT INTO users (username,password) VALUES ('`+req.body.username+`','`+req.body.password+`')`)
							.then(result => {						

								ans={ans:'success: login inserted'};
								res.end(JSON.stringify(ans));
							}) 						
					};
				})  			 
		};			
	}else{
		ans={ans:'error: you allready logged in'};
		res.end(JSON.stringify(ans));
	};
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

app.post('/auth', 
  passport.authenticate('local', { failureRedirect: '/fail' }),
  function(req, res) {
	SesObj = req.session;
	SesObj.login=req.user.username;	  
    res.end('success');
});

passport.authenticate('local', { failureRedirect: '/login' }),
	app.post('/auth', 
	function(req, res) {
		
    res.redirect('/');
});
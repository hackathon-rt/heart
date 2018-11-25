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
const fileUpload = require('express-fileupload');
app.use(fileUpload());


app.listen(port,'0.0.0.0',function(){
	console.log('Server started');
}); 

/*     		dbConnect.queryDB(`
			SELECT 
			*
			FROM 
			tasks
			`)
			.then(result => {
				console.log(result.rows);
			})     */

			
		//SELECT users.username FROM users INNER JOIN contacts ON users.users_id=contacts.contacts_id	
		//UPDATE tasks SET status = 1 WHERE id = '1234';
			
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

app.get('/logout',function(req,res){
	req.session.destroy(function(err) {
	  if(err) {
		console.log(err);
	  } else {
		res.redirect('/');
	  }
	});
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
                uploadedfile.mv(__dirname + '/public/photos/'+filename+'.jpg' , function(err) {
                        if (err){
								console.log(err);
                               return res.status(500).send(err);
                        }else{
							res.end('<a href="photos/'+filename+'.jpg">photo link</a><br><img src="photos/'+filename+'.jpg">')
                        };
                })
        }else{
                res.send('ошибка: данный вид файлов не поддерживается');
        }
    };
});

app.get('/getdata',function(req,res){
	if(req.query.act==='getlogin'){
		var ans;
		if(req.session.login){
			ans={ans:true,username:req.session.login}
		}else{
			ans={ans:false}
		};
		res.end(JSON.stringify(ans));
	};		
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
	if(req.query.act==='getfullusers'){
		dbConnect.queryDB(`			
			SELECT 
			us.*, pa.*
			FROM 
			users us 
			JOIN partners pa
			ON us.users_id=pa.users_id LIMIT 1000
			`)
			.then(result => {
				res.end(JSON.stringify(result.rows));
		})				
	};	
	if(req.query.act==='getpartners'){
		dbConnect.queryDB(`select * from partners`)
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

app.post('/profie',function(req,res){
	console.log(req.body);
		dbConnect.queryDB(`UPDATE contact SET email = '`+req.body.email+`' WHERE username = '`+req.session.login+`''`)
			.then(result => {
				ans={ans:'success'};
				res.end(JSON.stringify(ans));
		})						
});

app.get('/profie',function(req,res){
		dbConnect.queryDB(`SELECT * FROM contact SET email = '`+req.body.email+`' WHERE username = '`+req.session.login+`''`)
			.then(result => {
				ans={ans:'success'};
				res.end(JSON.stringify(ans));
		})						
});

app.post('/setdata',function(req,res){
	if(req.query.act==='deleteuser' && req.query.username){
		dbConnect.queryDB(`DELETE from users where username='`+req.query.username+`'`)
			.then(result => {
				ans={ans:'success'};
				res.end(JSON.stringify(ans));
		})				
	};	
	if(req.query.act==='deletecontact' && req.query.contacts_id){
		dbConnect.queryDB(`DELETE from contacts where contacts_id='`+req.query.contacts_id+`'`)
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
						ans={ans:false};
						res.end(JSON.stringify(ans));					
					}else{
						dbConnect.queryDB(`INSERT INTO users (username,password) VALUES ('`+req.body.username+`','`+req.body.password+`')`)
							.then(result => {						
								ans={ans:true};
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
    res.redirect('/');
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
	ans={ans:true,username:req.user.username}
    res.end(JSON.stringify(ans));
});

passport.authenticate('local', { failureRedirect: '/login' }),
	app.post('/auth', 
	function(req, res) {
		
    res.redirect('/');
});
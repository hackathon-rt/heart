

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var fs = require("fs");
var passport = require('passport');
const port = 8881;
const VKontakteStrategy = require('passport-vkontakte').Strategy;
 
passport.use(new VKontakteStrategy({
    clientID:     '6760449', 
    clientSecret: 'JfGcUD3o1W8ckNqoaWT1',
    callbackURL:  "http://mad.su/auth/vkontakte/callback"
  },
  function(accessToken, refreshToken, params, profile, done) {
    console.log(params); 
    console.log('__________'); 
    console.log(profile); 
	console.log('__________'); 
    console.log(done); 
        return done(null, {
            username: profile.displayName,
            photoUrl: profile.photos[0].value,
            profileUrl: profile.profileUrl
        });	
  }
));

app.set('views', __dirname + '/public');
app.engine('html', require('ejs').renderFile);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.listen(port,'0.0.0.0',function(){
	console.log('Server started');
});

app.get('/',function(req,res){
    res.render('views/index.html');
});

app.get('/success',function(req,res){
	console.log('success'); 
    res.end('success');
	
});

app.get('/fail',function(req,res){
	console.log('fail');
    res.end('fail');
    
});

app.get('/auth/vkontakte',
  passport.authenticate('vkontakte'),
  function(req, res){
	  console.log('auth');
    // The request will be redirected to vk.com for authentication, so
    // this function will not be called.
});
 
app.get('/auth/vkontakte/callback',
  passport.authenticate('vkontakte', {failureRedirect: '/fail'}),
  function(req, res) {
    // Successful authentication, redirect home.
	console.log('/success');
    res.redirect('/success');
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
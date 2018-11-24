

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
    res.end(params); 
    res.end('__________'); 
    res.end(profile); 
	res.end('__________'); 
    res.end(done); 
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
    res.end('success');
});

app.get('/auth/vkontakte',
  passport.authenticate('vkontakte'),
  function(req, res){
	  res.end('asd');
    // The request will be redirected to vk.com for authentication, so
    // this function will not be called.
});
 
app.get('/auth/vkontakte/callback',
  passport.authenticate('vkontakte', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
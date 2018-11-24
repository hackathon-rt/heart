

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var fs = require("fs");
const port = 8881;

app.set('views', __dirname + '/public');
app.engine('html', require('ejs').renderFile);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.listen(port,'0.0.0.0',function(){
	console.log('Server started');
});

app.get('/',function(req,res){
    res.render('login.html');
});
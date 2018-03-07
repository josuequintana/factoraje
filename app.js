var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var path = require("path");
var favicon = require('serve-favicon');
//var products = require("./server/products.js");
var login = require("./server/login.js");

app.use(favicon(__dirname + '/app/favicon.ico'))
app.use('/vendor', express.static('vendor'));
app.use('/app', express.static('app'));

//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});


try {
  app.use('/login', login);
  //app.use('/proxy/products', products);
} catch (e) {
  console.log(e);
}

app.listen(process.env.PORT || 3001);
console.log('Running at Port 3000');

module.exports = app;

var express = require('express');
var router = express.Router();
var https = require('request');
var constants = require('./constants.js');
var formidable = require('formidable');

router.get('/', function(req, res, next) {
  return res.json({
    msj: 'holi. :)'
  });
});
router.post('/', function(req, res, next) {

  var form = new formidable.IncomingForm();

  form.parse(req, function(err, fields, files) {
    var username = (fields.username) ? fields.username.trim() : false;
    var password = (fields.password) ? fields.password.trim() : false;


    if (err || !username || !password) {
      return res.json({
        status: 500,
        error: 'Validation',
        message: 'Usuario o contraseña invalida'
      });
    }
    var reqOptions = {
      url: 'https://staging.paycodenetwork.com/v1/oauth/token',
      method: 'POST',
      formData: {
        "grant_type": "password",
        "username": username,
        "password": password
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + (new Buffer(constants.CLIENT_ID + ':' + constants.CLIENT_SECRET).toString('base64'))
      }
    };

    try {

      console.log(reqOptions);
      https(reqOptions, function(error, response, body) {

        var initialResponse = response;

        if (error) {
          return res.json({
            error: 'Internal server error',
            message: error.message
          });
        }


        console.log('STATUS: ' + req.statusCode);
        if (typeof response.body === 'string') {
          try {
            response = JSON.parse(response.body);
          } catch (e) {
            console.log('JParse Error');
            response = null;
          }
        }

        if (response !== null) {
          if (Boolean(response.access_token) && Boolean(response.token_type)) {
            response.token = response.token_type + ' ' + response.access_token;
            return res.json(response);
          } else {
            return res.json(response);
          }
        } else {
          return res.json({
            error: 'Invalid server response',
            message: 'No message available'
          })
        }
      });
    } catch (e) {
      console.error(e);
      return res.json({
        error: 'Internal server error',
        message: e.message
      })
    }
  });


});

module.exports = router;

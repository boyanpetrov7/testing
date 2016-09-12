'use strict';

var $ = require('jquery');

var loginService = require('./services/login.js');

var $loginBtn = $('#login-btn');

$loginBtn.on('click', function () {
  var username = loginService.get.username(),
        password = loginService.get.password();

  loginService.login(username, password, function(err, response) {
    if (err) { 
      return loginService.notifyFail(); 
    }
    console.log('::(P/E) login successful response -> ', response);
    loginService.notifySuccess();
  });
});

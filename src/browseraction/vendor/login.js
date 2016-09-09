'use strict';

var $ = require('jquery');

var $loginBtn = $('#login-btn');

function validate(username, password) {
  var result = {
    ok: false,
    errors: []
  };

  !username && result.errors.push('Please enter a username');
  !password && result.errors.push('Please enter a password');

  if (result.errors.length === 0) {
    result.ok = true;
  }

  return result;
}

function submit() {
  var username = $('#login-username').val(),
    password = $('#login-password').val(),
    validation = validate(username, password);

  if (validation.ok) {
    chrome.runtime.sendMessage({
      type: 'login',
      loginDetails: {
        username: username,
        password: password
      }
    }, function(err, response) {
      console.log('::(BG/L) response -> ', err, response);
    });
  } else {
    $(validation.errors).each(function(index, error) {
      console.log(error);
    });
  }
}

$loginBtn.on('click', submit);

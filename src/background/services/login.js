'use strict';

var $ = require('jquery');

function loginBackground(loginDetails, callback) {
  $.post('http://localhost:8000/registry/api/v2/login/', loginDetails, function(data, textStatus, xhr) {
      // success
      callback(null, 'Login successful!');
    })
    .fail(function (response) {
      // fail
      console.log('Login failed!');
      callback(true, response.status);
    });
}

module.exports = {
  login: loginBackground
};

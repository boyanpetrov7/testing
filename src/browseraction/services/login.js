'use strict';

var $ = require('jquery');
  
  function getUsername() {
    return $('#login-username').val();
  }

  function getPassword() {
    return $('#login-password').val();
  }

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

  function login(username, password, callback) {
    var validation = validate(username, password);

    if (validation.ok) {
      chrome.runtime.sendMessage({
        type: 'login',
        loginDetails: {
          username: username,
          password: password
        }
      }, function(response) {
        console.log('::(BG/L) error -> ', response.err);
        console.log('::(BG/L) response -> ', response.msg);

        if (response.err) return callback(response.err);

        callback(null, response.msg);
      });
    } else {
       return callback(validation.errors);
    }
  }

  function notifySuccess() {
    console.log('::(P) Login successful!');
  }

  function notifyFail() {
    console.log('::(P) Login failed!');
  }

module.exports = {
  login: login,
  get: {
    username: getUsername,
    password: getPassword
  },
  notifySuccess: notifySuccess,
  notifyFail: notifyFail
};
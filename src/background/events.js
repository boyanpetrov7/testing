'use strict';

var loginService = require('./services/login.js');
var getClientsService = require('./services/getClients.js');
var getProductsService = require('./services/getProducts.js');

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.type === 'login') {
      console.log('::(BG) login event triggered -> ', request);
      loginService.login(request.loginDetails, function (err, response) {
        if (err) return sendResponse(err, response);

        sendResponse(response);
      });
    }
  });

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.type === 'get-clients' ) {
      getClientsService.clients(function (err, response) {
        if (err) return sendResponse(err, response);

        sendResponse(response);
      });
    }
  });

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.type === 'get-products' ) {
      var clientID = '36';
      getProductsService.products(clientID, function (err, response) {
        if (err) return sendResponse(err, response);

        sendResponse(response);
      });
    }
  });

'use strict';

var loginService = require('./services/login.js');
var getClientsService = require('./services/getClients.js');
var getProductsService = require('./services/getProducts.js');

function Events (store) {
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.type === 'login') {
        console.log('::(BG) login event triggered -> ', request);
        loginService.login(request.loginDetails, function (err, response) {
          if (err) return sendResponse({ err: err, msg: response });

          sendResponse({ err: null, msg: response});
        });

        return true;
      }
    });

  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.type === 'get-clients' ) {
        getClientsService.clients(function (err, response) {
          if (err) return sendResponse(err);
          
          sendResponse(response);
        });

        return true;
      }
    });

  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.type === 'get-products' ) {
        var clientID = store.get('clientID');
        console.log(clientID);
        getProductsService.products(clientID, function (err, response) {
          if (err) return sendResponse(err);

          sendResponse(response);
        });

        return true;
      }
    });
  
}

module.exports = Events;
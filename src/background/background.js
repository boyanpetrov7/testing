'use strict';

var SimpleStore = require('simple-store');
var store = new SimpleStore();

console.log(require('../common/helloworld.js')());

store.add('clientID', '36');

require('./events.js')(store);


chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log('::(BG) request ->', request);
    if (request.data) {
      store.add('data', request.data);
      console.log('::(BG) simple-store data -> ',store.get('data'));
      // store.removeAfter('data', 10000);
      console.log('log');
      sendResponse({storredData: request.data});
    }

    if (request === 'request-data') {
      console.log('log');
      sendResponse(store.get('data'));
    } 

    if (request === 'regex message') {
      console.log('log');
      sendResponse('::(BG) /regex/ was found!');
    }
  });

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {

  if (request.type === 'css-injection') {
    console.log('::(BG) request -> ' + request.type);
    chrome.tabs.query({active: true}, function (tab) {
      chrome.tabs.executeScript(
        tab[tab.length - 1].id, {
        code: 'document.body.style.backgroundColor="inherit"'
      });
      console.log('::(BG) Sending to tabID ->', tab[tab.length - 1].id);
      chrome.tabs.sendMessage(tab[tab.length - 1].id, {action: 'do-something'}, function (response) {
        console.log('::(BG) do-something response -> ', response);
      });
    });   
  }
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.type === 'get-url') {
      console.log('::(BG) get-url selector -> ', request.input);
      chrome.tabs.query({active: true}, function (tab) {
        chrome.tabs.sendMessage(tab[tab.length - 1].id, {action: 'grab-href', selector: request.input}, function (response) {
          console.log('::(BG) selector ' + request.input + ' with href(s): ', response);
        });
      });
    }
});

chrome.tabs.onActivated.addListener(function (tab) {
  var selectedTab = tab;
  console.log('::(BG) Current tab ->', selectedTab);
});

// chrome.storage.onChanged.addListener(function(changes, namespace) {
//   for (key in changes) {
//     var storageChange = changes[key];
//     console.log('Storage key "%s" in namespace "%s" changed. ' +
//     'Old value was "%s", new value is "%s".',
//     key,
//     namespace,
//     storageChange.oldValue,
//     storageChange.newValue);
//   }

//   chrome.storage.sync.get(['client', 'product'], function(details) {
//     var msg = 'Client: ' + details.client + ' \nProduct: ' + details.product;
//     var options = {
//       type: 'basic',
//       title: 'Input changed!',
//       message: msg,
//       iconUrl: 'icon.png'
//     };

//   chrome.notifications.create(options);
//   });
// });

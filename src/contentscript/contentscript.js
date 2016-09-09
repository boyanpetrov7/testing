'use strict';

var $ = require('jquery');

var regex = /anykindofregex/;

if (regex.test(document.body.innerHTML)) {
  chrome.runtime.sendMessage('regex message', function(response) {
    alert(response);
  });
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log('::(CS) Listening...');
  if (request.action === 'do-something') {
     console.log('::(CS) request -> ' + request.action);
     sendResponse('Action found!-> ' + request.action);
  }
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  if (request.action === 'grab-href') {
    var allAnchors = $(request.selector).find('a'),
          allUrls = {};
    allAnchors.each(function(index) {
      allUrls[index] = $(this).attr('href');
    });
    console.log('::(CS) selector -> ' + request.selector + ' hrefs -> ', allUrls);
    sendResponse(allUrls);
  }
});
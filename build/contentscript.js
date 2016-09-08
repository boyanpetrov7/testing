'use strict';

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
  else {
    sendResponse('Action not found!');
  }
});

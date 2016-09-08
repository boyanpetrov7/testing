'use strict';

var $ = require('jquery');

$('#set-button').on('click', function(e) {
  e.preventDefault();
  e.stopPropagation();

  var inputData = {
  'client': $('#client').val(),
  'product': $('#product').val()
  };

  // localStorage.clear();
  // localStorage.setItem('clientProductSelection', JSON.stringify(inputData));

  // chrome.storage.sync.set(inputData, function() {
  //     console.log('::Data saved!');
  // });

  chrome.runtime.sendMessage({data: inputData}, function(response) {
    console.log('::(P) Response from (BG) -> ', response.storredData);
  });
});

$('#get-button').on('click', function(e) {
  e.preventDefault();
  e.stopPropagation();

  chrome.runtime.sendMessage('request-data', function(responseData) {
    console.log('::(P) Response from (BG) -> ', responseData);
    $('#client').val(responseData.client);
    $('#product').val(responseData.product);
  });
  
  // chrome.storage.sync.get(['client', 'product'], function(details) {
  //     console.log('::Data retrieved', details);
  //     $('#client').val(details.client);
  //     $('#product').val(details.product);
  //   });
});
 
chrome.runtime.sendMessage({type: 'css-injection'});
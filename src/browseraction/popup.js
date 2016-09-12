'use strict';

var $ = require('jquery');
require('./events.js');

getData();

$('#set-button').on('click', function(e) {
  e.preventDefault();
  e.stopPropagation();

  var inputData = {
  'client': $('#client').val(),
  'product': $('#product').val()
  }; 
 
  // localStorage.clear();
  // localStorage.setItem('clientProductSelection', JSON.stringify(inputData));

  chrome.storage.sync.set(inputData, function() {
      console.log('::Data saved!');
  }); 

chrome.runtime.sendMessage({data: inputData}, function(response) {
  console.log('::(P) Response from (BG) -> ', response.storredData);
  });
});

$('#get-button').on('click', function(e) {
  e.preventDefault();
  e.stopPropagation();
  
  getData();
  
  chrome.storage.sync.get(['client', 'product'], function(details) {
      console.log('::Data retrieved', details);
      $('#client').val(details.client);
      $('#product').val(details.product);
    });
});
 
$('#get-href').on('click', function(e) {
  e.preventDefault();
  e.stopPropagation();

  chrome.runtime.sendMessage({type: 'get-url', input: $('#css-select').val()});
});

chrome.runtime.sendMessage({type: 'css-injection'});

function getData() {
  chrome.runtime.sendMessage('request-data', function (response) {
    console.log('::(P) Response from (BG) -> ', response);
    $('#client').val(response.client);
    $('#product').val(response.product);
  });
}

chrome.runtime.sendMessage({ type: 'get-clients' }, function (response) {
  console.log('::(P) ev:get-clients, response from (BG) ->', response);
});

chrome.runtime.sendMessage({ type: 'get-products' }, function (response) {
  console.log('::(P) ev:get-products, response from (BG) ->', response);
});

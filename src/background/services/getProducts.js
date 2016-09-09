'use strict';

var $ = require('jquery');

function getProducts(clientID, callback) {
  $.get('http://localhost:8000/clients/get_client_job_list/' + clientID, function (response) {
    var products = [];
    products = JSON.parse(response).map(function (product) {
      return {
        id: product.pk,
        title: product.fields['title']
      };
    });
    console.log('Products retrieved -> ', products);
    callback(null, products);
  })
  .fail(function (response) {
    console.log('Retrieving products failed!');
    callback(true, response.status);
  }
    );
}

module.exports = {
  products: getProducts
};
'use strict';

var $ = require('jquery');

function getClients(callback) {
  $.get('http://localhost:8000/clients/get_client_list/', function (response) {
    var clients = [];
    clients = JSON.parse(response).map(function (client) {
      return {
        id: client.pk,
        title: client.fields['company_name']
      };
    });
    console.log('Clients retrieved ->', clients);
    callback(null, clients);
  })
  .fail(function (response) {
    console.log('Retrieving clients failed!');
    callback(true, response.status);
  }
    );
}

module.exports = {
  clients: getClients
};
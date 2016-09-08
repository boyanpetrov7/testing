(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * A simple store object with get/set methods
 * and optional global/per key data timeout
 */

function parseOptions (defaults, options) {
  var opts = {} // options to use
  var option
  for (option in defaults) {
    if (typeof options[option] === 'undefined') {
      opts[option] = defaults[option]
    } else {
      opts[option] = options[option]
    }
  }
  return opts
}

/**
 * SimpleStore constructor
 * @param {object} options - options to set for this store
 */
function SimpleStore (options) {
  var defaults = {
    dataTimeout: false
  }

  if (options) {
    this.opts = parseOptions(defaults, options)
  } else {
    this.opts = defaults
  }
  this.data = {}
  this.timers = {}

  /**
   * adds data against a specific key in this store
   * @param {string|number} key  - key to store data against
   * @param {any} data    - data to store
   */
  this.add = function (key, data) {
    if (typeof key === 'string' || typeof key === 'number') {
      if (this.opts) {
        if (this.opts.dataTimeout) {
          this.removeAfter(key, this.opts.dataTimeout)
        }
      }
      this.data[key] = data
    } else {
      if (key == undefined) throw new Error('no key was supplied for SimpleStore.add()')
      else throw new Error('the key argument for SimpleStore.add() must be of type string')
    }
  }

  /**
   * removes an element from the store
   * @param  {string|function} key - the key to remove or a function which returns the key to remove
   *                                 the function is passed this stores data
   */
  this.remove = function (key) {
    if (this.get(key) == undefined) {
      throw new Error('SimpletStore.remove() - key: ' + key + ' does not exist in the store')
    } else {
      delete this.data[key]
    }
  }

  /**
   * Removes an element from the store after a set time
   * @param  {string|number} key - key of the object for deletion
   * @param  {number} timeout    - timeout in ms
   */
  this.removeAfter = function (key, timeout) {
    if (typeof key === 'undefined') {
      throw new Error('no key supplied for SimpleStore.removeAfter()')
    }
    if (typeof timeout !== 'number') {
      throw new Error('invalid timeout set for SimpleStore.removeAfter()')
    }
    var _this = this
    this.timers[key] = setTimeout(function () {
      _this.remove(key)
    }, timeout)
  }

  /**
   * returns this stores full data or data for a specified key
   * @return {[type]} [description]
   */
  this.get = function (key) {
    if (key !== 'undefined') {
      if (typeof key === 'function') {
        key = key(this.data)
      }
      if (typeof this.data[key] !== 'undefined') {
        return this.data[key]
      } else {
        throw new Error('SimpleStore.get() - no data exists for SimpleStore.data[' + key + ']')
      }
    } else {
      return this.data
    }
  }
}

module.exports = SimpleStore

},{}],2:[function(require,module,exports){
'use strict';

var SimpleStore = require('simple-store');
var store = new SimpleStore();

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log('::(BG) request ->', request);
    if (request.data) {
      store.add('data', request.data);
      console.log('::(BG) simple-store data -> ',store.get('data'));
      store.removeAfter('data', 10000);
      sendResponse({storredData: request.data});
    }

    if (request === 'request-data') {
      sendResponse(store.get('data'));
    }

    if (request === 'regex message') {
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
        code: 'document.body.style.backgroundColor="red"'
      });
      console.log('::(BG) Sending to tabID ->', tab[tab.length - 1].id);
      chrome.tabs.sendMessage(tab[tab.length - 1].id, {action: 'do-something'}, function (response) {
        console.log(response);
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
},{"simple-store":1}]},{},[2])


//# sourceMappingURL=background.js.map

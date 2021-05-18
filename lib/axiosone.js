"use strict";

var axios = require("axios");

var utils = require("./utils");

function Axiosone(axios) {
  this.axios = axios;
  this.extendGlobalConfig = function (newConfig) {
    Object.assign(this.axios.defaults, newConfig);
  };

  // Binds each api query with a single global axios instance.
  this.bindConfig = function (module) {
    Object.keys(module).forEach(
      function (apiName) {
        this[apiName] = function () {
          var args = Array.from(arguments);
          var createConfigs = module[apiName];

          var configs = createConfigs;
          if (utils.isFunction(createConfigs)) {
            // createConfigs can return a list of configs or just one config object.
            configs = createConfigs.apply(null, args);
          }

          var combinedConfig = {};
          if (utils.isArray(configs)) {
            configs.forEach(function (config) {
              combinedConfig = utils.merge(combinedConfig, config);
            });
          } else {
            // If it is not an array, must be an object config.
            combinedConfig = configs;
          }

          return this.axios.request(combinedConfig);
        };
      }.bind(this)
    );
  };
}

var SingleAxiosone = (function () {
  var instance;

  function createInstance(axios) {
    return new Axiosone(axios);
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance(axios);
        delete instance.constructor;
      }
      return instance;
    },
  };
})();

var instance = SingleAxiosone.getInstance();

module.exports = instance;

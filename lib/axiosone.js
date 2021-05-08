"use strict";

var axios = require("axios");

var utils = require("./utils");

function Axiosone(axios) {
  utils.extend(axios.defaults);
  this.axios = axios;
  this.setGlobalConfig = function (newConfig) {
    utils.extend(this.axios.defaults, newConfig);
  };

  // Binds each api query with a single global axios instance.
  this.bindModule = function (module) {
    Object.keys(module).forEach(
      function (apiName) {
        this[apiName] = function () {
          var args = Array.from(arguments);
          var apiConfig = module[apiName].config;
          var createConfigs = module[apiName].createConfigs;
          // createConfigs can return a list of configs or just one config object.
          var configs = createConfigs ? createConfigs.apply(null, args) : {};

          var combinedConfig = apiConfig;
          if (utils.isArray(configs)) {
            configs.forEach(function (config) {
              combinedConfig = utils.merge(combinedConfig, config);
            });
          } else {
            combinedConfig = utils.merge(combinedConfig, configs);
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

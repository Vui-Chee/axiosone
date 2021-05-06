var axios = require("axios");

console.log("HERE", axios.mergeConfig);

var utils = require("./utils");

var globalConfig = {
  baseURL: "https://pokeapi.co/api/v2/",
};

function Axiosone(axios, globalConfig) {
  utils.extend(axios.defaults, globalConfig);
  this.axios = axios;
  this.setGlobalConfig = function (newConfig) {
    utils.extend(this.axios.defaults, newConfig);
  };

  // Binds each api query with a single global axios instance.
  this.bindModule = function (module) {
    Object.keys(module).forEach(
      function (apiName) {
        this[apiName] = function (urlParams, overrideConfig) {
          var axiosInstance = createDefaultRequest();
        };

        this[apiName] = function (urlParams, overrideConfig) {
          var apiConfig = module[apiName].config;
          var url = module[apiName].url || module[apiName].createUrl(urlParams);
          var combinedConfig = {
            url: url,
          };
          utils.extend(combinedConfig, apiConfig);
          utils.extend(combinedConfig, overrideConfig);
          return this.axios.request(combinedConfig);
        };
      }.bind(this)
    );
  };
}

var SingleAxiosone = (function () {
  var instance;

  function createInstance(axios, globalConfig) {
    return new Axiosone(axios, globalConfig);
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance(axios, globalConfig);
        delete instance.constructor;
      }
      return instance;
    },
  };
})();

var instance = SingleAxiosone.getInstance();

module.exports = instance;

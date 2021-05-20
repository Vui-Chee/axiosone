"use strict";

var axios = require("axios");

var utils = require("./utils");

function Axiosone() {}

// Binds a single axios instance to Axiosone.
Axiosone.prototype.axios = axios;

/**
 * Extends the axios default config with your desired config.
 * Doing so allows you to set global configuration for all axios
 * requests.
 *
 * Beware it only extends - not merges the config object!
 *
 * @params newConfig : a JS object representing an axios request config
 *                    (see https://github.com/axios/axios/blob/69949a6c161d954570a314c0e48b57d3ffd90326/index.d.ts#L50)
 */
Axiosone.prototype.extendGlobalConfig = function (newConfig) {
  Object.assign(this.axios.defaults, newConfig);
};

/**
 * Converts a single Axiosone module into a series of query functions
 * and binds those functions as keys inside the global Axiosone instance.
 *
 * An example Axiosone module with 4 variations of values:
 *
 * ```
 * const axiosoneModule = {
 *   // A simple object
 *   query1: {...},
 *
 *   // A list of objects
 *   query2: [..., {...}],
 *
 *   // A function returning an object
 *   query3: (param1: type1, param2: type2, ...) => ({...})
 *
 *   // A function returning a list of objects
 *   query4: (param1: type1, param2: type2, ...) => [..., {...}]
 * }
 * ```
 *
 * And then simple call `axiosone.bindConfig(axiosoneModule)` to register
 * the module to the global Axiosone instance.
 *
 * @params module : a JS object representing an Axiosone config object
 */
Axiosone.prototype.bindConfig = function (module) {
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

// Creates a single reusuable Axiosone instance.
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

module.exports.default = instance;

/// ----- ACTUAL LIB -----
'use strict';

const axios = require("axios");

function createAxiosoneInstance(axios, config) {
  this.axios = axios;
  this.config = config;
}

// axios reuses same instance to call different queries.
function axiosDecorator(axiosInstance) {
  const instance = createAxiosoneInstance(axios, ???);
  // What if I create an instance of an instance???

  return {
    [requestKey]: function(access, urlVariables, data, ...additionalConfig) {
      const url =
      return axios.request(extend({ url, data }, additionalConfig));
    }
  };
}

// Exports wrapped instance
// module.exports.default = axiosDecorator(axios);

// bind each api module to its own axios instance. -> has its own group level config.
// What about binding all modules with shared config?

// const instance = createAxiosoneInstance(...);
// module.exports.default = instance;
/// -----
const axios = require("axios");
const utils = require("./utils");

function Axiosone(axios, globalConfig) {
  utils.extend(axios.defaults, globalConfig);
  this.axios = axios;
  this.setGlobalConfig = function (newConfig) {
    utils.extend(this.axios.defaults, newConfig);
  };
}

var globalConfig = {};

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

// Binds each api query with a single global axios instance.
function bindApiModule(module, moduleConfig) {
  Object.keys(module).forEach(function(apiName) {
    instance[apiName] = function(access, urlParams) {
      var additionalConfig = arguments.slice(arguments.callee.length);
      var authHeaders = access && {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      };
      var url = module[apiName].url(urlParams);
      var combinedConfig = {
        authHeaders: authHeaders,
        url: url,
      };
      additionalConfig.forEach(function(key, value) {
        Object.defineProperty(combinedConfig, key, { value: value });
      });
      return instance.axios.request(combinedConfig);
    }
  });
}

module.exports = SingleAxiosone.getInstance();




// USAGE
import { bindApiModule } from "axios-one";

bindApiModule({
  someRequest: {
    method: "POST",
    url: () => "user_management/admin/user/login/",
    withCredentials: true,
    data: {
      ...
    }
  },
},
{
  ...localModuleConfig // TODO only applies for this module
});

// THEN
import axiosone from "axiosone";

axiosone.yourQuery(...);







// NOT GOOD -> if you want to apply section level configs
function createAxiosRequest(axiosConfig) {
  return function ({ access, urlVariables, data }) {
    const additionalConfig = arguments.slice(arguments.callee.length);
    const defaultConfig = createDefaultConfig();
    const authHeaders = access && {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    };

    return axios
      .create(
        merge(defaultConfig, axiosConfig, merge(additionalConfig, authHeaders))
      )
      .request({ url: axiosConfig.url(urlVariables), data });
  }
}

// Decorator/Wrapper for axios instance?
// function createAxiosoneInstance(instanceConfig) {
//   var context = new AxiosoneInstance(defaultConfig);
//   var instance = bind(Axios.prototype.request, context);
//   return instance;
// }
//
// var instance = createAxiosoneInstance(???);

// GOAL
module.exports.default = instance;

// USAGE
// axiosone.callQuery();

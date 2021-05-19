"use strict";

function isFunction(val) {
  return toString.call(val) === "[object Function]";
}

function isArray(val) {
  return toString.call(val) === "[object Array]";
}

function isPlainObject(val) {
  return toString.call(val) === "[object Object]";
}

/**
 * Recursively merges any number of objects into
 * a single object.
 *
 * NOTE:
 * Does not merge arrays together, if an array
 * is a value, it replaces with new array value instead.
 *
 * @params (object1, object2, ...)
 *
 * @returns object
 */
function merge() {
  var result = {};
  for (var i = 0; i < arguments.length; i++) {
    var obj = arguments[i];
    if (!isPlainObject(obj)) {
      continue;
    }
    for (var key in obj) {
      var val = obj[key];
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (isPlainObject(result[key]) && isPlainObject(val)) {
          result[key] = merge(result[key], val);
        } else if (isPlainObject(val)) {
          result[key] = merge({}, val);
        } else if (isArray(val)) {
          // Replaces with array value. Does not fuse arrays together.
          result[key] = val.slice();
        } else {
          result[key] = val;
        }
      }
    }
  }
  return result;
}

module.exports = {
  isArray: isArray,
  isFunction: isFunction,
  isPlainObject: isPlainObject,
  merge: merge,
};

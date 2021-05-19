var utils = require("../lib/utils");

var testValues = {
  number: [123, 1.23, NaN],
  string: ["abc"],
  object: [{}, { a: 1 }, { a: { b: 2 } }],
  array: [[], [1, 2, 3]],
  boolean: [true, false],
  function: [function foo() {}],
  undefined: [undefined],
  null: [null],
};

/**
 * @params type : string
 *
 * @returns testValues excluding key-value of the specified type.
 */
function excludeByType(typeToExclude) {
  var result = {};
  Object.keys(testValues).forEach(function (type) {
    if (type !== typeToExclude) {
      result[type] = testValues[type];
    }
  });
  return result;
}

/**
 * Runs the utils type check function checking for every non-type
 * value to return false.
 *
 * Should not raise any error if all expectations passed.
 *
 * @params nonType : a subset of the object, testValues
 * @params utilsFunction : a validate type function from lib/utils.js
 */
function validateType(nonType, utilFunction) {
  Object.keys(nonType).forEach(function (type) {
    for (var i = 0; i < nonType[type].length; i++) {
      expect(utilFunction(nonType[type][i])).toBe(false);
    }
  });
}

describe("isFunction", function () {
  it("isFunction returns true for function", function () {
    expect(utils.isFunction(testValues["function"][0])).toBe(true);
  });

  it("isFunction returns false for non-functions", function () {
    var nonFunctions = excludeByType("function");
    validateType(nonFunctions, utils.isFunction);
  });
});

describe("isArray", function () {
  it("isArray returns true for array", function () {
    testValues["array"].forEach(function (value) {
      expect(utils.isArray(value)).toBe(true);
    });
  });

  it("isFunction returns false for non-arrays", function () {
    var nonArrays = excludeByType("array");
    validateType(nonArrays, utils.isArray);
  });
});

describe("isObject", function () {
  it("isArray returns true for object", function () {
    testValues["object"].forEach(function (value) {
      expect(utils.isPlainObject(value)).toBe(true);
    });
  });

  it("isFunction returns false for non-objects", function () {
    var nonObjects = excludeByType("object");
    validateType(nonObjects, utils.isPlainObject);
  });
});

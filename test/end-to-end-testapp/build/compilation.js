var AurycKit = (function (exports) {
  'use strict';

  function Common() {}


  var common = Common;

  /* globals window, HTMLElement */

  /**!
   * is
   * the definitive JavaScript type testing library
   *
   * @copyright 2013-2014 Enrico Marino / Jordan Harband
   * @license MIT
   */

  var objProto = Object.prototype;
  var owns = objProto.hasOwnProperty;
  var toStr = objProto.toString;
  var symbolValueOf;
  if (typeof Symbol === 'function') {
    symbolValueOf = Symbol.prototype.valueOf;
  }
  var bigIntValueOf;
  if (typeof BigInt === 'function') {
    bigIntValueOf = BigInt.prototype.valueOf;
  }
  var isActualNaN = function (value) {
    return value !== value;
  };
  var NON_HOST_TYPES = {
    'boolean': 1,
    number: 1,
    string: 1,
    undefined: 1
  };

  var base64Regex = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/;
  var hexRegex = /^[A-Fa-f0-9]+$/;

  /**
   * Expose `is`
   */

  var is = {};

  /**
   * Test general.
   */

  /**
   * is.type
   * Test if `value` is a type of `type`.
   *
   * @param {*} value value to test
   * @param {String} type type
   * @return {Boolean} true if `value` is a type of `type`, false otherwise
   * @api public
   */

  is.a = is.type = function (value, type) {
    return typeof value === type;
  };

  /**
   * is.defined
   * Test if `value` is defined.
   *
   * @param {*} value value to test
   * @return {Boolean} true if 'value' is defined, false otherwise
   * @api public
   */

  is.defined = function (value) {
    return typeof value !== 'undefined';
  };

  /**
   * is.empty
   * Test if `value` is empty.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is empty, false otherwise
   * @api public
   */

  is.empty = function (value) {
    var type = toStr.call(value);
    var key;

    if (type === '[object Array]' || type === '[object Arguments]' || type === '[object String]') {
      return value.length === 0;
    }

    if (type === '[object Object]') {
      for (key in value) {
        if (owns.call(value, key)) {
          return false;
        }
      }
      return true;
    }

    return !value;
  };

  /**
   * is.equal
   * Test if `value` is equal to `other`.
   *
   * @param {*} value value to test
   * @param {*} other value to compare with
   * @return {Boolean} true if `value` is equal to `other`, false otherwise
   */

  is.equal = function equal(value, other) {
    if (value === other) {
      return true;
    }

    var type = toStr.call(value);
    var key;

    if (type !== toStr.call(other)) {
      return false;
    }

    if (type === '[object Object]') {
      for (key in value) {
        if (!is.equal(value[key], other[key]) || !(key in other)) {
          return false;
        }
      }
      for (key in other) {
        if (!is.equal(value[key], other[key]) || !(key in value)) {
          return false;
        }
      }
      return true;
    }

    if (type === '[object Array]') {
      key = value.length;
      if (key !== other.length) {
        return false;
      }
      while (key--) {
        if (!is.equal(value[key], other[key])) {
          return false;
        }
      }
      return true;
    }

    if (type === '[object Function]') {
      return value.prototype === other.prototype;
    }

    if (type === '[object Date]') {
      return value.getTime() === other.getTime();
    }

    return false;
  };

  /**
   * is.hosted
   * Test if `value` is hosted by `host`.
   *
   * @param {*} value to test
   * @param {*} host host to test with
   * @return {Boolean} true if `value` is hosted by `host`, false otherwise
   * @api public
   */

  is.hosted = function (value, host) {
    var type = typeof host[value];
    return type === 'object' ? !!host[value] : !NON_HOST_TYPES[type];
  };

  /**
   * is.instance
   * Test if `value` is an instance of `constructor`.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is an instance of `constructor`
   * @api public
   */

  is.instance = is['instanceof'] = function (value, constructor) {
    return value instanceof constructor;
  };

  /**
   * is.nil / is.null
   * Test if `value` is null.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is null, false otherwise
   * @api public
   */

  is.nil = is['null'] = function (value) {
    return value === null;
  };

  /**
   * is.undef / is.undefined
   * Test if `value` is undefined.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is undefined, false otherwise
   * @api public
   */

  is.undef = is.undefined = function (value) {
    return typeof value === 'undefined';
  };

  /**
   * Test arguments.
   */

  /**
   * is.args
   * Test if `value` is an arguments object.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is an arguments object, false otherwise
   * @api public
   */

  is.args = is.arguments = function (value) {
    var isStandardArguments = toStr.call(value) === '[object Arguments]';
    var isOldArguments = !is.array(value) && is.arraylike(value) && is.object(value) && is.fn(value.callee);
    return isStandardArguments || isOldArguments;
  };

  /**
   * Test array.
   */

  /**
   * is.array
   * Test if 'value' is an array.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is an array, false otherwise
   * @api public
   */

  is.array = Array.isArray || function (value) {
    return toStr.call(value) === '[object Array]';
  };

  /**
   * is.arguments.empty
   * Test if `value` is an empty arguments object.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is an empty arguments object, false otherwise
   * @api public
   */
  is.args.empty = function (value) {
    return is.args(value) && value.length === 0;
  };

  /**
   * is.array.empty
   * Test if `value` is an empty array.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is an empty array, false otherwise
   * @api public
   */
  is.array.empty = function (value) {
    return is.array(value) && value.length === 0;
  };

  /**
   * is.arraylike
   * Test if `value` is an arraylike object.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is an arguments object, false otherwise
   * @api public
   */

  is.arraylike = function (value) {
    return !!value && !is.bool(value)
      && owns.call(value, 'length')
      && isFinite(value.length)
      && is.number(value.length)
      && value.length >= 0;
  };

  /**
   * Test boolean.
   */

  /**
   * is.bool
   * Test if `value` is a boolean.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is a boolean, false otherwise
   * @api public
   */

  is.bool = is['boolean'] = function (value) {
    return toStr.call(value) === '[object Boolean]';
  };

  /**
   * is.false
   * Test if `value` is false.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is false, false otherwise
   * @api public
   */

  is['false'] = function (value) {
    return is.bool(value) && Boolean(Number(value)) === false;
  };

  /**
   * is.true
   * Test if `value` is true.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is true, false otherwise
   * @api public
   */

  is['true'] = function (value) {
    return is.bool(value) && Boolean(Number(value)) === true;
  };

  /**
   * Test date.
   */

  /**
   * is.date
   * Test if `value` is a date.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is a date, false otherwise
   * @api public
   */

  is.date = function (value) {
    return toStr.call(value) === '[object Date]';
  };

  /**
   * is.date.valid
   * Test if `value` is a valid date.
   *
   * @param {*} value value to test
   * @returns {Boolean} true if `value` is a valid date, false otherwise
   */
  is.date.valid = function (value) {
    return is.date(value) && !isNaN(Number(value));
  };

  /**
   * Test element.
   */

  /**
   * is.element
   * Test if `value` is an html element.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is an HTML Element, false otherwise
   * @api public
   */

  is.element = function (value) {
    return value !== undefined
      && typeof HTMLElement !== 'undefined'
      && value instanceof HTMLElement
      && value.nodeType === 1;
  };

  /**
   * Test error.
   */

  /**
   * is.error
   * Test if `value` is an error object.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is an error object, false otherwise
   * @api public
   */

  is.error = function (value) {
    return toStr.call(value) === '[object Error]';
  };

  /**
   * Test function.
   */

  /**
   * is.fn / is.function (deprecated)
   * Test if `value` is a function.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is a function, false otherwise
   * @api public
   */

  is.fn = is['function'] = function (value) {
    var isAlert = typeof window !== 'undefined' && value === window.alert;
    if (isAlert) {
      return true;
    }
    var str = toStr.call(value);
    return str === '[object Function]' || str === '[object GeneratorFunction]' || str === '[object AsyncFunction]';
  };

  /**
   * Test number.
   */

  /**
   * is.number
   * Test if `value` is a number.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is a number, false otherwise
   * @api public
   */

  is.number = function (value) {
    return toStr.call(value) === '[object Number]';
  };

  /**
   * is.infinite
   * Test if `value` is positive or negative infinity.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is positive or negative Infinity, false otherwise
   * @api public
   */
  is.infinite = function (value) {
    return value === Infinity || value === -Infinity;
  };

  /**
   * is.decimal
   * Test if `value` is a decimal number.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is a decimal number, false otherwise
   * @api public
   */

  is.decimal = function (value) {
    return is.number(value) && !isActualNaN(value) && !is.infinite(value) && value % 1 !== 0;
  };

  /**
   * is.divisibleBy
   * Test if `value` is divisible by `n`.
   *
   * @param {Number} value value to test
   * @param {Number} n dividend
   * @return {Boolean} true if `value` is divisible by `n`, false otherwise
   * @api public
   */

  is.divisibleBy = function (value, n) {
    var isDividendInfinite = is.infinite(value);
    var isDivisorInfinite = is.infinite(n);
    var isNonZeroNumber = is.number(value) && !isActualNaN(value) && is.number(n) && !isActualNaN(n) && n !== 0;
    return isDividendInfinite || isDivisorInfinite || (isNonZeroNumber && value % n === 0);
  };

  /**
   * is.integer
   * Test if `value` is an integer.
   *
   * @param value to test
   * @return {Boolean} true if `value` is an integer, false otherwise
   * @api public
   */

  is.integer = is['int'] = function (value) {
    return is.number(value) && !isActualNaN(value) && value % 1 === 0;
  };

  /**
   * is.maximum
   * Test if `value` is greater than 'others' values.
   *
   * @param {Number} value value to test
   * @param {Array} others values to compare with
   * @return {Boolean} true if `value` is greater than `others` values
   * @api public
   */

  is.maximum = function (value, others) {
    if (isActualNaN(value)) {
      throw new TypeError('NaN is not a valid value');
    } else if (!is.arraylike(others)) {
      throw new TypeError('second argument must be array-like');
    }
    var len = others.length;

    while (--len >= 0) {
      if (value < others[len]) {
        return false;
      }
    }

    return true;
  };

  /**
   * is.minimum
   * Test if `value` is less than `others` values.
   *
   * @param {Number} value value to test
   * @param {Array} others values to compare with
   * @return {Boolean} true if `value` is less than `others` values
   * @api public
   */

  is.minimum = function (value, others) {
    if (isActualNaN(value)) {
      throw new TypeError('NaN is not a valid value');
    } else if (!is.arraylike(others)) {
      throw new TypeError('second argument must be array-like');
    }
    var len = others.length;

    while (--len >= 0) {
      if (value > others[len]) {
        return false;
      }
    }

    return true;
  };

  /**
   * is.nan
   * Test if `value` is not a number.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is not a number, false otherwise
   * @api public
   */

  is.nan = function (value) {
    return !is.number(value) || value !== value;
  };

  /**
   * is.even
   * Test if `value` is an even number.
   *
   * @param {Number} value value to test
   * @return {Boolean} true if `value` is an even number, false otherwise
   * @api public
   */

  is.even = function (value) {
    return is.infinite(value) || (is.number(value) && value === value && value % 2 === 0);
  };

  /**
   * is.odd
   * Test if `value` is an odd number.
   *
   * @param {Number} value value to test
   * @return {Boolean} true if `value` is an odd number, false otherwise
   * @api public
   */

  is.odd = function (value) {
    return is.infinite(value) || (is.number(value) && value === value && value % 2 !== 0);
  };

  /**
   * is.ge
   * Test if `value` is greater than or equal to `other`.
   *
   * @param {Number} value value to test
   * @param {Number} other value to compare with
   * @return {Boolean}
   * @api public
   */

  is.ge = function (value, other) {
    if (isActualNaN(value) || isActualNaN(other)) {
      throw new TypeError('NaN is not a valid value');
    }
    return !is.infinite(value) && !is.infinite(other) && value >= other;
  };

  /**
   * is.gt
   * Test if `value` is greater than `other`.
   *
   * @param {Number} value value to test
   * @param {Number} other value to compare with
   * @return {Boolean}
   * @api public
   */

  is.gt = function (value, other) {
    if (isActualNaN(value) || isActualNaN(other)) {
      throw new TypeError('NaN is not a valid value');
    }
    return !is.infinite(value) && !is.infinite(other) && value > other;
  };

  /**
   * is.le
   * Test if `value` is less than or equal to `other`.
   *
   * @param {Number} value value to test
   * @param {Number} other value to compare with
   * @return {Boolean} if 'value' is less than or equal to 'other'
   * @api public
   */

  is.le = function (value, other) {
    if (isActualNaN(value) || isActualNaN(other)) {
      throw new TypeError('NaN is not a valid value');
    }
    return !is.infinite(value) && !is.infinite(other) && value <= other;
  };

  /**
   * is.lt
   * Test if `value` is less than `other`.
   *
   * @param {Number} value value to test
   * @param {Number} other value to compare with
   * @return {Boolean} if `value` is less than `other`
   * @api public
   */

  is.lt = function (value, other) {
    if (isActualNaN(value) || isActualNaN(other)) {
      throw new TypeError('NaN is not a valid value');
    }
    return !is.infinite(value) && !is.infinite(other) && value < other;
  };

  /**
   * is.within
   * Test if `value` is within `start` and `finish`.
   *
   * @param {Number} value value to test
   * @param {Number} start lower bound
   * @param {Number} finish upper bound
   * @return {Boolean} true if 'value' is is within 'start' and 'finish'
   * @api public
   */
  is.within = function (value, start, finish) {
    if (isActualNaN(value) || isActualNaN(start) || isActualNaN(finish)) {
      throw new TypeError('NaN is not a valid value');
    } else if (!is.number(value) || !is.number(start) || !is.number(finish)) {
      throw new TypeError('all arguments must be numbers');
    }
    var isAnyInfinite = is.infinite(value) || is.infinite(start) || is.infinite(finish);
    return isAnyInfinite || (value >= start && value <= finish);
  };

  /**
   * Test object.
   */

  /**
   * is.object
   * Test if `value` is an object.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is an object, false otherwise
   * @api public
   */
  is.object = function (value) {
    return toStr.call(value) === '[object Object]';
  };

  /**
   * is.primitive
   * Test if `value` is a primitive.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is a primitive, false otherwise
   * @api public
   */
  is.primitive = function isPrimitive(value) {
    if (!value) {
      return true;
    }
    if (typeof value === 'object' || is.object(value) || is.fn(value) || is.array(value)) {
      return false;
    }
    return true;
  };

  /**
   * is.hash
   * Test if `value` is a hash - a plain object literal.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is a hash, false otherwise
   * @api public
   */

  is.hash = function (value) {
    return is.object(value) && value.constructor === Object && !value.nodeType && !value.setInterval;
  };

  /**
   * Test regexp.
   */

  /**
   * is.regexp
   * Test if `value` is a regular expression.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is a regexp, false otherwise
   * @api public
   */

  is.regexp = function (value) {
    return toStr.call(value) === '[object RegExp]';
  };

  /**
   * Test string.
   */

  /**
   * is.string
   * Test if `value` is a string.
   *
   * @param {*} value value to test
   * @return {Boolean} true if 'value' is a string, false otherwise
   * @api public
   */

  is.string = function (value) {
    return toStr.call(value) === '[object String]';
  };

  /**
   * Test base64 string.
   */

  /**
   * is.base64
   * Test if `value` is a valid base64 encoded string.
   *
   * @param {*} value value to test
   * @return {Boolean} true if 'value' is a base64 encoded string, false otherwise
   * @api public
   */

  is.base64 = function (value) {
    return is.string(value) && (!value.length || base64Regex.test(value));
  };

  /**
   * Test base64 string.
   */

  /**
   * is.hex
   * Test if `value` is a valid hex encoded string.
   *
   * @param {*} value value to test
   * @return {Boolean} true if 'value' is a hex encoded string, false otherwise
   * @api public
   */

  is.hex = function (value) {
    return is.string(value) && (!value.length || hexRegex.test(value));
  };

  /**
   * is.symbol
   * Test if `value` is an ES6 Symbol
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is a Symbol, false otherise
   * @api public
   */

  is.symbol = function (value) {
    return typeof Symbol === 'function' && toStr.call(value) === '[object Symbol]' && typeof symbolValueOf.call(value) === 'symbol';
  };

  /**
   * is.bigint
   * Test if `value` is an ES-proposed BigInt
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is a BigInt, false otherise
   * @api public
   */

  is.bigint = function (value) {
    // eslint-disable-next-line valid-typeof
    return typeof BigInt === 'function' && toStr.call(value) === '[object BigInt]' && typeof bigIntValueOf.call(value) === 'bigint';
  };

  var is_1 = is;

  var has = Object.prototype.hasOwnProperty;

  /**
   * Copy the properties of one or more `objects` onto a destination object. Input objects are iterated over
   * in left-to-right order, so duplicate properties on later objects will overwrite those from
   * erevious ones. Only enumerable and own properties of the input objects are copied onto the
   * resulting object.
   *
   * @name extend
   * @api public
   * @category Object
   * @param {Object} dest The destination object.
   * @param {...Object} sources The source objects.
   * @return {Object} `dest`, extended with the properties of all `sources`.
   * @example
   * var a = { a: 'a' };
   * var b = { b: 'b' };
   * var c = { c: 'c' };
   *
   * extend(a, b, c);
   * //=> { a: 'a', b: 'b', c: 'c' };
   */
  var extend = function extend(dest /*, sources */) {
    var sources = Array.prototype.slice.call(arguments, 1);

    for (var i = 0; i < sources.length; i += 1) {
      for (var key in sources[i]) {
        if (has.call(sources[i], key)) {
          dest[key] = sources[i][key];
        }
      }
    }

    return dest;
  };

  /*
   * Exports.
   */

  var extend_1 = extend;

  /**
   * Handle all possible data types for properties
   * Data type options include any, array, object, boolean, integer, number, string.
   *
   * @param {Object} properties
   * @return {Object}
   */

  function normalize(properties) {
      var normalized = {};
      Object.keys(properties).forEach(function(key) {
          var prop = properties[key];
          if (typeof prop === 'undefined') return;

          if (is_1.date(prop)) {
              normalized[key] = prop.toString();
              return;
          }

          if (is_1.boolean(prop) || is_1.number(prop)) {
              normalized[key] = prop;
              return;
          }

          // array of objects. need to flatten
          if (toString.call(prop) === '[object Array]') {
              // Auryc can handle array of int, string, bools, but not objects
              var newProps = [];
              var primitive = true;
              prop.forEach(function (item) {
                  if (!primitive) return;
                  if (is_1.date(item)) {
                      newProps.push(item.toString());
                  } else if (is_1.boolean(item) || is_1.number(item) || is_1.string(item)) {
                      newProps.push(item);
                  } else {
                      primitive = false;
                  }
              });
              if (primitive) {
                  normalized[key] = newProps;
              } else { // has complex types, normalize
                  normalized = extend_1(normalized, unnest(key, prop));
              }
              return;
          }

          if (toString.call(prop) !== '[object Object]') {
              normalized[key] = prop.toString();
              return;
          }

          // anything else
          normalized = extend_1(normalized, unnest(key, prop));
      });

      return normalized;
  }


  function unnest(key, value) {
      var nestedObj = {};
      nestedObj[key] = value;
      var flattenedObj = flatten(nestedObj, { safe: true });

      for (var k in flattenedObj) {
          if (is_1.array(flattenedObj[k])) flattenedObj[k] = JSON.stringify(flattenedObj[k]);
      }

      return flattenedObj;
  }

  /**
   * Flatten nested objects
   * taken from https://www.npmjs.com/package/flat
   * @param {Object} target
   * @param {Object} opts
   * 
   * @return {Object} output
   */

  function flatten(target, opts) {
      opts = opts || {};

      var delimiter = opts.delimiter || '.';
      var maxDepth = opts.maxDepth;
      var currentDepth = 1;
      var output = {};

      function step(object, prev) {
          Object.keys(object).forEach(function(key) {
              var value = object[key];
              var isarray = opts.safe && Array.isArray(value);
              var type = Object.prototype.toString.call(value);
              var isobject = type === '[object Object]' || type === '[object Array]';

              var newKey = prev
                  ? prev + delimiter + key
                  : key;

              if (!opts.maxDepth) {
                  maxDepth = currentDepth + 1;
              }

              if (!isarray && isobject && Object.keys(value).length && currentDepth < maxDepth) {
                  ++currentDepth;
                  return step(value, newKey);
              }

              output[newKey] = value;
          });
      }

      step(target);

      return output;
  }

  function handleEvent (event, eventType) {
      var eName = event.EventName;
      var props = {};

      if (event.DeviceId) {
          props.DeviceId = event.DeviceId;
      }

      if (event.MPID) {
          props.MPID = event.MPID;
      }

      if (event.EventAttributes) {
          var attrs = helpers.normalize(event.EventAttributes) || {};
          Object.keys(attrs).forEach(function(key) {
              props[key] = attrs[key];
          });
      }
      props['auryc_integration'] = 'mParticle';
      if (eventType) {
          props['mParticleEventType'] = eventType;
      }
      window.auryc.track(eName, props);

      var userProps = {};
      if (event.UserIdentities) {
          var id = event.UserIdentities[0].Identity;
          if (id) window.auryc.identify(id);
          if (typeof event.UserIdentities[0].Type !== 'undefined') {
              userProps['UserIdentitiesType'] = event.UserIdentities[0].Type + '';
          }
      }

      if (event.UserAttributes) {
          var userAttrs = helpers.normalize(event.UserAttributes) || {};
          Object.keys(userAttrs).forEach(function(key) {
              userProps[key] = userAttrs[key];
          });
      }

      if (Object.keys(userProps).length) {
          window.auryc.addUserProperties(userProps);
      }
      
  }

  function handleIdentity (mParticleUser, identityRequest) {
      var email = null;
      var customerid = null;
      var MPID = null;
      if (mParticleUser) {
          var userIdentities = mParticleUser.getUserIdentities();
          if (userIdentities && userIdentities.userIdentities) {
              email = userIdentities.userIdentities.email;
              customerid = userIdentities.userIdentities.customerid;
          }

          MPID = mParticleUser.getMPID();
      }

      if (identityRequest) {
          userIdentities = identityRequest.userIdentities;
          if (userIdentities && !email) {
              email = userIdentities.email;
          }
    
          if (userIdentities && !customerid) {
              customerid = userIdentities.customerid;
          }
      }

      return {
          email: email,
          customerid: customerid,
          MPID: MPID
      };
  }

  function safeInvoke (g, fn) {
      return function wrapper() {
          if (g.auryc && typeof g.auryc[fn] !== 'undefined' && g.auryc[fn] !== wrapper) {
              g.auryc[fn].apply(this, Array.prototype.slice.call(arguments, 0));
          }
          else {
              var args = arguments;
              g.aurycReadyCb.push(function () {
                  g.auryc[fn].apply(this, Array.prototype.slice.call(args, 0));
              });
          }
      };
  }

  var helpers = {
      normalize: normalize,
      handleEvent: handleEvent,
      handleIdentity: handleIdentity,
      safeInvoke: safeInvoke
  };

  var helpers_1 = helpers;

  function CommerceHandler(common) {
      this.common = common || {};
  }

  CommerceHandler.prototype.logCommerceEvent = function(event) {
      var expandedEcommerceEvents = mParticle.eCommerce.expandCommerceEvent(
          event
      );
      expandedEcommerceEvents.forEach(function(expandedEvent) {
          try {
              helpers_1.handleEvent(expandedEvent, 'eCommerce');
          } catch (e) {
          }
      });
      
  };

  var commerceHandler = CommerceHandler;

  function EventHandler(common) {
      this.common = common || {};
  }
  EventHandler.prototype.logEvent = function(event) {
      helpers_1.handleEvent(event);
  };
  EventHandler.prototype.logError = function(event) {
      helpers_1.handleEvent(event, 'Error');
  };
  EventHandler.prototype.logPageView = function(event) {
      helpers_1.handleEvent(event, 'PageView');
  };

  var eventHandler = EventHandler;

  function IdentityHandler(common) {
      this.common = common || {};
  }

  IdentityHandler.prototype.sendIdentities = function (identities) {
      if (typeof identities === 'string') {
          window.auryc.identify(identities);
          return;
      }
      // use customer id first, and then email
      var id = identities.customerid || identities.email;
      if (id) {
          window.auryc.identify(id);
      }

      var props = {};
      
      if (identities.email) {
          props['email'] = identities.email;
      }
      if (identities.customerid) {
          props['customerid'] = identities.customerid;        
      }
      if (identities.MPID) {
          props['MPID'] = identities.MPID;
      }

      if (Object.keys(props).length) {
          window.auryc.addUserProperties(props);
      }
  };

  IdentityHandler.prototype.onUserIdentified = function(mParticleUser) {
      var identities = helpers_1.handleIdentity(mParticleUser);
      this.sendIdentities(identities);
  };
  IdentityHandler.prototype.onIdentifyComplete = function(
      mParticleUser,
      identityApiRequest
  ) {
      var identities = helpers_1.handleIdentity(mParticleUser, identityApiRequest);
      this.sendIdentities(identities);
  };
  IdentityHandler.prototype.onLoginComplete = function(
      mParticleUser,
      identityApiRequest
  ) {
      var identities = helpers_1.handleIdentity(mParticleUser, identityApiRequest);
      this.sendIdentities(identities);
  };
  IdentityHandler.prototype.onLogoutComplete = function(
      mParticleUser,
      identityApiRequest
  ) {};
  IdentityHandler.prototype.onModifyComplete = function(
      mParticleUser,
      identityApiRequest
  ) {
      var identities = helpers_1.handleIdentity(mParticleUser, identityApiRequest);
      this.sendIdentities(identities);
  };

  /*  In previous versions of the mParticle web SDK, setting user identities on
      kits is only reachable via the onSetUserIdentity method below. We recommend
      filling out `onSetUserIdentity` for maximum compatibility
  */
  IdentityHandler.prototype.onSetUserIdentity = function(
      forwarderSettings,
      id,
      type
  ) {
  };

  var identityHandler = IdentityHandler;

  var initialization = {
      name: 'Auryc',

      initForwarder: function(forwarderSettings, testMode, userAttributes, userIdentities, processEvent, eventQueue, isInitialized) {


          if (!testMode) {

              (function (g) {
                  g.aurycReadyCb = g.aurycReadyCb || [];
                  g.auryc = g.auryc || {};
                  var fns = ['track', 'identify', 'addFBCustomData', 'addUserProperties', 'addSessionProperties', 
                      'addInternalSessionProperties', 'getReplayUrl', 'setFeedbackEnabled', 'clearUserCookie',
                      'addFBSubmitHandler', 'addFBCancelHandler', 'pause', 'resume'];
                  fns.forEach(function (fn) {
                      g.auryc[fn] = helpers_1.safeInvoke(g, fn);
                  });
              })(window);

              var clientScript = document.createElement('script');
              clientScript.type = 'text/javascript';
              clientScript.setAttribute('data-cfasync', 'false');
              clientScript.setAttribute('charset', 'utf-8');
              clientScript.async = true;
              clientScript.src = 'https://cdn.auryc.com/' + forwarderSettings.siteId + '/container.js';
              (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(clientScript);
          }
      }
  };

  var initialization_1 = initialization;

  var sessionHandler = {
      onSessionStart: function(event) {
          
      },
      onSessionEnd: function(event) {

      }
  };

  var sessionHandler_1 = sessionHandler;

  function UserAttributeHandler(common) {
      this.common = common = {};
  }
  UserAttributeHandler.prototype.onRemoveUserAttribute = function(
      key,
      mParticleUser
  ) {};
  UserAttributeHandler.prototype.onSetUserAttribute = function(
      key,
      value,
      mParticleUser
  ) {
      var prop = {};
      prop[key] = value;
      window.auryc.addUserProperties(helpers_1.normalize(prop));
  };
  UserAttributeHandler.prototype.onConsentStateUpdated = function(
      oldState,
      newState,
      mParticleUser
  ) {};

  var userAttributeHandler = UserAttributeHandler;

  // =============== REACH OUT TO MPARTICLE IF YOU HAVE ANY QUESTIONS ===============
  //
  //  Copyright 2018 mParticle, Inc.
  //
  //  Licensed under the Apache License, Version 2.0 (the "License");
  //  you may not use this file except in compliance with the License.
  //  You may obtain a copy of the License at
  //
  //      http://www.apache.org/licenses/LICENSE-2.0
  //
  //  Unless required by applicable law or agreed to in writing, software
  //  distributed under the License is distributed on an "AS IS" BASIS,
  //  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  //  See the License for the specific language governing permissions and
  //  limitations under the License.









  var name = initialization_1.name,
      moduleId = initialization_1.moduleId,
      MessageType = {
          SessionStart: 1,
          SessionEnd: 2,
          PageView: 3,
          PageEvent: 4,
          CrashReport: 5,
          OptOut: 6,
          Commerce: 16,
          Media: 20,
      };

  var constructor = function() {
      var self = this,
          isInitialized = false,
          forwarderSettings,
          reportingService,
          eventQueue = [];

      self.name = initialization_1.name;
      self.moduleId = initialization_1.moduleId;
      self.common = new common();

      function initForwarder(
          settings,
          service,
          testMode,
          trackerId,
          userAttributes,
          userIdentities
      ) {
          forwarderSettings = settings;

          if (window.mParticle.isTestEnvironment) {
              reportingService = function() {};
          } else {
              reportingService = service;
          }

          try {
              initialization_1.initForwarder(
                  settings,
                  testMode,
                  userAttributes,
                  userIdentities,
                  processEvent,
                  eventQueue,
                  isInitialized,
                  self.common
              );
              self.eventHandler = new eventHandler(self.common);
              self.identityHandler = new identityHandler(self.common);
              self.userAttributeHandler = new userAttributeHandler(self.common);
              self.commerceHandler = new commerceHandler(self.common);

              isInitialized = true;
          } catch (e) {
              console.log('Failed to initialize ' + name + ' - ' + e);
          }
      }

      function processEvent(event) {
          var reportEvent = false;
          if (isInitialized) {
              try {
                  if (event.EventDataType === MessageType.SessionStart) {
                      reportEvent = logSessionStart(event);
                  } else if (event.EventDataType === MessageType.SessionEnd) {
                      reportEvent = logSessionEnd(event);
                  } else if (event.EventDataType === MessageType.CrashReport) {
                      reportEvent = logError(event);
                  } else if (event.EventDataType === MessageType.PageView) {
                      reportEvent = logPageView(event);
                  } else if (event.EventDataType === MessageType.Commerce) {
                      reportEvent = logEcommerceEvent(event);
                  } else if (event.EventDataType === MessageType.PageEvent) {
                      reportEvent = logEvent(event);
                  } else if (event.EventDataType === MessageType.Media) {
                      // Kits should just treat Media Events as generic Events
                      reportEvent = logEvent(event);
                  }
                  if (reportEvent === true && reportingService) {
                      reportingService(self, event);
                      return 'Successfully sent to ' + name;
                  } else {
                      return (
                          'Error logging event or event type not supported on forwarder ' +
                          name
                      );
                  }
              } catch (e) {
                  return 'Failed to send to ' + name + ' ' + e;
              }
          } else {
              eventQueue.push(event);
              return (
                  "Can't send to forwarder " +
                  name +
                  ', not initialized. Event added to queue.'
              );
          }
      }

      function logSessionStart(event) {
          try {
              sessionHandler_1.onSessionStart(event);
              return true;
          } catch (e) {
              return {
                  error: 'Error starting session on forwarder ' + name + '; ' + e,
              };
          }
      }

      function logSessionEnd(event) {
          try {
              sessionHandler_1.onSessionEnd(event);
              return true;
          } catch (e) {
              return {
                  error: 'Error ending session on forwarder ' + name + '; ' + e,
              };
          }
      }

      function logError(event) {
          try {
              self.eventHandler.logError(event);
              return true;
          } catch (e) {
              return {
                  error: 'Error logging error on forwarder ' + name + '; ' + e,
              };
          }
      }

      function logPageView(event) {
          try {
              self.eventHandler.logPageView(event);
              return true;
          } catch (e) {
              return {
                  error:
                      'Error logging page view on forwarder ' + name + '; ' + e,
              };
          }
      }

      function logEvent(event) {
          try {
              self.eventHandler.logEvent(event);
              return true;
          } catch (e) {
              return {
                  error: 'Error logging event on forwarder ' + name + '; ' + e,
              };
          }
      }

      function logEcommerceEvent(event) {
          try {
              self.commerceHandler.logCommerceEvent(event);
              return true;
          } catch (e) {
              return {
                  error:
                      'Error logging purchase event on forwarder ' +
                      name +
                      '; ' +
                      e,
              };
          }
      }

      function setUserAttribute(key, value) {
          if (isInitialized) {
              try {
                  self.userAttributeHandler.onSetUserAttribute(
                      key,
                      value,
                      forwarderSettings
                  );
                  return 'Successfully set user attribute on forwarder ' + name;
              } catch (e) {
                  return (
                      'Error setting user attribute on forwarder ' +
                      name +
                      '; ' +
                      e
                  );
              }
          } else {
              return (
                  "Can't set user attribute on forwarder " +
                  name +
                  ', not initialized'
              );
          }
      }

      function removeUserAttribute(key) {
          if (isInitialized) {
              try {
                  self.userAttributeHandler.onRemoveUserAttribute(
                      key,
                      forwarderSettings
                  );
                  return (
                      'Successfully removed user attribute on forwarder ' + name
                  );
              } catch (e) {
                  return (
                      'Error removing user attribute on forwarder ' +
                      name +
                      '; ' +
                      e
                  );
              }
          } else {
              return (
                  "Can't remove user attribute on forwarder " +
                  name +
                  ', not initialized'
              );
          }
      }

      function setUserIdentity(id, type) {
          if (isInitialized) {
              try {
                  self.identityHandler.onSetUserIdentity(
                      forwarderSettings,
                      id,
                      type
                  );
                  return 'Successfully set user Identity on forwarder ' + name;
              } catch (e) {
                  return (
                      'Error removing user attribute on forwarder ' +
                      name +
                      '; ' +
                      e
                  );
              }
          } else {
              return (
                  "Can't call setUserIdentity on forwarder " +
                  name +
                  ', not initialized'
              );
          }
      }

      function onUserIdentified(user) {
          if (isInitialized) {
              try {
                  self.identityHandler.onUserIdentified(user);

                  return (
                      'Successfully called onUserIdentified on forwarder ' + name
                  );
              } catch (e) {
                  return {
                      error:
                          'Error calling onUserIdentified on forwarder ' +
                          name +
                          '; ' +
                          e,
                  };
              }
          } else {
              return (
                  "Can't set new user identities on forwader  " +
                  name +
                  ', not initialized'
              );
          }
      }

      function onIdentifyComplete(user, filteredIdentityRequest) {
          if (isInitialized) {
              try {
                  self.identityHandler.onIdentifyComplete(
                      user,
                      filteredIdentityRequest
                  );

                  return (
                      'Successfully called onIdentifyComplete on forwarder ' +
                      name
                  );
              } catch (e) {
                  return {
                      error:
                          'Error calling onIdentifyComplete on forwarder ' +
                          name +
                          '; ' +
                          e,
                  };
              }
          } else {
              return (
                  "Can't call onIdentifyCompleted on forwader  " +
                  name +
                  ', not initialized'
              );
          }
      }

      function onLoginComplete(user, filteredIdentityRequest) {
          if (isInitialized) {
              try {
                  self.identityHandler.onLoginComplete(
                      user,
                      filteredIdentityRequest
                  );

                  return (
                      'Successfully called onLoginComplete on forwarder ' + name
                  );
              } catch (e) {
                  return {
                      error:
                          'Error calling onLoginComplete on forwarder ' +
                          name +
                          '; ' +
                          e,
                  };
              }
          } else {
              return (
                  "Can't call onLoginComplete on forwader  " +
                  name +
                  ', not initialized'
              );
          }
      }

      function onLogoutComplete(user, filteredIdentityRequest) {
          if (isInitialized) {
              try {
                  self.identityHandler.onLogoutComplete(
                      user,
                      filteredIdentityRequest
                  );

                  return (
                      'Successfully called onLogoutComplete on forwarder ' + name
                  );
              } catch (e) {
                  return {
                      error:
                          'Error calling onLogoutComplete on forwarder ' +
                          name +
                          '; ' +
                          e,
                  };
              }
          } else {
              return (
                  "Can't call onLogoutComplete on forwader  " +
                  name +
                  ', not initialized'
              );
          }
      }

      function onModifyComplete(user, filteredIdentityRequest) {
          if (isInitialized) {
              try {
                  self.identityHandler.onModifyComplete(
                      user,
                      filteredIdentityRequest
                  );

                  return (
                      'Successfully called onModifyComplete on forwarder ' + name
                  );
              } catch (e) {
                  return {
                      error:
                          'Error calling onModifyComplete on forwarder ' +
                          name +
                          '; ' +
                          e,
                  };
              }
          } else {
              return (
                  "Can't call onModifyComplete on forwader  " +
                  name +
                  ', not initialized'
              );
          }
      }

      function setOptOut(isOptingOutBoolean) {
          if (isInitialized) {
              try {
                  self.initialization.setOptOut(isOptingOutBoolean);

                  return 'Successfully called setOptOut on forwarder ' + name;
              } catch (e) {
                  return {
                      error:
                          'Error calling setOptOut on forwarder ' +
                          name +
                          '; ' +
                          e,
                  };
              }
          } else {
              return (
                  "Can't call setOptOut on forwader  " +
                  name +
                  ', not initialized'
              );
          }
      }

      this.init = initForwarder;
      this.process = processEvent;
      this.setUserAttribute = setUserAttribute;
      this.removeUserAttribute = removeUserAttribute;
      this.onUserIdentified = onUserIdentified;
      this.setUserIdentity = setUserIdentity;
      this.onIdentifyComplete = onIdentifyComplete;
      this.onLoginComplete = onLoginComplete;
      this.onLogoutComplete = onLogoutComplete;
      this.onModifyComplete = onModifyComplete;
      this.setOptOut = setOptOut;
  };

  function getId() {
      return moduleId;
  }

  if (window && window.mParticle && window.mParticle.addForwarder) {
      window.mParticle.addForwarder({
          name: name,
          constructor: constructor,
          getId: getId,
      });
  }

  var SDKsettings = {
      siteId: '900-mparticlecom'
      /* fill in SDKsettings with any particular settings or options your sdk requires in order to
      initialize, this may be apiKey, projectId, primaryCustomerType, etc. These are passed
      into the src/initialization.js file as the
      */
  };

  // Do not edit below:
  var settings = SDKsettings;

  var name$1 = initialization_1.name;

  var config = {
      name: name$1,
      moduleId: 100, // when published, you will receive a new moduleID
      isDebug: true,
      isSandbox: true,
      settings: settings,
      userIdentityFilters: [],
      hasDebugString: [],
      isVisible: [],
      eventNameFilters: [],
      eventTypeFilters: [],
      attributeFilters: [],
      screenNameFilters: [],
      pageViewAttributeFilters: [],
      userAttributeFilters: [],
      filteringEventAttributeValue: 'null',
      filteringUserAttributeValue: 'null',
      eventSubscriptionId: 123,
      filteringConsentRuleValues: 'null',
      excludeAnonymousUser: false
  };

  window.mParticle.config = window.mParticle.config || {};
  window.mParticle.config.workspaceToken = 'testkit';
  window.mParticle.config.requestConfig = false;
  window.mParticle.config.kitConfigs = [config];

  var endToEndTestapp = {

  };

  exports.default = endToEndTestapp;

  return exports;

}({}));

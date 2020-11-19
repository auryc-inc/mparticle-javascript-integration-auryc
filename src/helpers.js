var is = require('is');
var extend = require('@ndhoule/extend');

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

        if (is.date(prop)) {
            normalized[key] = prop.toString();
            return;
        }

        if (is.boolean(prop) || is.number(prop)) {
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
                if (is.date(item)) {
                    newProps.push(item.toString());
                } else if (is.boolean(item) || is.number(item) || is.string(item)) {
                    newProps.push(item);
                } else {
                    primitive = false;
                }
            });
            if (primitive) {
                normalized[key] = newProps;
            } else { // has complex types, normalize
                normalized = extend(normalized, unnest(key, prop));
            }
            return;
        }

        if (toString.call(prop) !== '[object Object]') {
            normalized[key] = prop.toString();
            return;
        }

        // anything else
        normalized = extend(normalized, unnest(key, prop));
    });

    return normalized;
}


function unnest(key, value) {
    var nestedObj = {};
    nestedObj[key] = value;
    var flattenedObj = flatten(nestedObj, { safe: true });

    for (var k in flattenedObj) {
        if (is.array(flattenedObj[k])) flattenedObj[k] = JSON.stringify(flattenedObj[k]);
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
        props['mParticle_eventType'] = eventType;
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

module.exports = helpers;
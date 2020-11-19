var helpers = require('./helpers');

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
                    g.auryc[fn] = helpers.safeInvoke(g, fn);
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

module.exports = initialization;

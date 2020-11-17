var initialization = {
    name: 'Auryc',
/*  ****** Fill out initForwarder to load your SDK ******
    Note that not all arguments may apply to your SDK initialization.
    These are passed from mParticle, but leave them even if they are not being used.
    forwarderSettings contain settings that your SDK requires in order to initialize
    userAttributes example: {gender: 'male', age: 25}
    userIdentities example: { 1: 'customerId', 2: 'facebookId', 7: 'emailid@email.com' }
    additional identityTypes can be found at https://github.com/mParticle/mparticle-sdk-javascript/blob/master-v2/src/types.js#L88-L101
*/
    initForwarder: function(forwarderSettings, testMode, userAttributes, userIdentities, processEvent, eventQueue, isInitialized) {
        /* `forwarderSettings` contains your SDK specific settings such as apiKey that your customer needs in order to initialize your SDK properly */

        if (!testMode) {
            /* Load your Web SDK here using a variant of your snippet from your readme that your customers would generally put into their <head> tags
               Generally, our integrations create script tags and append them to the <head>. Please follow the following format as a guide:
            */
            var safeInvoke = function (g, fn) {
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
            };

            (function (g) {
                g.aurycReadyCb = g.aurycReadyCb || [];
                g.auryc = g.auryc || {};
                var fns = ['track', 'identify', 'addFBCustomData', 'addUserProperties', 'addSessionProperties', 
                    'addInternalSessionProperties', 'getReplayUrl', 'setFeedbackEnabled', 'clearUserCookie',
                    'addFBSubmitHandler', 'addFBCancelHandler', 'pause', 'resume'];
                fns.forEach(function (fn) {
                    g.auryc[fn] = safeInvoke(g, fn);
                });
            })(window);

            var clientScript = document.createElement('script');
            clientScript.type = 'text/javascript';
            clientScript.setAttribute('data-cfasync', 'false');
            clientScript.setAttribute('charset', 'utf-8');
            clientScript.async = true;
            clientScript.src = 'https://cdn.auryc.com/' + forwarderSettings.siteId + '/container.js';
            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(clientScript);
        } else {
            // For testing, you should fill out this section in order to ensure any required initialization calls are made,
            // clientSDKObject.initialize(forwarderSettings.apiKey)
        }
    }
};

module.exports = initialization;

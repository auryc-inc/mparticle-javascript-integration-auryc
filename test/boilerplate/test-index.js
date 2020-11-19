window.MockHttpServer = require('./mockhttprequest.js');
window.Should = require('should');
require('@mparticle/web-sdk');
window.mParticle.addForwarder = function(forwarder) {
    window.mParticle.forwarder = new forwarder.constructor();
};

window.getCurrentUser = function() {
    return currentUser();
};

function currentUser() {
    return {
        getMPID: function() {
            return 123;
        },
    };
}
require('../../node_modules/@mparticle/web-kit-wrapper/index.js');
require('../tests.js');

var helpers = require('./helpers');

function CommerceHandler(common) {
    this.common = common || {};
}

CommerceHandler.prototype.logCommerceEvent = function(event) {
    var expandedEcommerceEvents = mParticle.eCommerce.expandCommerceEvent(
        event
    );
    expandedEcommerceEvents.forEach(function(expandedEvent) {
        try {
            helpers.handleEvent(expandedEvent, 'eCommerce');
        } catch (e) {
        }
    });
    
};

module.exports = CommerceHandler;

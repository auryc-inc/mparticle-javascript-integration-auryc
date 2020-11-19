var helpers = require('./helpers');


function EventHandler(common) {
    this.common = common || {};
}
EventHandler.prototype.logEvent = function(event) {
    helpers.handleEvent(event);
};
EventHandler.prototype.logError = function(event) {
    helpers.handleEvent(event, 'Error');
};
EventHandler.prototype.logPageView = function(event) {
    helpers.handleEvent(event, 'PageView');
};

module.exports = EventHandler;

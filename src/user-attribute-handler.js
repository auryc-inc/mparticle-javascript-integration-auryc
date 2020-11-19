var helpers = require('./helpers');



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
    window.auryc.addUserProperties(helpers.normalize(prop));
};
UserAttributeHandler.prototype.onConsentStateUpdated = function(
    oldState,
    newState,
    mParticleUser
) {};

module.exports = UserAttributeHandler;

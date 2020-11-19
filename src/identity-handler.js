var helpers = require('./helpers');

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
    var identities = helpers.handleIdentity(mParticleUser);
    this.sendIdentities(identities);
};
IdentityHandler.prototype.onIdentifyComplete = function(
    mParticleUser,
    identityApiRequest
) {
    var identities = helpers.handleIdentity(mParticleUser, identityApiRequest);
    this.sendIdentities(identities);
};
IdentityHandler.prototype.onLoginComplete = function(
    mParticleUser,
    identityApiRequest
) {
    var identities = helpers.handleIdentity(mParticleUser, identityApiRequest);
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
    var identities = helpers.handleIdentity(mParticleUser, identityApiRequest);
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

module.exports = IdentityHandler;

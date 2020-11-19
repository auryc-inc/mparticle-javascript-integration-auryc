/* eslint-disable no-undef*/
describe('Auryc Forwarder', function () {
    // -------------------DO NOT EDIT ANYTHING BELOW THIS LINE-----------------------
    var MessageType = {
            SessionStart: 1,
            SessionEnd: 2,
            PageView: 3,
            PageEvent: 4,
            CrashReport: 5,
            OptOut: 6,
            AppStateTransition: 10,
            Profile: 14,
            Commerce: 16
        },
        EventType = {
            Unknown: 0,
            Navigation: 1,
            Location: 2,
            Search: 3,
            Transaction: 4,
            UserContent: 5,
            UserPreference: 6,
            Social: 7,
            Other: 8,
            Media: 9,
            getName: function() {
                return 'blahblah';
            }
        },
        CommerceEventType = {
            ProductAddToCart: 10,
            ProductRemoveFromCart: 11,
            ProductCheckout: 12,
            ProductCheckoutOption: 13,
            ProductClick: 14,
            ProductViewDetail: 15,
            ProductPurchase: 16,
            ProductRefund: 17,
            PromotionView: 18,
            PromotionClick: 19,
            ProductAddToWishlist: 20,
            ProductRemoveFromWishlist: 21,
            ProductImpression: 22
        },
        ProductActionType = {
            Unknown: 0,
            AddToCart: 1,
            RemoveFromCart: 2,
            Checkout: 3,
            CheckoutOption: 4,
            Click: 5,
            ViewDetail: 6,
            Purchase: 7,
            Refund: 8,
            AddToWishlist: 9,
            RemoveFromWishlist: 10
        },
        IdentityType = {
            Other: 0,
            CustomerId: 1,
            Facebook: 2,
            Twitter: 3,
            Google: 4,
            Microsoft: 5,
            Yahoo: 6,
            Email: 7,
            Alias: 8,
            FacebookCustomAudienceId: 9,
        },
        ReportingService = function () {
            var self = this;

            this.id = null;
            this.event = null;

            this.cb = function (forwarder, event) {
                self.id = forwarder.id;
                self.event = event;
            };

            this.reset = function () {
                this.id = null;
                this.event = null;
            };
        },
        reportService = new ReportingService();

// -------------------DO NOT EDIT ANYTHING ABOVE THIS LINE-----------------------
// -------------------START EDITING BELOW:-----------------------
// -------------------mParticle stubs - Add any additional stubbing to our methods as needed-----------------------
    mParticle.Identity = {
        getCurrentUser: function() {
            return {
                getMPID: function() {
                    return '123';
                }

            };
        }
    };
// -------------------START EDITING BELOW:-----------------------
    var MockAurycForwarder = function() {
        var self = this;

        // create properties for each type of event you want tracked, see below for examples
        this.trackCustomEventCalled = false;

        this.siteId = null;
        this.userAttributes = {};
        this.userIdField = null;

        this.eventProperties = [];
        this.events = [];

        this.track = function(name, eventProperties){
            self.trackCustomEventCalled = true;
            self.events.push({
                name: name,
                properties: eventProperties
            });
            // Return true to indicate event should be reported
            return true;
        };

        this.addUserProperties = function(userAttributes) {
            userAttributes = userAttributes || {};
            if (Object.keys(userAttributes).length) {
                for (var key in userAttributes) {
                    if (userAttributes[key] === null) {
                        delete self.userAttributes[key];
                    }
                    else {
                        self.userAttributes[key] = userAttributes[key];
                    }
                }
            }
        };

        this.identify = function(id) {
            self.userId = id;
        };
    };

    before(function () {
        mParticle.init('fake-api-key', {workspaceToken: 'faketoken', requestConfig: false});
    });

    beforeEach(function() {
        window.auryc = new MockAurycForwarder();
        // Include any specific settings that is required for initializing your SDK here
        var sdkSettings = {
            siteId: '123-examplecom'
        };
        // You may require userAttributes or userIdentities to be passed into initialization
        var userAttributes = {
            color: 'green'
        };
        var userIdentities = [{
            Identity: 'customerId',
            Type: IdentityType.CustomerId
        }, {
            Identity: 'email',
            Type: IdentityType.Email
        }, {
            Identity: 'facebook',
            Type: IdentityType.Facebook
        }];
        mParticle.forwarder.init(sdkSettings, reportService.cb, true, null, userAttributes, userIdentities);
    });

    it('should log event', function(done) {
        mParticle.forwarder.process({
            EventDataType: MessageType.PageEvent,
            EventName: 'Test Event 123',
            EventAttributes: {
                label: 'label',
                value: 200,
                category: 'category'
            }
        });

        window.auryc.trackCustomEventCalled.should.equal(true);
        window.auryc.events.length.should.equal(1);
        window.auryc.events[0].name.should.equal('Test Event 123');
        window.auryc.events[0].properties.label.should.equal('label');
        window.auryc.events[0].properties.value.should.equal(200);
        window.auryc.events[0].properties.category.should.equal('category');
        window.auryc.events[0].properties['mParticle_eventType'].should.equal('PageEvent');


        done();
    });


    it('should log page view', function(done) {
        mParticle.forwarder.process({
            EventDataType: MessageType.PageView,
            EventName: 'test name',
            EventAttributes: {
                attr1: 'test1',
                attr2: 'test2'
            }
        });


        window.auryc.trackCustomEventCalled.should.equal(true);
        window.auryc.events.length.should.equal(1);
        window.auryc.events[0].name.should.equal('test name');
        window.auryc.events[0].properties.attr1.should.equal('test1');
        window.auryc.events[0].properties.attr2.should.equal('test2');
        window.auryc.events[0].properties['mParticle_eventType'].should.equal('PageView');

        done();
    });

    it('should log event with identity and user attributes', function(done) {
        mParticle.forwarder.process({
            EventDataType: MessageType.PageEvent,
            EventName: 'Test Event 123',
            EventAttributes: {
                label: 'label',
                value: 200,
                category: 'category'
            },
            UserAttributes: {
                userAttr1: 'value1', 
                userAttr2: 'value2'
            },
            UserIdentities: [
                {Identity: 'email@gmail.com', Type: 7}
            ]
        });

        window.auryc.trackCustomEventCalled.should.equal(true);
        window.auryc.events.length.should.equal(1);
        window.auryc.events[0].name.should.equal('Test Event 123');
        window.auryc.events[0].properties.label.should.equal('label');
        window.auryc.events[0].properties.value.should.equal(200);
        window.auryc.events[0].properties.category.should.equal('category');

        window.auryc.userId.should.equal('email@gmail.com');
        window.auryc.userAttributes.userAttr1.should.equal('value1');
        window.auryc.userAttributes.userAttr2.should.equal('value2');

        done();
    });
   
    it('should log a product purchase commerce event', function(done) {
        mParticle.forwarder.process({
            EventName: 'eCommerce - Purchase',
            EventDataType: MessageType.Commerce,
            EventCategory: CommerceEventType.ProductPurchase,
            ProductAction: {
                ProductActionType: ProductActionType.Purchase,
                ProductList: [
                    {
                        Sku: '12345',
                        Name: 'iPhone 6',
                        Category: 'Phones',
                        Brand: 'iPhone',
                        Variant: '6',
                        Price: 400,
                        TotalAmount: 400,
                        CouponCode: 'coupon-code',
                        Quantity: 1
                    }
                ],
                TransactionId: 123,
                Affiliation: 'my-affiliation',
                TotalAmount: 450,
                TaxAmount: 40,
                ShippingAmount: 10,
                CouponCode: null
            }
        });

        window.auryc.trackCustomEventCalled.should.equal(true);
        window.auryc.events.length.should.equal(2);
        
        var totalEvent = window.auryc.events[0];
        totalEvent.name.should.equal('eCommerce - purchase - Total');

        var properties = totalEvent.properties;
        properties['auryc_integration'].should.equal('mParticle');
        properties.Affiliation.should.equal('my-affiliation');
        properties['Product Count'].should.equal(1);
        properties['Shipping Amount'].should.equal(10);
        properties['Tax Amount'].should.equal(40);
        properties['Total Amount'].should.equal(450);
        properties['Transaction Id'].should.equal(123);
        properties['mParticle_eventType'].should.equal('eCommerce');

        var itemEvent = window.auryc.events[1];
        itemEvent.name.should.equal('eCommerce - purchase - Item');
        properties['auryc_integration'].should.equal('mParticle');
        properties = itemEvent.properties;
        properties.Brand.should.equal('iPhone');
        properties.Category.should.equal('Phones');
        properties['Coupon Code'].should.equal('coupon-code');
        properties['Item Price'].should.equal(400);
        properties.Quantity.should.equal(1);
        properties.Name.should.equal('iPhone 6');
        properties['Total Product Amount'].should.equal(400);
        properties.Variant.should.equal('6');
        properties['mParticle_eventType'].should.equal('eCommerce');

        done();
    });

    it('should set customer id user identity on user identity change', function(done) {
        var fakeUserStub = {
            getUserIdentities: function() {
                return {
                    userIdentities: {
                        customerid: '123',
                        email: 'test@example.com'
                    }
                };
            },
            getMPID: function() {
                return 'testMPID';
            },
            setUserAttribute: function() {
        
            },
            removeUserAttribute: function() {
        
            }
        };
        
        mParticle.forwarder.onUserIdentified(fakeUserStub);
        
        window.auryc.userId.should.equal('123');
        window.auryc.userAttributes['email'].should.equal('test@example.com');
        window.auryc.userAttributes['customerid'].should.equal('123');
        window.auryc.userAttributes['MPID'].should.equal('testMPID');

        done();
    });

    it('should set and remove user attributes properly', function(done) {

        mParticle.forwarder.setUserAttribute('key', 'value');       
        window.auryc.userAttributes['key'].should.equal('value');        
        done();
    });
});

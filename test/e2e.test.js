// Run the following code in the Console of the end to end testing page

// identify

var identityRequest = {
  userIdentities: {
    email: 'abc@example.com',
    customerid: '999999'    
  }
};
var identityCallback = function(result) { 
  if (result.getUser()) { 
    console.log('Got identity callback:');
    console.log(result.getUser());
  } 
};
mParticle.Identity.login(identityRequest, identityCallback);

// user attributes

var currentUser = mParticle.Identity.getCurrentUser();

// Set user attributes associated with the user 
currentUser.setUserAttribute("top_region","Europe");

// You can change the value of an existing attribute at any time
currentUser.setUserAttribute("top_region","North America");

// Associate a list of values with an attribute key
currentUser.setUserAttributeList("destinations", [
    "Rome",
    "San Juan",
    "Denver"
]);

// event tracking 

mParticle.logEvent(
  'Video Watched',
  mParticle.EventType.Navigation,
  {'category':'Destination Intro','title':'Paris'}
);

// page view tracking

mParticle.logPageView(
	"Product Detail Page",
	{page: window.location.toString()},
	{"Google.Page": window.location.pathname.toString()} // if you're using Google Analytics to track page views
);

// commerce events
// 1. Create the product
var product1 = mParticle.eCommerce.createProduct(
  'Double Room - Econ Rate',  // Name
  'econ-1',                   // SKU
  100.00,                     // Price
  4                           // Quantity
);

var product2 = mParticle.eCommerce.createProduct(
  'Double Room - Econ Rate',
  'econ-1', 
  100.00, 
  4
);

// 2. Summarize the transaction
var transactionAttributes = {
  Id: 'foo-transaction-id',
  Revenue: 430.00,
  Tax: 30
};

// 3. Log the purchase event (optional custom attributes an custom flags depending on your );
var customAttributes = {sale: true}; // if not passing any custom attributes, pass null
var customFlags = {'Google.Category': 'travel'} // if not passing any custom flags, pass null
mParticle.eCommerce.logProductAction(
  mParticle.ProductActionType.Purchase,
  [product1, product2],
  customAttributes,
  customFlags,
  transactionAttributes);

// With the product created above, you can perform any of the above product actions. Some examples include:

var product3 = mParticle.eCommerce.createProduct(
  'Double Room 2 - Econ Rate',
  'econ-2', 
  200.00, 
  5
);
// Adding/Removing items to/from your cart
mParticle.eCommerce.logProductAction(mParticle.ProductActionType.AddToCart, product3, customAttributes);
mParticle.eCommerce.logProductAction(mParticle.ProductActionType.RemoveFromCart, product3, customAttributes);

// Checkout (continuation of transactionAttributes above)
transactionAttributes.Step = 2;
transactionAttributes.Option = 'Visa';

mParticle.eCommerce.logProductAction(
    mParticle.ProductActionType.Checkout,
    [product1, product2],
    customAttributes,
    customFlags,
    transactionAttributes);
    
var promotion = mParticle.eCommerce.createPromotion(
  'my_promo_1', // Promotion ID
  'sale_banner_1', // Promotion Creative
  'App-wide 50% off sale' // Promotion Name
);
  mParticle.eCommerce.logPromotion(mParticle.PromotionType.PromotionClick, promotion);
  
  var impression = mParticle.eCommerce.createImpression('Suggested Products List', product3);
mParticle.eCommerce.logImpression(impression);

mParticle.logError('Login failed');



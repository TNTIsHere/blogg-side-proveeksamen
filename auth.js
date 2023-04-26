const admin = require('firebase-admin');

async function isAuthenticated(req, res, next) {
    console.log('isAuthenticated middleware called');
    
    const { authorization } = req.headers;
    console.log('authorization header:', authorization);
    console.log(req.headers)
  
    if (!authorization || !authorization.startsWith('Bearer ')) {
      console.log('Invalid authorization header');
      return res.status(401).send('Unauthorized');
    }
  
    const idToken = authorization.split('Bearer ')[1];
    console.log('idToken:', idToken);
  
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      console.log('decodedToken:', decodedToken);
  
      req.user = decodedToken;
  
      // Check if the user's UID matches the allowed UID
      if (req.user.uid === "esxms38H66UsaE9LzgQdET4hQ0w2") {
        console.log('User is authorized');
        return next();
      }
  
      // Otherwise, continue with the standard authentication check
      // ...
  
    } catch (err) {
      console.error(err);
      res.status(401).send('Unauthorized');
    }
  }  

module.exports = isAuthenticated;

const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customerRoutes = require('./router/auth_users.js').authenticated;
const generalRoutes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({secret:"fingerprint_customer", resave: true, saveUninitialized: true}));

app.use("/customer/auth/*", function auth(req, res, next) {

    // Check if the user is authenticated and has valid access token
    if(req.session.authorization) {
        let token = req.session.authorization.accessToken;

        /**
         * SIGN
         * 
         * jwt.sign(payload, secretOrPrivateKey, [options, callback])
         * (Asynchronous) If a callback is supplied, the callback is called with the err or the JWT.
         * (Synchronous) Returns the JsonWebToken as string
         * 
         * payload could be an object literal, buffer or string representing valid JSON. If payload is not 
         *      a buffer or a string, use JSON.stringify.
         * secretOrPrivateKey is a string (utf-8 encoded), buffer, object, or KeyObject containing either 
         *      the secret for HMAC algorithms or the PEM encoded private key for RSA and ECDSA.
         * options: algorithm, expiresIn, audience, issuer, jwtid, subject, noTimestamp, header, keyid
         *     algorithm (default: HS256)
         *     expiresIn: expressed in seconds or a string describing a time span vercel/ms. ("120" is equal to "120ms")
         * 
         * To generate a token:
         * jwt.sign({ data: 'foobar' }, 'secret', { expiresIn: '1h' });
         * 
         * 
         * 
         * VERIFY
         * jwt.verify(token, secretOrPublicKey, [options, callback])
         * 
         * (Asynchronous) If a callback is supplied, function acts asynchronously. The callback is called with the decoded payload 
         * if the signature is valid and optional expiration, audience, or issuer are valid. If not, it will be called with the error.
         * 
         * (Synchronous) If a callback is not supplied, function acts synchronously. Returns the payload decoded if the signature 
         * is valid and optional expiration, audience, or issuer are valid. If not, it will throw the error.
         * 
         * token is the JsonWebToken string
         * secretOrPublicKey is a string (utf-8 encoded), buffer, or KeyObject containing either the secret for HMAC algorithms, 
         *      or the PEM encoded public key for RSA and ECDSA.
         * 
         *  
         * 
         * DECODE
         * jwt.decode(token [, options])
         * (Synchronous) Returns the decoded payload without verifying if the signature is valid.
         * 
         * */
        /*
        const decoded = jwt.decode(token,
            // Setting { complete: true } allows you to access both the header and the payload.
            { complete: true }
        ); 

        // You will get the kid (key if of the public key) and the iss (issuer URL)
        // usefull for the next step
        console.log("Header:", decoded.header);
        */

        // jwt.verify(token, secretOrPublicKey, [options, callback])
        jwt.verify(token, 'access', (err, user) => {
            if(err) {
                return res.status(401).send("Access token cannot be verified");
            }
            else {
                req.user = user;
                next();
            }
        });
    }
    else {
        res.status(401).send("Unable to authenticate user");
    }
});
 
const PORT = 5000;

app.use("/customer", customerRoutes);
app.use("/", generalRoutes);

app.listen(PORT, () => console.log("Server is running"));

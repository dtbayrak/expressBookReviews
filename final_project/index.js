
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

const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewares.js");

const usersControllers = require("../controllers/users.js");

// SignUp
router.route("/signup")
    .get(usersControllers.renderSignup)
    .post(wrapAsync(usersControllers.signup));


// Login
router.route("/login")
    .get(usersControllers.renderLogin)
    .post( 
        saveRedirectUrl,
        passport.authenticate( "local", {failureRedirect : "/user/login", failureFlash : true} ),
        wrapAsync(usersControllers.login)
    );


// Logout

router.get("/logout", usersControllers.logout);

module.exports = router;
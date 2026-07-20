const express = require('express');
const userRouter = express.Router();
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport')
const {saveRedirectUrl} = require('../middleware.js');
const { signup, signupForm, loginForm, login, logout } = require('../controller/user.js');

userRouter.route("/sign-up").get( signupForm).post((signup));

userRouter.route('/login').get( loginForm).post(saveRedirectUrl,
    passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
}),login);

userRouter.get("/logout", logout);

module.exports = userRouter;
const express = require('express');
const router = express.Router();
const passport = require('passport');

// @desc  Auth With Google
// @route        GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }))

// @desc  Google auth callback
//  @route    GET /auth/google/callback
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/docs' }), (req, res) => {
        // Successful authentication, redirect home.
        res.redirect('/');
    });

module.exports = router;
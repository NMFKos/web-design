const facebookUser = require('./modules/facebook');
const mongoose = require('mongoose');

const facebookAuthDal = {
    registerWithFacebook: async (req, res, oauthUser) => {
        try {
            let user = await facebookUser.findOne({
                id: oauthUser._id
            });

            if (user) {
                req.session.userId = user._id;
                req.session.username = user.name;
            } else {
                const newUser = new facebookUser({
                    id: oauthUser._id,
                    name: oauthUser.displayName,
                    email: oauthUser.emails ? oauthUser.emails[0].value : null, // Facebook might not provide email
                    role: 0
                });
                await newUser.save();
                req.session.userId = newUser._id;
                req.session.username = newUser.name;
            }

            return { userId: req.session.userId, username: req.session.username };
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send('Internal Server Error');
        }
    }
};

module.exports = facebookAuthDal;
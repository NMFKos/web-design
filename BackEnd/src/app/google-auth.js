const googleUser = require('./modules/google');
const mongoose = require('mongoose');

const googleAuthDal = {
    registerWithGoogle: async (req, res, oauthUser) => {
        try {
            let user = await googleUser.findOne({
                id: oauthUser._id
            });

            if (user) {
                req.session.userId = user._id;
                req.session.username = user.name;
            } else {
                const newUser = new googleUser({
                    id: oauthUser._id,
                    name: oauthUser.displayName,
                    email: oauthUser.emails[0].value, // optional - storing it as extra info
                    role: 0,
                    provider: oauthUser.provider
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

module.exports = googleAuthDal;

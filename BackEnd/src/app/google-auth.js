const User = require('./modules/user');
const mongoose = require('mongoose');

const googleAuthDal = {
    registerWithGoogle: async (req, res, oauthUser) => {
        try {
            let user = await User.findOne({
                name: oauthUser.displayName,
                email: oauthUser.emails[0].value,
            });

            if (user) {
                req.session.userId = user._id;
                req.session.username = user.name;
                console.log(user._id);
                console.log(user.name);
            } else {
                const newUser = new User({
                    _id: new mongoose.Types.ObjectId(),
                    name: oauthUser.displayName,
                    email: oauthUser.emails[0].value, // optional - storing it as extra info
                });
                await newUser.save();
                req.session.userId = newUser._id;
                req.session.username = newUser.name;
                console.log(newUser._id);
                console.log(newUser.name);
            }

            return { userId: req.session.userId, username: req.session.username };
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send('Internal Server Error');
        }
    }
};

module.exports = googleAuthDal;

const User = require('./modules/user');
const mongoose = require('mongoose')
const googleAuthDal = {
    registerWithGoogle: async (req, res, oauthUser) => {
      const isUserExists = await User.findOne({
        name: oauthUser.displayName,
        email: oauthUser.emails[0].value,
      })
      .then (async User => {
        if (isUserExists) {
          req.session.userId = User._id;
          req.session.username = User.name;
          res.redirect('/');
        }
        else
        {
          const user = new User({
            _id : new mongoose.Types.ObjectId(),
            name: oauthUser.displayName,
            email: oauthUser.emails[0].value, //optional - storing it as extra info
    
          });
          await user.save();
          res.redirect('/')
        }
      })
      .catch(error => {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
      }
    );
      
      
    },
};

module.exports = googleAuthDal;
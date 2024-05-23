const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const facebookUser = require('../../app/modules/facebook');
passport.use(new FacebookStrategy({
    clientID: '1184422099236541',
    clientSecret: '9bf8fe18f0ec9cd27451d3127d2835f0',
    callbackURL: "http://localhost:8888/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'emails']
  },
  async (accessToken, refreshToken, profile, cb) => {
    try {
      let user = await facebookUser.findOne({ id: profile.id, provider: 'facebook' });
      if (user) {
        return cb(null, profile);
      } else {
        const newUser = new facebookUser({
          id: profile.id,
          name: profile.displayName,
          email: profile.emails ? profile.emails[0].value : null,
          role:0,
          provider: profile.provider
        });
        await newUser.save();
        return cb(null, profile);
      }
    } catch (error) {
      return cb(error, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await facebookUser.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

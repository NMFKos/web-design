const passport = require('passport')
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const googleUser = require('../../app/modules/google')
passport.use(new GoogleStrategy({
    clientID:     '1041321695669-1ee04n7iq28ihn5q1glsb6npcjg9mit9.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: "http://localhost:8888/auth/google/callback",
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await googleUser.findOne({ id: profile.id, provider: 'google' });
      if (user) {
        return done(null, profile);
      } else {
        const newUser = new googleUser({
          id: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          role:0,
          provider: profile.provider
        });
        await newUser.save();
        return done(null, profile);
      }
    } catch (error) {
      return done(error, null);
    }
  }
));

passport.serializeUser((user,done)=>{
    done(null,user)
});

passport.deserializeUser((user,done)=>{
    done(null,user);
})



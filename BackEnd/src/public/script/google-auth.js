const passport = require('passport')
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

passport.use(new GoogleStrategy({
    clientID:     '1041321695669-1ee04n7iq28ihn5q1glsb6npcjg9mit9.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: "http://localhost:8888/auth/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    userProfile = profile;
    done(null, profile)
  }
));

passport.serializeUser((user,done)=>{
    done(null,user)
});

passport.deserializeUser((user,done)=>{
    done(null,user);
})



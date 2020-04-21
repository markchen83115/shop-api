const passport = require('passport');
const crypto = require('crypto');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('./models/user');

//passport + google Oauth
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser( async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
})

passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL
},
async function(accessToken, refreshToken, profile, done) {
  // 透過profile 在DB尋找user資料
  const user = await User.findOne({ email: profile._json.email });
  // 若無user 則新增user
  if (!user) {
      const newUser = new User({
          account: profile._json.email.split('@')[0],
          email: profile._json.email,
          password: crypto.randomBytes(32).toString('base64').substr(0, 10), //亂數產生
          name: profile._json.name,
          birthday: 'na-na-na',
          gender: 'other'
      });
      await newUser.save();
      return done(null, newUser);
  }
  //已有user 則回傳user資料
  return done(null, user);
}
));

module.exports = passport;
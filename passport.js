var passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  FacebookStrategy = require("passport-facebook").Strategy;
var {facebook_contants}=require('./ENV_CONSTANTS');

const {
  findUser,
  register,
  userExist
} = require("./controllers/user-controller");

passport.use(
  new LocalStrategy(function(username, password, done) {
    findUser(username, password)
      .then(result => {
        if (result) {
          done(null, result);
        } else {
          done(null, false, { message: "invalid username/password" });
        }
      })
      .catch(err => {
        console.log("something went wrong", err);
      });
  })
);

passport.use(
  new FacebookStrategy(
    {
      clientID: facebook_contants.CLIENT_ID,
      clientSecret: facebook_contants.CLIENT_SECRET,
      callbackURL: facebook_contants.CALLBACK_URL,
      profileFields: ["id", "email", "name"]
    },
    function(accessToken, refreshToken, profile, done) {
      const { id, email, last_name, first_name } = profile._json;
      const tempUser = {
        username: id,
        name: `${first_name} ${last_name}`,
        email,
        password: "NA"
      };
      userExist(id)
        .then(res => {
          if (!res) {
            return register(tempUser);
          }
        })
        .then(res => {
          done(null, tempUser);
        })
        .catch(err => {
          console.log("internal errror", err);
        });
    }
  )
);
passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.deserializeUser((user, cb) => {
  cb(null, user);
});

module.exports = {
  passport
};

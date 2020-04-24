const passport = require("passport")
const TwitterStrategy = require("passport-twitter").Strategy
const UserTwitter = require("../models/user-twitter-model")

// serialize the user.id to save in the cookie session
// so the browser will remember the user when login
passport.serializeUser((user, done) => {
  done(null, user.id)
})

// deserialize the cookieUserId to user in the database
passport.deserializeUser((id, done) => {
  UserTwitter.findById(id)
    .then(user => {
      done(null, user)
    })
    .catch(e => {
      done(new Error("Failed to deserialize an user"))
    })
})

passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: "/api/auth/twitter/redirect",
      proxy: true,
    },
    async (token, tokenSecret, profile, done) => {
      //console.log(profile)
      const currentUser = await UserTwitter.findOne({
        twitterId: profile._json.id_str
      }).catch(err => console.log(err))

      if (!currentUser) {
        console.log('nuevo usuario')
        const newUser = await new UserTwitter({
          twitterId: profile._json.id_str,
          name: profile._json.name,
          screenName: profile._json.screen_name,
          profileImageUrl: profile._json.profile_image_url,
          token: token,
          tokenSecret: tokenSecret,
        }).save().catch(err => console.log(err))
        if (newUser) {
          console.log('usuario nuevo creado')
          done(null, newUser)
        } else {
          done(new Error("New User don't created"))
        }
      } else {
        console.log('usuario existente')
        currentUser.name = profile._json.name
        currentUser.screenName = profile._json.screen_name
        currentUser.profileImageUrl = profile._json.profile_image_url
        currentUser.token = token
        currentUser.tokenSecret = tokenSecret
        const updateUser = await currentUser.save().catch(err => console.log(err))
        if (updateUser) {
          console.log('usuario existente actualizado')
          done(null, updateUser)
        } else {
          done(new Error("Exists User don't updated"))
        }
      }
    }
  )
)

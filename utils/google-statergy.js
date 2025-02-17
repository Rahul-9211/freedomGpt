import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { GoogleAuthLogin } from '../controller/user.controller.js';
// console.log(process.env.CLIENT_ID);
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "https://free.1stgpt.ai/auth/google/callback"
  },
  GoogleAuthLogin
));

export default passport;

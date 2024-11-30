import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
dotenv.config();
import User from "../model/user.model.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/v1/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Google Profile:", profile); // Debugging: Log the profile data

        // Extract profile information
        const googleId = profile.id;
        const name = profile.displayName;
        const email = profile.emails?.[0]?.value || ""; // Safely access email
        const photo = profile.photos?.[0]?.value || ""; // Safely access profile picture

        // Check if user exists in the database
        let user = await User.findOne({ googleId });

        if (!user) {
          // Create a new user
          user = new User({
            googleId,
            name,
            email,
            profilePictures: photo ? [photo] : [], // Store profile picture in an array
          });
          await user.save();
        } else {
          // Update the profile picture array if the picture is new
          if (photo && !user.profilePictures.includes(photo)) {
            user.profilePictures.push(photo);
            await user.save();
          }
        }

        // Pass the user to Passport's `done` function
        done(null, user);
      } catch (error) {
        console.error("Error in Google strategy:", error);
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id); // Store user ID in the session
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    console.log("Deserialized User:", user); // Debugging: Log the user
    done(null, user);
  } catch (error) {
    console.error("Error deserializing user:", error);
    done(error, null);
  }
});

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profilePictures: [{ type: String }], // Array of profile picture URLs
});

const User = mongoose.model("User", userSchema);
export default User;

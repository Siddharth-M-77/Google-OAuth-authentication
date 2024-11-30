import express from 'express';
import {
  loginWithGoogle,
  googleCallback,
  logout,
  getCurrentUser,
} from '../controller/authController.js';

const router = express.Router();

// Route for logging in with Google
router.get('/google', loginWithGoogle);

// Callback route after Google authentication
router.get('/google/callback', googleCallback);

router.get('/success', (req, res) => {
    res.send('Success! You have logged in.');
  });
// Route to get the current user info
router.get('/user', getCurrentUser);

// Route for logging out
router.get('/logout', logout);

export default router;

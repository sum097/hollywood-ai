import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "./firebase";

const googleProvider = new GoogleAuthProvider();

const GUEST_EMAIL = "guest12345000@gmail.com";
const GUEST_PASSWORD = "12345678";

export async function registerWithEmail(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function loginWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function loginWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

export async function loginAsGuest() {
  return signInWithEmailAndPassword(auth, GUEST_EMAIL, GUEST_PASSWORD);
}

export async function forgotPassword(email: string) {
  return sendPasswordResetEmail(auth, email);
}

export function getFirebaseErrorMessage(code: string): string {
  switch (code) {
    case "auth/invalid-email":
      return "Invalid email address.";
    case "auth/user-not-found":
      return "User not found.";
    case "auth/wrong-password":
      return "Wrong password.";
    case "auth/email-already-in-use":
      return "Email already in use.";
    case "auth/weak-password":
      return "Password is too short (minimum 6 characters).";
    case "auth/invalid-credential":
      return "Invalid email or password.";
    default:
      return "An error occurred. Please try again.";
  }
}
"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { closeModal, switchView } from "@/redux/slices/modalSlice";
import { setUser } from "@/redux/slices/userSlice";
import {
  registerWithEmail,
  loginWithEmail,
  loginWithGoogle,
  loginAsGuest,
  forgotPassword,
  getFirebaseErrorMessage,
} from "@/lib/auth";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaUser } from "react-icons/fa";
import "./AuthModal.css";

export default function AuthModal() {
  const { isOpen, view } = useSelector((state: RootState) => state.modal);
  const dispatch = useDispatch();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState("");

  function resetForm() {
    setEmail("");
    setPassword("");
    setError("");
    setResetMessage("");
  }

  function handleClose() {
    resetForm();
    dispatch(closeModal());
  }

  function handleSwitchView(newView: "login" | "signup" | "forgot") {
    resetForm();
    dispatch(switchView(newView));
  }

  async function handleSuccess(user: any) {
    dispatch(setUser({ uid: user.uid, email: user.email || "" }));
    handleClose();
    router.push("/dashboard");
  }

  async function handleSubmit() {
    setError("");
    setLoading(true);
    try {
      if (view === "signup") {
        const result = await registerWithEmail(email, password);
        await handleSuccess(result.user);
      } else if (view === "login") {
        const result = await loginWithEmail(email, password);
        await handleSuccess(result.user);
      }
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError("");
    setLoading(true);
    try {
      const result = await loginWithGoogle();
      await handleSuccess(result.user);
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  }

  async function handleGuest() {
    setError("");
    setLoading(true);
    try {
      const result = await loginAsGuest();
      await handleSuccess(result.user);
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  }

  async function handleForgot() {
    setError("");
    setLoading(true);
    try {
      await forgotPassword(email);
      setResetMessage("Password reset email sent! Check your inbox.");
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="modal__overlay" onClick={handleClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={handleClose}>✕</button>

        <h2 className="modal__title">
          {view === "signup" && "Sign Up"}
          {view === "login" && "Log In"}
          {view === "forgot" && "Forgot Password"}
        </h2>

        {error && <p className="modal__error">{error}</p>}
        {resetMessage && <p className="modal__success">{resetMessage}</p>}

        {view !== "forgot" && (
          <>
            <button className="modal__social" onClick={handleGoogle} disabled={loading}>
              <FcGoogle size={20} />
              Login with Google
            </button>
            <button className="modal__social" onClick={handleGuest} disabled={loading}>
              <FaUser size={16} />
              Login as Guest
            </button>
            <div className="modal__divider">
              <span>or</span>
            </div>
          </>
        )}

        <div className="modal__form">
          <label className="modal__label">Email Address</label>
          <input
            type="email"
            className="modal__input"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {view !== "forgot" && (
            <>
              <label className="modal__label">Password</label>
              <input
                type="password"
                className="modal__input"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </>
          )}

          {view === "login" && (
            <span
              className="modal__forgot"
              onClick={() => handleSwitchView("forgot")}
            >
              Forgot Password?
            </span>
          )}

          <button
            className="modal__submit"
            onClick={view === "forgot" ? handleForgot : handleSubmit}
            disabled={loading}
          >
            {loading
              ? "Loading..."
              : view === "signup"
              ? "Sign Up"
              : view === "login"
              ? "Log In"
              : "Send Instructions"}
          </button>
        </div>

        {view === "signup" && (
          <p className="modal__switch">
            Already have an account?{" "}
            <span onClick={() => handleSwitchView("login")}>Log In</span>
          </p>
        )}
        {view === "login" && (
          <p className="modal__switch">
            Don&apos;t have an account?{" "}
            <span onClick={() => handleSwitchView("signup")}>Sign Up</span>
          </p>
        )}
        {view === "forgot" && (
          <p className="modal__switch">
            <span onClick={() => handleSwitchView("login")}>Go back to Login</span>
          </p>
        )}
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { closeModal, switchView } from "@/redux/slices/modalSlice";
import { setSubscription, setUser } from "@/redux/slices/userSlice";
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
      dispatch(setSubscription("premium"));
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
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-[9999]"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-xl px-8 py-10 max-w-[400px] w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 bg-transparent border-none text-lg cursor-pointer text-gray-700"
          onClick={handleClose}
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-center mb-5 text-[#1e2227]">
          {view === "signup" && "Sign Up"}
          {view === "login" && "Log In"}
          {view === "forgot" && "Forgot Password"}
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4 bg-red-50 px-3 py-2 rounded-md">
            {error}
          </p>
        )}
        {resetMessage && (
          <p className="text-green-600 text-sm text-center mb-4 bg-green-50 px-3 py-2 rounded-md">
            {resetMessage}
          </p>
        )}

        {view !== "forgot" && (
          <>
            <button
              className="w-full p-3 border border-gray-200 rounded-lg bg-white text-sm font-semibold flex items-center justify-center gap-2.5 cursor-pointer mb-2.5 transition-all duration-200 hover:bg-gray-50 text-[#1e2227]"
              onClick={handleGoogle}
              disabled={loading}
            >
              <FcGoogle size={20} />
              Login with Google
            </button>
            <button
              className="w-full p-3 border border-gray-200 rounded-lg bg-white text-sm font-semibold flex items-center justify-center gap-2.5 cursor-pointer mb-2.5 transition-all duration-200 hover:bg-gray-50 text-[#1e2227]"
              onClick={handleGuest}
              disabled={loading}
            >
              <FaUser size={16} />
              Login as Guest
            </button>
            <div className="flex items-center my-4">
              <div className="flex-1 border-b border-gray-200" />
              <span className="px-3 text-sm text-gray-400">or</span>
              <div className="flex-1 border-b border-gray-200" />
            </div>
          </>
        )}

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-[#1e2227] mb-1">
            Email Address
          </label>
          <input
            type="email"
            className="px-3.5 py-3 border border-gray-200 rounded-lg text-sm mb-3 outline-none focus:border-blue-500 font-[Onest]"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {view !== "forgot" && (
            <>
              <label className="text-sm font-semibold text-[#1e2227] mb-1">
                Password
              </label>
              <input
                type="password"
                className="px-3.5 py-3 border border-gray-200 rounded-lg text-sm mb-3 outline-none focus:border-blue-500 font-[Onest]"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </>
          )}

          {view === "login" && (
            <span
              className="text-sm text-blue-500 cursor-pointer text-right mb-4 hover:underline"
              onClick={() => handleSwitchView("forgot")}
            >
              Forgot Password?
            </span>
          )}

          <button
            className="py-3.5 bg-[#2b2d42] text-white border-none rounded-3xl text-[15px] font-semibold cursor-pointer transition-all duration-200 hover:bg-[#1a1b2e] disabled:opacity-60 disabled:cursor-not-allowed mt-1"
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
          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{" "}
            <span
              className="text-blue-500 cursor-pointer font-semibold hover:underline"
              onClick={() => handleSwitchView("login")}
            >
              Log In
            </span>
          </p>
        )}
        {view === "login" && (
          <p className="text-center text-sm text-gray-500 mt-5">
            Don&apos;t have an account?{" "}
            <span
              className="text-blue-500 cursor-pointer font-semibold hover:underline"
              onClick={() => handleSwitchView("signup")}
            >
              Sign Up
            </span>
          </p>
        )}
        {view === "forgot" && (
          <p className="text-center text-sm text-gray-500 mt-5">
            <span
              className="text-blue-500 cursor-pointer font-semibold hover:underline"
              onClick={() => handleSwitchView("login")}
            >
              Go back to Login
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

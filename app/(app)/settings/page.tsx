"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { openModal } from "@/redux/slices/modalSlice";
import { setSubscription } from "@/redux/slices/userSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { Suspense } from "react";

function SettingsContent() {
  const { isLoggedIn, email, subscriptionPlan, uid } = useSelector(
    (state: RootState) => state.user,
  );
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (sessionId && uid) {
      async function verifySession() {
        try {
          const res = await fetch("/api/verify-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId }),
          });
          const data = await res.json();
          if (data.plan) {
            await setDoc(doc(db, "users", uid!, "subscription", "status"), {
              plan: data.plan,
            });
            dispatch(setSubscription(data.plan));
          }
          // Clear the URL param so it doesn't re-verify
          router.replace("/settings");
        } catch (err) {
          console.error(err);
        }
      }
      verifySession();
    }
  }, [searchParams, uid, dispatch, router]);

  if (loading) {
    return (
      <div className="max-w-[1200px] min-[1400px]:mx-auto px-6 py-8 max-[980px]:px-4 animate-pulse">
        <h1 className="text-3xl font-bold text-[#1e2227] mb-8 pb-6 border-b border-gray-200">
          Settings
        </h1>
        <div className="mb-8 pb-6 border-b border-gray-200">
          <div className="h-5 bg-gray-200 rounded w-[180px] mb-3" />
          <div className="h-4 bg-gray-200 rounded w-[60px]" />
        </div>
        <div className="pb-6 border-b border-gray-200">
          <div className="h-5 bg-gray-200 rounded w-[180px] mb-3" />
          <div className="h-4 bg-gray-200 rounded w-[60px]" />
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="max-w-[1200px] min-[1400px]:mx-auto px-6 py-8 max-[980px]:px-4">
        <h1 className="text-3xl font-bold text-[#1e2227] mb-8 pb-6 border-b border-gray-200">
          Settings
        </h1>
        <div className="flex flex-col items-center">
          <img
            src="/assets/login.webp"
            alt="Sign in"
            className="w-[500px] h-auto"
          />
          <h2 className="text-2xl font-bold text-[#1e2227] mb-6">
            Sign in to see your account settings
          </h2>
          <button
            onClick={() => dispatch(openModal("login"))}
            className="bg-[#4b0082] text-white px-10 py-3.5 rounded-lg text-base font-semibold cursor-pointer hover:bg-[#3a006b] transition-colors w-[200px]"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  function getPlanDisplay() {
    switch (subscriptionPlan) {
      case "premium":
        return "Premium";
      case "vip+":
        return "VIP+";
      default:
        return "Basic";
    }
  }

  return (
    <div className="max-w-[1200px] min-[1400px]:mx-auto px-6 py-8 max-[980px]:px-4">
      <h1 className="text-3xl font-bold text-[#1e2227] mb-8 pb-6 border-b border-gray-200">
        Settings
      </h1>

      <div className="mb-8 pb-6 border-b border-gray-200">
        <h3 className="text-lg font-bold text-[#1e2227] mb-2">
          Your Subscription Plan
        </h3>
        <p className="text-base mb-3">{getPlanDisplay()}</p>
        {subscriptionPlan === "basic" && (
          <button
            onClick={() => router.push("/plans")}
            className="bg-[#4b0082] text-white px-6 py-2.5 rounded-lg text-sm font-semibold cursor-pointer hover:bg-[#3a006b] transition-colors flex items-center gap-2"
          >
            Upgrade ⚡
          </button>
        )}
      </div>

      <div>
        <h3 className="text-lg font-bold text-[#1e2227] mb-2">Email</h3>
        <p className="text-base pb-6 border-b border-gray-200">{email}</p>
      </div>
    </div>
  );
}

export default function Settings() {
  return (
    <Suspense fallback={<div className="flex justify-center py-16"><div className="w-10 h-10 border-4 border-gray-200 border-t-[#4b0082] rounded-full animate-spin" /></div>}>
      <SettingsContent />
    </Suspense>
  );
}
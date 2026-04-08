"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useDispatch } from "react-redux";
import { setUser, clearUser, setSubscription } from "@/redux/slices/userSlice";

const GUEST_EMAIL = "guest12345000@gmail.com";

export default function AuthListener() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser({ uid: user.uid, email: user.email || "" }));
        if (user.email === GUEST_EMAIL) {
          dispatch(setSubscription("premium"));
        }
      } else {
        dispatch(clearUser());
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  return null;
}
"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { openModal } from "@/redux/slices/modalSlice";
import { setSubscription } from "@/redux/slices/userSlice";
import { BsCheck } from "react-icons/bs";
import { FiPlus, FiMinus } from "react-icons/fi";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useSearchParams } from "next/navigation";

export default function Plans() {
  const { isLoggedIn, subscriptionPlan, uid, email } = useSelector(
    (state: RootState) => state.user,
  );
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Verify session after redirect from Stripe
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
        } catch (err) {
          console.error(err);
        }
      }
      verifySession();
    }
  }, [searchParams, uid, dispatch]);

  async function handleCheckout(priceId: string) {
    if (!isLoggedIn) {
      dispatch(openModal("login"));
      return;
    }
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, uid, email }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCheckoutLoading(false);
    }
  }

  const plans = [
    {
      price: 19,
      cycle: "Monthly",
      name: "Premium",
      priceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID || "",
      features: [
        "Premium Support",
        "Access 100+ Summaries",
        "Higher Quality Audio",
        "License For Commercial Use",
        "2 Supported Devices",
      ],
    },
    {
      price: 190,
      cycle: "Yearly",
      name: "VIP+",
      priceId: process.env.NEXT_PUBLIC_STRIPE_VIP_PRICE_ID || "",
      features: [
        "2 Months Free",
        "Access 100+ Summaries",
        "Highest Quality Audio",
        "License For Commercial Use",
        "3 Supported Devices",
      ],
    },
  ];

  const faqs = [
    {
      question: "What is Hollywood AI?",
      answer: "Hollywood AI is an all-in-one platform that lets you enjoy high-quality summaries of your favourite movies in minutes using AI. You can read or listen to summaries of the world's best movies.",
    },
    {
      question: "How much does Hollywood AI cost?",
      answer: "Hollywood AI offers a free Basic plan with limited access. Our Premium plan is $19/month and our VIP+ plan is $190/year, which includes 2 months free.",
    },
    {
      question: "What can I watch on Hollywood AI",
      answer: "Hollywood AI features summaries of the world's most popular movies across all genres including action, drama, sci-fi, fantasy, and more.",
    },
  ];

  if (loading) {
    return (
      <div className="max-w-[1200px] min-[1400px]:mx-auto px-6 py-8 max-[980px]:px-4 animate-pulse">
        <div className="mb-6 pb-6 border-b border-gray-200">
          <div className="h-8 bg-gray-200 rounded w-[120px] mb-3" />
          <div className="h-4 bg-gray-200 rounded w-[350px]" />
        </div>
        <div className="h-7 bg-gray-200 rounded w-[220px] mb-6" />
        <div className="grid grid-cols-2 max-[768px]:grid-cols-1 gap-6 mb-12">
          {[1, 2].map((i) => (
            <div key={i} className="border border-gray-200 rounded-2xl p-8">
              <div className="h-16 bg-gray-200 rounded w-[180px] mb-2" />
              <div className="h-4 bg-gray-200 rounded w-[80px] mb-6" />
              <div className="flex flex-col gap-4 mb-8">
                <div className="h-4 bg-gray-200 rounded w-[200px]" />
                <div className="h-4 bg-gray-200 rounded w-[220px]" />
                <div className="h-4 bg-gray-200 rounded w-[180px]" />
                <div className="h-4 bg-gray-200 rounded w-[240px]" />
                <div className="h-4 bg-gray-200 rounded w-[170px]" />
              </div>
              <div className="h-12 bg-gray-200 rounded-full w-full" />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-gray-200 rounded-2xl px-8 py-6">
              <div className="h-5 bg-gray-200 rounded w-[280px]" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] min-[1400px]:mx-auto px-6 py-8 max-[980px]:px-4">
      <div className="mb-6 pb-6 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-[#1e2227] mb-2">Plans</h1>
        <p className="text-sm text-gray-400">
          Get unlimited access to our extensive library of movie summaries.
        </p>
      </div>

      <h2 className="text-2xl font-bold text-[#1e2227] mb-6">Subscription Plans:</h2>

      <div className="grid grid-cols-2 max-[768px]:grid-cols-1 gap-6 mb-12">
        {plans.map((plan) => (
          <div key={plan.name} className="border border-gray-200 rounded-2xl p-8 flex flex-col">
            <div className="mb-1">
              <span className="text-sm font-semibold text-[#1e2227] align-top">$</span>
              <span className="text-[64px] font-bold text-[#1e2227] leading-none">{plan.price}</span>
              <span className="text-base font-semibold text-[#1e2227] ml-1">{plan.cycle}</span>
            </div>
            <p className="text-sm text-gray-400 mb-6">{plan.name}</p>

            <ul className="flex flex-col gap-4 mb-8 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-[15px] text-[#1e2227]">
                  <BsCheck size={20} className="text-[#4b0082] flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleCheckout(plan.priceId)}
              disabled={checkoutLoading}
              className="w-full py-4 rounded-full bg-[#4b0082] text-white text-base font-semibold cursor-pointer hover:bg-[#3a006b] transition-colors border-none disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {checkoutLoading ? "Loading..." : "Choose plan"}
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-gray-200 rounded-2xl overflow-hidden">
            <button
              onClick={() => setOpenFaq(openFaq === index ? null : index)}
              className="w-full flex items-center justify-between px-8 py-6 text-left bg-white cursor-pointer border-none hover:bg-gray-50 transition-colors"
            >
              <span className="text-lg font-bold text-[#1e2227]">{faq.question}</span>
              {openFaq === index ? (
                <FiMinus size={20} className="text-gray-400 flex-shrink-0" />
              ) : (
                <FiPlus size={20} className="text-gray-400 flex-shrink-0" />
              )}
            </button>
            <div className={`grid transition-all duration-300 ease-in-out ${openFaq === index ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
              <div className="overflow-hidden">
                <div className="px-8 pb-6">
                  <p className="text-[15px] text-[#394456] leading-7">{faq.answer}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
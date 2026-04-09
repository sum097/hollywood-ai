"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { BsCheck } from "react-icons/bs";
import { FiPlus, FiMinus } from "react-icons/fi";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Plans() {
  const { isLoggedIn, subscriptionPlan } = useSelector(
    (state: RootState) => state.user,
  );

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

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
            <div
              key={i}
              className="border border-gray-200 rounded-2xl px-8 py-6"
            >
              <div className="h-5 bg-gray-200 rounded w-[280px]" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const plans = [
    {
      price: 19,
      cycle: "Monthly",
      name: "Premium",
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
      answer:
        "HollywoodAI is designed to help you get high-quality summaries of your favourite movies instantly, without breaking a sweat. With our intuitive interface and powerful features, you can easily digest any movie in just minutes instead of hours.",
    },
    {
      question: "How much does Hollywood AI cost?",
      answer:
        "Get summaries of your favourite movies on your smartphone, tablet or laptop, all for one fixed monthly or yearly fee. Plans range from $19 per month to $190 per year. No extra costs, no contracts.",
    },
    {
      question: "What can I watch on Hollywood AI",
      answer:
        "Hollywood AI has an extensive library of feature films. Watch as much as you want, at any time that you want.",
    },
  ];

  return (
    <div className="max-w-[1200px] min-[1400px]:mx-auto px-6 py-8 max-[980px]:px-4">
      <div className="mb-6 pb-6 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-[#1e2227] mb-2">Plans</h1>
        <p className="text-sm text-gray-400">
          Get unlimited access to our extensive library of movie summaries.
        </p>
      </div>

      <h2 className="text-2xl font-bold text-[#1e2227] mb-6">
        Subscription Plans:
      </h2>

      {/* Plans grid */}
      <div className="grid grid-cols-2 max-[768px]:grid-cols-1 gap-6 mb-12">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="border border-gray-200 rounded-2xl p-8 flex flex-col"
          >
            <div className="mb-1">
              <span className="text-sm font-semibold text-[#1e2227] align-top">
                $
              </span>
              <span className="text-[64px] font-bold text-[#1e2227] leading-none">
                {plan.price}
              </span>
              <span className="text-base font-semibold text-[#1e2227] ml-1">
                {plan.cycle}
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-6">{plan.name}</p>

            <ul className="flex flex-col gap-4 mb-8 flex-1">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-3 text-[15px] text-[#1e2227]"
                >
                  <BsCheck size={20} className="text-[#4b0082] flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <button className="w-full py-4 rounded-full bg-[#4b0082] text-white text-base font-semibold cursor-pointer hover:bg-[#3a006b] transition-colors border-none">
              Choose plan
            </button>
          </div>
        ))}
      </div>

      {/* FAQ section */}
      <div className="flex flex-col gap-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-2xl overflow-hidden"
          >
            <button
              onClick={() => setOpenFaq(openFaq === index ? null : index)}
              className="w-full flex items-center justify-between px-8 py-6 text-left bg-white cursor-pointer border-none hover:bg-gray-50 transition-colors"
            >
              <span className="text-lg font-medium text-[#1e2227]">
                {faq.question}
              </span>
              {openFaq === index ? (
                <FiMinus size={20} className="text-gray-400 flex-shrink-0" />
              ) : (
                <FiPlus size={20} className="text-gray-400 flex-shrink-0" />
              )}
            </button>
            <div
              className={`grid transition-all duration-300 ease-in-out ${openFaq === index ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
            >
              <div className="overflow-hidden">
                <div className="px-8 pb-6">
                  <p className="text-[15px] text-[#394456] leading-7">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { auth } from "@/lib/firebase";
import { openModal } from "@/redux/slices/modalSlice";
import { clearUser } from "@/redux/slices/userSlice";
import { RootState } from "@/redux/store";
import { signOut } from "firebase/auth";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  AiOutlineHeart,
  AiOutlineHome,
  AiOutlineLogin,
  AiOutlineLogout,
  AiOutlineQuestionCircle,
  AiOutlineSearch,
  AiOutlineSetting,
} from "react-icons/ai";
import { HiOutlineTrendingUp } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";

export default function Sidebar() {
  const { isLoggedIn } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    await signOut(auth);
    dispatch(clearUser());
    router.push("/");
  }

  function handleLogin() {
    dispatch(openModal("login"));
  }

  const linkBase =
    "flex items-center gap-3.5 px-6 py-3.5 text-sm font-medium text-gray-600 transition-all duration-200 cursor-pointer w-full text-left";
  const linkActive = "bg-gray-200 font-bold";
  const linkDisabled = "cursor-not-allowed opacity-40 hover:bg-transparent";

  return (
    <aside className="w-[250px] min-h-screen bg-[#f9f9fb] border-r border-gray-200 flex flex-col justify-between py-5 sticky top-0 h-screen">
      <div>
        <div className="px-5 mb-8">
          <img src="/assets/logo-dark.png" alt="HollywoodAI" className="h-9" />
        </div>
        <div className="flex flex-col">
          <a
            className={`${linkBase} hover:bg-gray-200 ${pathname === "/dashboard" ? linkActive : ""}`}
            onClick={() => router.push("/dashboard")}
          >
            <AiOutlineHome size={20} />
            Dashboard
          </a>

          <a
            className={`${linkBase} hover:bg-gray-200 ${pathname === "/favourites" ? linkActive : ""}`}
            onClick={() => router.push("/favourites")}
          >
            <AiOutlineHeart size={20} />
            Favourites
          </a>
          <a className={`${linkBase} ${linkDisabled}`}>
            <AiOutlineSearch size={20} />
            Search
          </a>
          <a className={`${linkBase} ${linkDisabled}`}>
            <HiOutlineTrendingUp size={20} />
            Trending
          </a>

          <a
            className={`${linkBase} hover:bg-gray-200 ${pathname === "/settings" ? linkActive : ""}`}
            onClick={() => router.push("/settings")}
          >
            <AiOutlineSetting size={20} />
            Settings
          </a>
          <a className={`${linkBase} ${linkDisabled}`}>
            <AiOutlineQuestionCircle size={20} />
            Help & Support
          </a>
        </div>
      </div>
      <div className="border-t border-gray-200 pt-3">
        {isLoggedIn ? (
          <a className={`${linkBase} hover:bg-gray-200`} onClick={handleLogout}>
            <AiOutlineLogout size={20} />
            Logout
          </a>
        ) : (
          <a className={`${linkBase} hover:bg-gray-200`} onClick={handleLogin}>
            <AiOutlineLogin size={20} />
            Login
          </a>
        )}
      </div>
    </aside>
  );
}

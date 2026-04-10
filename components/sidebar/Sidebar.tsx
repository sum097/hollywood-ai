"use client";

import { auth } from "@/lib/firebase";
import { openModal } from "@/redux/slices/modalSlice";
import { clearUser } from "@/redux/slices/userSlice";
import { RootState } from "@/redux/store";
import { signOut } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { AiOutlineSearch } from "react-icons/ai";
import { BsGrid, BsBookmark, BsQuestionCircle } from "react-icons/bs";
import { FiSettings, FiTrendingUp, FiLogOut, FiLogIn } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

export default function Sidebar() {
  const { isLoggedIn } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    await signOut(auth);
    dispatch(clearUser());
  }

  function handleLogin() {
    dispatch(openModal("login"));
  }

  const linkBase = "flex items-center gap-3 ml-2 mr-3 px-3 py-2.5 text-[13px] text-[#394456] transition-all duration-200 cursor-pointer hover:text-[#4B0082] hover:bg-[#f5f0fc] rounded-lg";
  const linkActive = "font-semibold text-[#1e2227]";
  const linkDisabled = "!cursor-not-allowed";

  return (
    <div className="w-[250px] min-h-screen bg-white border-r border-gray-200 flex flex-col justify-between sticky top-0 h-screen overflow-y-auto">
      <div>
        <div className="px-5 py-5 pb-6">
          <img src="/assets/logo-dark.png" alt="HollywoodAI" className="h-9" />
        </div>

        <div className="px-5 pb-2">
          <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Links</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <a className={`${linkBase} ${pathname === "/dashboard" ? linkActive : ""}`} onClick={() => router.push("/dashboard")}>
            <BsGrid size={18} />
            Dashboard
          </a>
          <a className={`${linkBase} ${pathname === "/favourites" ? linkActive : ""}`} onClick={() => router.push("/favourites")}>
            <BsBookmark size={18} />
            Favourites
          </a>
          <a className={`${linkBase} ${linkDisabled}`}>
            <AiOutlineSearch size={18} />
            Search
          </a>
          <a className={`${linkBase} ${linkDisabled}`}>
            <FiTrendingUp size={18} />
            Trending
          </a>
        </div>

        <div className="px-5 pt-6 pb-2">
          <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Extras</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <a className={`${linkBase} ${linkDisabled}`}>
            <BsQuestionCircle size={18} />
            Help & Support
          </a>
          <a className={`${linkBase} ${pathname === "/settings" ? linkActive : ""}`} onClick={() => router.push("/settings")}>
            <FiSettings size={18} />
            Settings
          </a>
          {isLoggedIn ? (
            <a className={`${linkBase}`} onClick={handleLogout}>
              <FiLogOut size={18} />
              Log out
            </a>
          ) : (
            <a className={`${linkBase}`} onClick={handleLogin}>
              <FiLogIn size={18} />
              Login
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
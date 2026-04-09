"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import SearchBar from "@/components/search/SearchBar";
import { IoMenu } from "react-icons/io5";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Desktop sidebar */}
      <div className="hidden min-[768px]:block">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      <div className={`fixed inset-0 z-100 min-[768px]:hidden transition-opacity duration-300 ${sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} onClick={() => setSidebarOpen(false)}>
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <div className={`fixed top-0 left-0 h-full z-100 min-[768px]:hidden transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`} onClick={(e) => e.stopPropagation()}>
        <Sidebar />
      </div>

      <div style={{ flex: 1 }}>
        <div className="flex items-center">
          <div className="flex-1">
            <SearchBar />
          </div>
          <button className="min-[768px]:hidden p-4 mr-2 cursor-pointer hover:opacity-70 transition-opacity" onClick={() => setSidebarOpen(true)}>
            <IoMenu size={28} />
          </button>
        </div>
        <main>{children}</main>
      </div>
    </div>
  );
}
import Sidebar from "@/components/sidebar/Sidebar";
import SearchBar from "@/components/search/SearchBar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <SearchBar />
        <main>{children}</main>
      </div>
    </div>
  );
}
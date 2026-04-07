import "./globals.css";
import ReduxProvider from "@/redux/provider";
import AuthModal from "@/components/auth/AuthModal";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <AuthModal />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
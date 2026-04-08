import "./globals.css";
import ReduxProvider from "@/redux/provider";
import AuthModal from "@/components/auth/AuthModal";
import AuthListener from "@/components/auth/AuthListener";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Onest:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ReduxProvider>
          <AuthListener />
          <AuthModal />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
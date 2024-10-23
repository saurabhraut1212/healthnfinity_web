import localFont from "next/font/local";
import Navbar from "../components/Navbar";
import "./globals.css";
import { Toaster } from "react-hot-toast"; // Import Toaster
import AuthProvider from "../context/AuthContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Log Application",
  description: "Logging application for all",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Navbar />
          <Toaster />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

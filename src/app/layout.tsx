import type { Metadata } from "next";
import { Great_Vibes, Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"] });
const greatVibes = Great_Vibes({ subsets: ["latin"], weight: ["400"] });

export const metadata: Metadata = {
  title: "Wedding Invitation",
  description: "You are invited to our wedding!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${montserrat.className} min-h-screen bg-[#FDF5F2]`}>
        <style dangerouslySetInnerHTML={{__html: `
          .font-script {
            font-family: ${greatVibes.style.fontFamily}, cursive;
          }
          .font-sans {
            font-family: ${montserrat.style.fontFamily}, sans-serif;
          }
        `}} />
        {children}
      </body>
    </html>
  );
}

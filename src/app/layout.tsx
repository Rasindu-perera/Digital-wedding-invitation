import type { Metadata } from "next";
import { Great_Vibes, Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"] });
const greatVibes = Great_Vibes({ subsets: ["latin"], weight: ["400"], variable: '--font-script' });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "600"], variable: '--font-serif' });

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
      <body className={`${montserrat.className} ${playfair.variable} ${greatVibes.variable} min-h-screen bg-[#FDF5F2]`}>
        <style dangerouslySetInnerHTML={{__html: `
          .font-script {
            font-family: var(--font-script), ${greatVibes.style.fontFamily}, cursive;
          }
          .font-serif {
            font-family: var(--font-serif), ${playfair.style.fontFamily}, serif;
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

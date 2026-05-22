import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "twinmatch · AI가 먼저 만나보는 소개팅",
  description:
    "내 말투와 성격을 그대로 복제한 AI가 상대방 AI와 먼저 20턴을 나눠보고, 진짜 케미가 맞을 때 사람을 연결해드립니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geistSans.variable} antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}

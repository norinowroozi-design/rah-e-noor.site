import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "راهِ نور | سفری به سوی شناخت خداوند",
  description: "همراهی برای تدبر در قرآن، آشنایی با اهل‌بیت، اخلاق، دانش و رشد معنوی.",
  applicationName: "راه نور"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}

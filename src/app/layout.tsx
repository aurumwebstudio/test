import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Studio Noir | Salon fryzjerski",
  description:
    "Testowa strona premium salonu fryzjerskiego z formularzem zapytania o termin dla Witrynext Booking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}

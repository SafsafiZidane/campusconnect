import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "CampusConnect - Entraide & Partage entre Étudiants",
  description:
    "Plateforme académique d'entraide entre étudiants : publiez vos demandes d'aide, proposez vos compétences et organisez des séances de révision.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="h-full">
      <body className="flex flex-col min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-indigo-500 selection:text-white">
        <Navbar />
        <main className="flex-1 pb-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

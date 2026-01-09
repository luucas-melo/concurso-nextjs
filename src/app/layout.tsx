import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ConcursoTrack - Gerencie seus concursos públicos",
  description:
    "Organize sua jornada de concurseiro. Gerencie inscrições, acompanhe prazos e nunca perca uma oportunidade.",
  keywords: [
    "concurso público",
    "concurseiro",
    "gestão de concursos",
    "organização",
    "prazos",
  ],
  authors: [{ name: "ConcursoTrack" }],
  openGraph: {
    title: "ConcursoTrack - Gerencie seus concursos públicos",
    description:
      "Organize sua jornada de concurseiro com a melhor ferramenta de gestão.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${outfit.variable} font-sans antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}

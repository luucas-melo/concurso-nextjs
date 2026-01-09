import type { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Footer from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "ConcursoTrack - Gerencie seus concursos públicos",
  description: "Organize sua jornada de concurseiro. Gerencie inscrições, acompanhe prazos, documentos e nunca perca uma oportunidade.",
  keywords: ["concurso público", "concurseiro", "gestão de concursos", "organização", "prazos", "inscrições"],
  openGraph: {
    title: "ConcursoTrack - Gerencie seus concursos públicos",
    description: "Organize sua jornada de concurseiro com a melhor ferramenta de gestão.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <Footer />
    </div>
  );
}

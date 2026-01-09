import type { Metadata } from "next";
import { getUserExams } from "@/lib/actions/exams";
import ExamListClient from "@/components/dashboard/ExamListClient";

export const metadata: Metadata = {
  title: "Meus Concursos - ConcursoTrack",
  description: "Lista de todos os seus concursos públicos",
};

export default async function ExamsPage() {
  // Fetch exams directly in Server Component (no useEffect!)
  const { data: exams, error } = await getUserExams();

  if (error) {
    return (
      <div className="glass-card rounded-2xl p-12 text-center">
        <h3 className="font-display font-semibold text-lg mb-2 text-destructive">
          Erro ao carregar concursos
        </h3>
        <p className="text-muted-foreground">
          {error}
        </p>
      </div>
    );
  }

  // Pass data to Client Component for filtering
  return <ExamListClient exams={exams || []} />;
}

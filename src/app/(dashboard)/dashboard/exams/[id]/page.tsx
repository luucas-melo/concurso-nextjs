import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getExamById } from "@/lib/actions/exams";
import ExamEditForm from "@/components/dashboard/ExamEditForm";

export const metadata: Metadata = {
  title: "Editar Concurso - ConcursoTrack",
  description: "Editar informações do concurso",
};

interface ExamDetailPageProps {
  params: {
    id: string;
  };
}

export default async function ExamDetailPage({ params }: ExamDetailPageProps) {
  const { id } = params;
  
  // Fetch exam data directly in Server Component
  const { data: exam, error } = await getExamById(id);

  if (error || !exam) {
    notFound();
  }

  // Pass data to Client Component for editing
  return <ExamEditForm exam={exam} />;
}

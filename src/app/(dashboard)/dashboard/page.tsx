import type { Metadata } from "next";
import { getUserExams } from "@/lib/actions/exams";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Calendar, CheckCircle } from "lucide-react";
import { STATUS_LABELS } from "@/types/exam";

export const metadata: Metadata = {
  title: "Dashboard - ConcursoTrack",
  description: "Visão geral dos seus concursos",
};

export default async function DashboardPage() {
  // Fetch exams directly in Server Component (no useEffect needed!)
  const { data: exams } = await getUserExams();

  const totalExams = exams?.length || 0;
  const activeExams =
    exams?.filter(
      (exam) => exam.status === "waiting" || exam.status === "registered"
    ).length || 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo! Aqui está um resumo dos seus concursos.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total de Concursos"
          value={totalExams}
          icon={<FileText className="w-5 h-5" />}
          description="Todos os concursos"
        />
        <StatCard
          title="Concursos Ativos"
          value={activeExams}
          icon={<Calendar className="w-5 h-5" />}
          description="Em andamento"
        />
        <StatCard
          title="Aguardando Inscrição"
          value={exams?.filter((e) => e.status === "waiting").length || 0}
          icon={<CheckCircle className="w-5 h-5" />}
          description="A fazer"
        />
        <StatCard
          title="Inscritos"
          value={exams?.filter((e) => e.status === "registered").length || 0}
          icon={<CheckCircle className="w-5 h-5" />}
          description="Confirmados"
        />
      </div>

      {/* Quick Actions */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="font-display text-xl font-semibold mb-4">
          Ações Rápidas
        </h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/dashboard/exams/new">
            <Button variant="hero" size="lg">
              <Plus className="w-5 h-5" />
              Adicionar Concurso
            </Button>
          </Link>
          <Link href="/dashboard/exams">
            <Button variant="outline" size="lg">
              <FileText className="w-5 h-5" />
              Ver Todos os Concursos
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Exams */}
      {exams && exams.length > 0 ? (
        <div className="glass-card rounded-2xl p-6">
          <h2 className="font-display text-xl font-semibold mb-4">
            Concursos Recentes
          </h2>
          <div className="space-y-3">
            {exams.slice(0, 5).map((exam) => (
              <Link
                key={exam.id}
                href={`/dashboard/exams/${exam.id}`}
                className="block p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold mb-1">{exam.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {exam.publicBody} - {exam.position}
                    </p>
                  </div>
                  <span className={`status-badge status-${exam.status}`}>
                    {STATUS_LABELS[exam.status]}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-12 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-display text-xl font-semibold mb-2">
            Nenhum concurso cadastrado
          </h3>
          <p className="text-muted-foreground mb-6">
            Comece adicionando seu primeiro concurso para organizar sua jornada.
          </p>
          <Link href="/dashboard/exams/new">
            <Button variant="hero" size="lg">
              <Plus className="w-5 h-5" />
              Adicionar Primeiro Concurso
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
}

function StatCard({ title, value, icon, description }: StatCardProps) {
  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-2">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">{icon}</div>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-1">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  );
}

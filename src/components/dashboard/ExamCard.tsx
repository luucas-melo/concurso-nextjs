import { Exam, STATUS_LABELS } from "@/types/exam";
import { Calendar, MapPin, Building2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { format, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ExamCardProps {
  exam: Exam;
}

const ExamCard = ({ exam }: ExamCardProps) => {
  const getStatusClass = (status: Exam["status"]) => {
    const classes = {
      waiting: "status-waiting",
      registered: "status-registered",
      taken: "status-taken",
      approved: "status-approved",
      rejected: "status-rejected",
    };
    return classes[status];
  };

  const getNextImportantDate = () => {
    const now = new Date();
    const dates = [
      {
        key: "registrationDeadline",
        label: "Inscrição encerra",
        date: exam.registrationDeadline,
      },
      {
        key: "paymentDeadline",
        label: "Pagamento vence",
        date: exam.paymentDeadline,
      },
      { key: "examDate", label: "Data da prova", date: exam.examDate },
      { key: "resultsDate", label: "Resultado", date: exam.resultsDate },
    ];

    const futureDate = dates.find((d) => d.date && d.date > now);
    if (!futureDate?.date) return null;

    const daysLeft = differenceInDays(futureDate.date, now);
    return { ...futureDate, daysLeft };
  };

  const nextDate = getNextImportantDate();

  const completedDocs = exam.documents?.filter((d) => d.isCompleted).length;
  const totalDocs = exam.documents.length;
  const docsProgress = totalDocs > 0 ? (completedDocs / totalDocs) * 100 : 0;

  return (
    <Link href={`/dashboard/exams/${exam.id}`}>
      <div className="glass-card rounded-2xl p-6 hover-lift cursor-pointer group">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={cn("status-badge", getStatusClass(exam.status))}>
                {STATUS_LABELS[exam.status]}
              </span>
            </div>
            <h3 className="font-display font-semibold text-lg group-hover:text-primary transition-colors">
              {exam.name}
            </h3>
            <p className="text-muted-foreground text-sm">{exam.position}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="w-4 h-4" />
            <span>{exam.publicBody}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>
              {exam.city}, {exam.state}
            </span>
          </div>
        </div>

        {nextDate && (
          <div className="p-3 rounded-xl bg-secondary/50 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{nextDate.label}</span>
              </div>
              <span
                className={cn(
                  "text-sm font-semibold",
                  nextDate.daysLeft <= 3
                    ? "text-destructive"
                    : nextDate.daysLeft <= 7
                    ? "text-warning"
                    : "text-foreground"
                )}
              >
                {nextDate.daysLeft === 0
                  ? "Hoje!"
                  : nextDate.daysLeft === 1
                  ? "Amanhã"
                  : `${nextDate.daysLeft} dias`}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {format(nextDate.date!, "dd 'de' MMMM 'de' yyyy", {
                locale: ptBR,
              })}
            </p>
          </div>
        )}

        {/* Documents Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Documentos</span>
            <span className="font-medium">
              {completedDocs}/{totalDocs}
            </span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full gradient-success rounded-full transition-all duration-300"
              style={{ width: `${docsProgress}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ExamCard;

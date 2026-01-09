import { Exam } from "@/types/exam";
import { Calendar, AlertTriangle, Clock } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface UpcomingDeadlinesProps {
  exams: Exam[];
}

interface DeadlineItem {
  examId: string;
  examName: string;
  type: string;
  date: Date;
  daysLeft: number;
}

const UpcomingDeadlines = ({ exams }: UpcomingDeadlinesProps) => {
  const getDeadlines = (): DeadlineItem[] => {
    const now = new Date();
    const deadlines: DeadlineItem[] = [];

    exams.forEach(exam => {
      const dateTypes = [
        { key: 'registrationDeadline', label: 'Fim das inscrições' },
        { key: 'paymentDeadline', label: 'Prazo de pagamento' },
        { key: 'examDate', label: 'Data da prova' },
        { key: 'resultsDate', label: 'Divulgação do resultado' },
      ];

      dateTypes.forEach(({ key, label }) => {
        const date = exam.dates[key as keyof typeof exam.dates];
        if (date && date > now) {
          const daysLeft = differenceInDays(date, now);
          if (daysLeft <= 30) {
            deadlines.push({
              examId: exam.id,
              examName: exam.name,
              type: label,
              date,
              daysLeft,
            });
          }
        }
      });
    });

    return deadlines.sort((a, b) => a.daysLeft - b.daysLeft).slice(0, 5);
  };

  const deadlines = getDeadlines();

  const getUrgencyIcon = (daysLeft: number) => {
    if (daysLeft <= 3) return <AlertTriangle className="w-4 h-4 text-destructive" />;
    if (daysLeft <= 7) return <Clock className="w-4 h-4 text-warning" />;
    return <Calendar className="w-4 h-4 text-info" />;
  };

  const getUrgencyBg = (daysLeft: number) => {
    if (daysLeft <= 3) return 'bg-destructive/10 border-destructive/20';
    if (daysLeft <= 7) return 'bg-warning/10 border-warning/20';
    return 'bg-info/10 border-info/20';
  };

  if (deadlines.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Próximos Prazos
        </h3>
        <p className="text-muted-foreground text-sm text-center py-8">
          Nenhum prazo nos próximos 30 dias
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-primary" />
        Próximos Prazos
      </h3>
      <div className="space-y-3">
        {deadlines.map((deadline, index) => (
          <div
            key={`${deadline.examId}-${deadline.type}-${index}`}
            className={cn(
              "p-4 rounded-xl border transition-all hover:scale-[1.02]",
              getUrgencyBg(deadline.daysLeft)
            )}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {getUrgencyIcon(deadline.daysLeft)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{deadline.examName}</p>
                <p className="text-xs text-muted-foreground">{deadline.type}</p>
              </div>
              <div className="text-right">
                <p className={cn(
                  "text-sm font-semibold",
                  deadline.daysLeft <= 3 ? "text-destructive" :
                  deadline.daysLeft <= 7 ? "text-warning" : "text-info"
                )}>
                  {deadline.daysLeft === 0 ? "Hoje!" :
                   deadline.daysLeft === 1 ? "Amanhã" :
                   `${deadline.daysLeft} dias`}
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(deadline.date, "dd/MM", { locale: ptBR })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingDeadlines;

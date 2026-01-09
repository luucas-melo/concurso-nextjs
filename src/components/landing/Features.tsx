import { 
  CalendarDays, 
  Bell, 
  FileCheck, 
  Target, 
  Clock, 
  Shield,
  BarChart3,
  Zap
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <CalendarDays className="w-6 h-6" />,
      title: "Linha do Tempo Visual",
      description: "Visualize todas as datas importantes do seu concurso em uma timeline intuitiva e clara.",
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: "Alertas por E-mail",
      description: "Receba lembretes automáticos sobre inscrições, pagamentos e datas de prova.",
    },
    {
      icon: <FileCheck className="w-6 h-6" />,
      title: "Checklist Personalizado",
      description: "Crie listas de documentos específicas para cada concurso e acompanhe seu progresso.",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Múltiplos Concursos",
      description: "Gerencie quantos concursos quiser, cada um com suas próprias datas e requisitos.",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Contagem Regressiva",
      description: "Acompanhe quanto tempo falta para cada prazo importante com contadores visuais.",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Histórico Completo",
      description: "Mantenha um registro de todos os concursos que você participou e seus resultados.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Dados Seguros",
      description: "Suas informações são criptografadas e armazenadas com segurança na nuvem.",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Acesso Rápido",
      description: "Interface otimizada para você encontrar rapidamente o que precisa.",
    },
  ];

  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Tudo que você precisa em um só lugar
          </h2>
          <p className="text-lg text-muted-foreground">
            Recursos pensados para simplificar a gestão da sua jornada como concurseiro
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-card rounded-2xl p-6 hover-lift group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

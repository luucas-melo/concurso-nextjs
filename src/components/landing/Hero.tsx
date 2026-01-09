import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  Calendar,
  Bell,
  FileCheck,
} from "lucide-react";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-hero opacity-5" />

      {/* Floating shapes */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float animation-delay-300" />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium animate-fade-in-up">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Gestão completa para concurseiros
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in-up animation-delay-100">
              Organize sua jornada de{" "}
              <span className="text-transparent bg-clip-text gradient-hero">
                concurseiro
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-xl animate-fade-in-up animation-delay-200">
              Gerencie inscrições, prazos, documentos e alertas. Foque no que
              importa: seus estudos. Nós cuidamos do resto.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-300">
              <Link href="/auth">
                <Button variant="hero" size="xl">
                  Começar agora
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Button variant="heroOutline" size="xl">
                Ver recursos
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-6 pt-4 animate-fade-in-up animation-delay-400">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <span>Gratuito para começar</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <span>Sem cartão de crédito</span>
              </div>
            </div>
          </div>

          {/* Right content - Feature cards */}
          <div className="relative lg:pl-12">
            <div className="grid gap-4">
              <FeatureCard
                icon={<Calendar className="w-6 h-6" />}
                title="Gestão de Prazos"
                description="Acompanhe todas as datas importantes em um só lugar"
                className="animate-slide-in-right"
                color="primary"
              />
              <FeatureCard
                icon={<Bell className="w-6 h-6" />}
                title="Alertas Inteligentes"
                description="Receba notificações antes dos prazos vencerem"
                className="animate-slide-in-right animation-delay-100"
                color="accent"
              />
              <FeatureCard
                icon={<FileCheck className="w-6 h-6" />}
                title="Checklist de Documentos"
                description="Nunca esqueça um documento necessário"
                className="animate-slide-in-right animation-delay-200"
                color="success"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  color: "primary" | "accent" | "success";
}

const FeatureCard = ({
  icon,
  title,
  description,
  className,
  color,
}: FeatureCardProps) => {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/10 text-accent",
    success: "bg-success/10 text-success",
  };

  return (
    <div className={`glass-card rounded-2xl p-6 hover-lift ${className}`}>
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>{icon}</div>
        <div>
          <h3 className="font-display font-semibold text-lg mb-1">{title}</h3>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default Hero;

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'accent';
  className?: string;
}

const StatsCard = ({ icon: Icon, label, value, variant = 'default', className }: StatsCardProps) => {
  const variantClasses = {
    default: 'bg-secondary/50 text-foreground',
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    accent: 'bg-accent/10 text-accent',
  };

  const iconBgClasses = {
    default: 'bg-secondary text-muted-foreground',
    primary: 'bg-primary/20 text-primary',
    success: 'bg-success/20 text-success',
    warning: 'bg-warning/20 text-warning',
    accent: 'bg-accent/20 text-accent',
  };

  return (
    <div className={cn("glass-card rounded-2xl p-6", className)}>
      <div className="flex items-center gap-4">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", iconBgClasses[variant])}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-display font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;

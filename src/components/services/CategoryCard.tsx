import { Link } from 'react-router-dom';
import { 
  Wrench, Wind, Sparkles, Bug, Scissors, Shield, 
  Car, Cake, Flower2, PartyPopper, LucideIcon 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, LucideIcon> = {
  Wrench,
  Wind,
  Sparkles,
  Bug,
  Scissors,
  Shield,
  Car,
  Cake,
  Flower2,
  PartyPopper,
};

interface CategoryCardProps {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  serviceCount: number;
  compact?: boolean;
  className?: string;
}

export function CategoryCard({
  id,
  name,
  icon,
  color,
  description,
  serviceCount,
  compact = false,
  className,
}: CategoryCardProps) {
  const Icon = iconMap[icon] || Wrench;
  
  if (compact) {
    return (
      <Link
        to={`/category/${id}`}
        className={cn(
          "flex flex-col items-center gap-2 p-3 rounded-xl bg-card hover:bg-muted transition-colors",
          className
        )}
      >
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br",
          color
        )}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <span className="text-xs font-medium text-center line-clamp-1">{name}</span>
      </Link>
    );
  }
  
  return (
    <Link
      to={`/category/${id}`}
      className={cn(
        "group flex items-center gap-4 p-4 rounded-xl bg-card shadow-card hover:shadow-card-hover transition-all duration-300",
        className
      )}
    >
      <div className={cn(
        "w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br flex-shrink-0",
        color
      )}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
          {name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-1">{description}</p>
        <span className="text-xs text-primary font-medium">{serviceCount} services</span>
      </div>
    </Link>
  );
}

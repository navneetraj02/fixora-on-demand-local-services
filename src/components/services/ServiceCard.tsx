import { Link } from 'react-router-dom';
import { Star, Clock, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  id: string;
  name: string;
  shortDescription: string;
  image: string;
  price: { min: number; max: number };
  rating: number;
  reviewCount: number;
  duration: string;
  popular?: boolean;
  className?: string;
}

export function ServiceCard({
  id,
  name,
  shortDescription,
  image,
  price,
  rating,
  reviewCount,
  duration,
  popular,
  className,
}: ServiceCardProps) {
  return (
    <Link
      to={`/service/${id}`}
      className={cn(
        "group block bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300",
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {popular && (
          <span className="absolute top-3 left-3 px-2 py-1 text-xs font-semibold bg-accent text-accent-foreground rounded-full">
            Popular
          </span>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {name}
        </h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
          {shortDescription}
        </p>
        
        {/* Rating & Duration */}
        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-warning text-warning" />
            <span className="text-sm font-medium">{rating}</span>
            <span className="text-xs text-muted-foreground">({reviewCount.toLocaleString()})</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs">{duration}</span>
          </div>
        </div>
        
        {/* Price */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <div>
            <span className="text-lg font-bold text-primary">₹{price.min}</span>
            {price.max > price.min && (
              <span className="text-sm text-muted-foreground"> - ₹{price.max}</span>
            )}
          </div>
          <span className="text-primary group-hover:translate-x-1 transition-transform">
            <ChevronRight className="w-5 h-5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

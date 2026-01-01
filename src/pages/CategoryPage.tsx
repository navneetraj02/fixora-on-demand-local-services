import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ServiceCard } from '@/components/services/ServiceCard';
import { getCategoryById, getServicesByCategory } from '@/data/mockData';
import { 
  Wrench, Wind, Sparkles, Bug, Scissors, Shield, 
  Car, Cake, Flower2, PartyPopper, LucideIcon 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, LucideIcon> = {
  Wrench, Wind, Sparkles, Bug, Scissors, Shield, Car, Cake, Flower2, PartyPopper,
};

const CategoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const category = getCategoryById(id || '');
  const services = getServicesByCategory(id || '');
  
  if (!category) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-xl font-semibold mb-4">Category not found</h1>
        <Link to="/services">
          <Button>Back to Services</Button>
        </Link>
      </div>
    );
  }
  
  const Icon = iconMap[category.icon] || Wrench;
  
  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className={cn("bg-gradient-to-br", category.color)}>
        <div className="container py-6">
          <Link to="/services" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4">
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back to Services</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{category.name}</h1>
              <p className="text-white/80">{category.serviceCount} services available</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Services Grid */}
      <div className="container py-6">
        {services.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                id={service.id}
                name={service.name}
                shortDescription={service.shortDescription}
                image={service.image}
                price={service.price}
                rating={service.rating}
                reviewCount={service.reviewCount}
                duration={service.duration}
                popular={service.popular}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No services found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;

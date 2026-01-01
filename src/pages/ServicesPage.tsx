import { Link } from 'react-router-dom';
import { SearchBar } from '@/components/search/SearchBar';
import { CategoryCard } from '@/components/services/CategoryCard';
import { ServiceCard } from '@/components/services/ServiceCard';
import { categories, services } from '@/data/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ServicesPage = () => {
  return (
    <div className="animate-fade-in">
      <div className="container py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">All Services</h1>
          <SearchBar placeholder="Search services..." />
        </div>
        
        <Tabs defaultValue="categories" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="all">All Services</TabsTrigger>
          </TabsList>
          
          <TabsContent value="categories" className="animate-fade-in">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <CategoryCard key={category.id} {...category} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="all" className="animate-fade-in">
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ServicesPage;

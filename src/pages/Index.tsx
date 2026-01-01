import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/search/SearchBar';
import { PromoBanner } from '@/components/home/PromoBanner';
import { CategoryCard } from '@/components/services/CategoryCard';
import { ServiceCard } from '@/components/services/ServiceCard';
import { OrderCard } from '@/components/orders/OrderCard';
import { categories, getPopularServices } from '@/data/mockData';
import { useAppStore } from '@/store/appStore';

const Index = () => {
  const orders = useAppStore((state) => state.orders);
  const popularServices = getPopularServices();
  const activeOrders = orders.filter(o => 
    ['requested', 'assigned', 'on-the-way', 'in-progress'].includes(o.status)
  ).slice(0, 2);
  
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="gradient-hero pb-6">
        <div className="container pt-6">
          {/* Welcome */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Welcome to Fixora</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              What do you need<br className="md:hidden" /> today?
            </h1>
          </div>
          
          {/* Search Bar */}
          <SearchBar className="mb-6" />
          
          {/* Promo Banner */}
          <PromoBanner />
        </div>
      </section>
      
      {/* Active Orders (if any) */}
      {activeOrders.length > 0 && (
        <section className="container py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Active Bookings</h2>
            <Link to="/orders" className="text-sm text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {activeOrders.map((order) => (
              <OrderCard
                key={order.id}
                id={order.id}
                serviceName={order.serviceName}
                status={order.status}
                vendorName={order.vendor.name}
                vendorAvatar={order.vendor.avatar}
                scheduledDate={order.scheduledDate}
                scheduledTime={order.scheduledTime}
                totalAmount={order.totalAmount}
              />
            ))}
          </div>
        </section>
      )}
      
      {/* Categories */}
      <section className="container py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">All Services</h2>
          <Link to="/services" className="text-sm text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        {/* Compact Grid for Mobile, Full Grid for Desktop */}
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 md:hidden">
          {categories.slice(0, 8).map((category) => (
            <CategoryCard
              key={category.id}
              {...category}
              compact
            />
          ))}
        </div>
        
        {/* Full Cards for Desktop */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.slice(0, 6).map((category) => (
            <CategoryCard
              key={category.id}
              {...category}
            />
          ))}
        </div>
      </section>
      
      {/* Popular Services */}
      <section className="container py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Popular Services</h2>
          <Link to="/services" className="text-sm text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        {/* Horizontal Scroll on Mobile */}
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible">
          {popularServices.slice(0, 4).map((service) => (
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
              className="min-w-[260px] md:min-w-0"
            />
          ))}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="container py-8">
        <div className="relative overflow-hidden rounded-2xl gradient-primary p-6 md:p-10">
          <div className="relative z-10">
            <h2 className="text-xl md:text-2xl font-bold text-primary-foreground mb-2">
              Need help with something?
            </h2>
            <p className="text-primary-foreground/80 mb-4 max-w-md">
              Browse our full catalog of services or search for exactly what you need.
            </p>
            <Link to="/services">
              <Button variant="secondary" size="lg" className="font-semibold">
                Explore All Services
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-1/2 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
        </div>
      </section>
    </div>
  );
};

export default Index;

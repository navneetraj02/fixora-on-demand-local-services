import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Star, Clock, CheckCircle2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getServiceById, getCategoryById, reviews } from '@/data/mockData';
import { useAppStore } from '@/store/appStore';
import { useToast } from '@/hooks/use-toast';

const ServiceDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const service = getServiceById(id || '');
  const startBooking = useAppStore((state) => state.startBooking);
  
  if (!service) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-xl font-semibold mb-4">Service not found</h1>
        <Link to="/services">
          <Button>Back to Services</Button>
        </Link>
      </div>
    );
  }
  
  const category = getCategoryById(service.categoryId);
  const serviceReviews = reviews.filter(r => r.serviceId === service.id);
  
  const handleBookNow = () => {
    startBooking(service.id, service.name, service.price.min);
    navigate(`/booking/${service.id}`);
  };
  
  return (
    <div className="animate-fade-in pb-24">
      {/* Image Header */}
      <div className="relative h-56 md:h-72 lg:h-80">
        <img
          src={service.image}
          alt={service.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        
        <div className="absolute top-4 left-4">
          <Link to={category ? `/category/${category.id}` : '/services'}>
            <Button variant="secondary" size="icon" className="rounded-full">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
        </div>
        
        {service.popular && (
          <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">
            Popular
          </Badge>
        )}
      </div>
      
      <div className="container -mt-8 relative">
        {/* Main Info Card */}
        <div className="bg-card rounded-2xl shadow-card p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <p className="text-sm text-primary font-medium mb-1">{category?.name}</p>
              <h1 className="text-xl md:text-2xl font-bold">{service.name}</h1>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">₹{service.price.min}</p>
              {service.price.max > service.price.min && (
                <p className="text-sm text-muted-foreground">onwards</p>
              )}
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-warning text-warning" />
              <span className="font-semibold">{service.rating}</span>
              <span className="text-muted-foreground">({service.reviewCount.toLocaleString()} reviews)</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{service.duration}</span>
            </div>
          </div>
        </div>
        
        {/* Description */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-3">About this service</h2>
          <p className="text-muted-foreground leading-relaxed">{service.description}</p>
        </div>
        
        {/* Includes */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-3">What's included</h2>
          <div className="grid gap-2">
            {service.includes.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-primary" />
                </div>
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Trust Badges */}
        <div className="mt-6 p-4 bg-muted rounded-xl">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium text-sm">Fixora Guarantee</p>
              <p className="text-xs text-muted-foreground">Verified professionals • Quality assured • Fair pricing</p>
            </div>
          </div>
        </div>
        
        {/* Reviews */}
        {serviceReviews.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-3">Reviews</h2>
            <div className="space-y-4">
              {serviceReviews.map((review) => (
                <div key={review.id} className="bg-card rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src={review.userAvatar}
                      alt={review.userName}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{review.userName}</p>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < review.rating
                                ? 'fill-warning text-warning'
                                : 'text-muted'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{review.date}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Sticky Book Button */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 p-4 bg-card/95 backdrop-blur-lg border-t border-border">
        <div className="container flex items-center justify-between gap-4">
          <div>
            <p className="text-2xl font-bold text-primary">₹{service.price.min}</p>
            <p className="text-xs text-muted-foreground">Starting price</p>
          </div>
          <Button size="lg" className="flex-1 max-w-xs" onClick={handleBookNow}>
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;

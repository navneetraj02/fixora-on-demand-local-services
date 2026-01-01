import { Link } from 'react-router-dom';
import { 
  Clock, CheckCircle2, Truck, Wrench, XCircle,
  MessageSquare, Phone, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { OrderStatus } from '@/data/mockData';

interface OrderCardProps {
  id: string;
  serviceName: string;
  status: OrderStatus;
  vendorName: string;
  vendorAvatar: string;
  scheduledDate: string;
  scheduledTime: string;
  totalAmount: number;
  className?: string;
}

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: typeof Clock }> = {
  requested: { label: 'Requested', color: 'text-muted-foreground bg-muted', icon: Clock },
  assigned: { label: 'Assigned', color: 'text-primary bg-primary/10', icon: CheckCircle2 },
  'on-the-way': { label: 'On the way', color: 'text-warning bg-warning/10', icon: Truck },
  'in-progress': { label: 'In Progress', color: 'text-accent bg-accent/10', icon: Wrench },
  completed: { label: 'Completed', color: 'text-success bg-success/10', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', color: 'text-destructive bg-destructive/10', icon: XCircle },
};

export function OrderCard({
  id,
  serviceName,
  status,
  vendorName,
  vendorAvatar,
  scheduledDate,
  scheduledTime,
  totalAmount,
  className,
}: OrderCardProps) {
  const config = statusConfig[status];
  const StatusIcon = config.icon;
  const isActive = ['requested', 'assigned', 'on-the-way', 'in-progress'].includes(status);
  
  return (
    <div className={cn(
      "bg-card rounded-xl shadow-card overflow-hidden",
      className
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground font-medium">{id}</span>
          <span className={cn(
            "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium",
            config.color
          )}>
            <StatusIcon className="w-3 h-3" />
            {config.label}
          </span>
        </div>
        <h3 className="font-semibold text-foreground">{serviceName}</h3>
      </div>
      
      {/* Vendor Info */}
      <div className="p-4 flex items-center gap-3">
        <img 
          src={vendorAvatar} 
          alt={vendorName}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <p className="font-medium text-sm">{vendorName}</p>
          <p className="text-xs text-muted-foreground">Service Professional</p>
        </div>
        {isActive && (
          <div className="flex items-center gap-2">
            <Link to={`/chat/${id}`}>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <MessageSquare className="w-4 h-4" />
              </Button>
            </Link>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Phone className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
      
      {/* Schedule & Price */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between text-sm">
          <div className="text-muted-foreground">
            <span>{scheduledDate}</span>
            <span className="mx-2">•</span>
            <span>{scheduledTime}</span>
          </div>
          <span className="font-semibold text-primary">₹{totalAmount}</span>
        </div>
      </div>
      
      {/* Action */}
      <Link 
        to={`/order/${id}`}
        className="flex items-center justify-between px-4 py-3 bg-muted/50 text-sm font-medium text-primary hover:bg-muted transition-colors"
      >
        <span>View Details</span>
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

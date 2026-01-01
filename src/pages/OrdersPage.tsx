import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrderCard } from '@/components/orders/OrderCard';
import { useAppStore } from '@/store/appStore';
import { ClipboardList } from 'lucide-react';

const OrdersPage = () => {
  const orders = useAppStore((state) => state.orders);
  
  const activeOrders = orders.filter(o => 
    ['requested', 'assigned', 'on-the-way', 'in-progress'].includes(o.status)
  );
  const completedOrders = orders.filter(o => o.status === 'completed');
  const cancelledOrders = orders.filter(o => o.status === 'cancelled');
  
  const EmptyState = ({ message }: { message: string }) => (
    <div className="text-center py-12">
      <ClipboardList className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
  
  return (
    <div className="container py-6 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      
      <Tabs defaultValue="active">
        <TabsList className="mb-6">
          <TabsTrigger value="active">Active ({activeOrders.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedOrders.length})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({cancelledOrders.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          {activeOrders.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {activeOrders.map((order) => (
                <OrderCard key={order.id} id={order.id} serviceName={order.serviceName}
                  status={order.status} vendorName={order.vendor.name}
                  vendorAvatar={order.vendor.avatar} scheduledDate={order.scheduledDate}
                  scheduledTime={order.scheduledTime} totalAmount={order.totalAmount} />
              ))}
            </div>
          ) : <EmptyState message="No active orders" />}
        </TabsContent>
        
        <TabsContent value="completed">
          {completedOrders.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {completedOrders.map((order) => (
                <OrderCard key={order.id} id={order.id} serviceName={order.serviceName}
                  status={order.status} vendorName={order.vendor.name}
                  vendorAvatar={order.vendor.avatar} scheduledDate={order.scheduledDate}
                  scheduledTime={order.scheduledTime} totalAmount={order.totalAmount} />
              ))}
            </div>
          ) : <EmptyState message="No completed orders yet" />}
        </TabsContent>
        
        <TabsContent value="cancelled">
          {cancelledOrders.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {cancelledOrders.map((order) => (
                <OrderCard key={order.id} id={order.id} serviceName={order.serviceName}
                  status={order.status} vendorName={order.vendor.name}
                  vendorAvatar={order.vendor.avatar} scheduledDate={order.scheduledDate}
                  scheduledTime={order.scheduledTime} totalAmount={order.totalAmount} />
              ))}
            </div>
          ) : <EmptyState message="No cancelled orders" />}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrdersPage;

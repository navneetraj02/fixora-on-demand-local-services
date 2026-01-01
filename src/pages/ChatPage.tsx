import { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Send, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/store/appStore';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const ChatPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const orders = useAppStore((state) => state.orders);
  const messages = useAppStore((state) => state.getOrderMessages(orderId || ''));
  const addMessage = useAppStore((state) => state.addMessage);
  const user = useAppStore((state) => state.user);
  
  const order = orders.find(o => o.id === orderId);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSend = () => {
    if (!message.trim() || !orderId) return;
    
    addMessage({
      orderId,
      senderId: user.id,
      senderName: 'You',
      message: message.trim(),
      isVendor: false,
    });
    setMessage('');
    
    // Simulate vendor response
    setTimeout(() => {
      addMessage({
        orderId,
        senderId: order?.vendor.id || 'v1',
        senderName: order?.vendor.name || 'Vendor',
        senderAvatar: order?.vendor.avatar,
        message: "Thanks for your message! I'll get back to you shortly.",
        isVendor: true,
      });
    }, 2000);
  };
  
  if (!order) {
    return (
      <div className="container py-8 text-center">
        <p>Order not found</p>
        <Link to="/orders"><Button className="mt-4">Back to Orders</Button></Link>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-screen">
      {/* Header */}
      <div className="bg-card border-b border-border p-4 flex items-center gap-3">
        <Link to={`/order/${orderId}`}><Button variant="ghost" size="icon"><ChevronLeft /></Button></Link>
        <img src={order.vendor.avatar} alt={order.vendor.name} className="w-10 h-10 rounded-full" />
        <div className="flex-1">
          <p className="font-semibold">{order.vendor.name}</p>
          <p className="text-xs text-muted-foreground">Service Professional</p>
        </div>
        <Button variant="outline" size="icon"><Phone className="w-4 h-4" /></Button>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex gap-2", !msg.isVendor && "flex-row-reverse")}>
            {msg.isVendor && msg.senderAvatar && (
              <img src={msg.senderAvatar} alt="" className="w-8 h-8 rounded-full" />
            )}
            <div className={cn(
              "max-w-[70%] rounded-2xl p-3",
              msg.isVendor ? "bg-muted" : "bg-primary text-primary-foreground"
            )}>
              <p className="text-sm">{msg.message}</p>
              <p className={cn("text-xs mt-1", msg.isVendor ? "text-muted-foreground" : "text-primary-foreground/70")}>
                {format(new Date(msg.timestamp), 'h:mm a')}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <div className="p-4 bg-card border-t border-border mb-16 md:mb-0">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button onClick={handleSend}><Send className="w-4 h-4" /></Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

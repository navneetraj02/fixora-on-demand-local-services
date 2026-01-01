import { Link } from 'react-router-dom';
import { ChevronRight, MapPin, History, Star, Settings, HelpCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAppStore } from '@/store/appStore';

const ProfilePage = () => {
  const user = useAppStore((state) => state.user);
  
  const menuItems = [
    { icon: MapPin, label: 'Saved Addresses', to: '/addresses', count: user.addresses.length },
    { icon: History, label: 'Booking History', to: '/orders' },
    { icon: Star, label: 'My Reviews', to: '/reviews' },
    { icon: Settings, label: 'Settings', to: '/settings' },
    { icon: HelpCircle, label: 'Help & Support', to: '/help' },
  ];
  
  return (
    <div className="container py-6 animate-fade-in">
      {/* Profile Header */}
      <div className="bg-card rounded-2xl p-6 shadow-card mb-6">
        <div className="flex items-center gap-4">
          <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full object-cover" />
          <div className="flex-1">
            <h1 className="text-xl font-bold">{user.name}</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <p className="text-sm text-muted-foreground">{user.phone}</p>
          </div>
          <Button variant="outline" size="sm">Edit</Button>
        </div>
      </div>
      
      {/* Menu Items */}
      <div className="bg-card rounded-2xl shadow-card overflow-hidden">
        {menuItems.map((item, index) => (
          <div key={item.label}>
            <Link to={item.to} className="flex items-center gap-4 p-4 hover:bg-muted transition-colors">
              <item.icon className="w-5 h-5 text-muted-foreground" />
              <span className="flex-1 font-medium">{item.label}</span>
              {item.count !== undefined && (
                <span className="text-sm text-muted-foreground">{item.count}</span>
              )}
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Link>
            {index < menuItems.length - 1 && <Separator />}
          </div>
        ))}
      </div>
      
      <Button variant="ghost" className="w-full mt-6 text-destructive hover:text-destructive">
        <LogOut className="w-4 h-4 mr-2" /> Sign Out
      </Button>
    </div>
  );
};

export default ProfilePage;

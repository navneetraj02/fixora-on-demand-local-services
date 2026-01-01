import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, MapPin, Calendar, Clock, FileText, CreditCard, CheckCircle2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { getServiceById, timeSlots } from '@/data/mockData';
import { useAppStore } from '@/store/appStore';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

type BookingStep = 'address' | 'schedule' | 'notes' | 'payment' | 'confirm';

const BookingPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const service = getServiceById(id || '');
  const user = useAppStore((state) => state.user);
  const bookingDraft = useAppStore((state) => state.bookingDraft);
  const updateBookingDraft = useAppStore((state) => state.updateBookingDraft);
  const confirmBooking = useAppStore((state) => state.confirmBooking);
  const addAddress = useAppStore((state) => state.addAddress);
  
  const [step, setStep] = useState<BookingStep>('address');
  const [selectedAddress, setSelectedAddress] = useState<string>(
    user.addresses.find(a => a.isDefault)?.id || user.addresses[0]?.id || ''
  );
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [newAddressOpen, setNewAddressOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({ type: 'Home', address: '', city: '', pincode: '' });
  
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
  
  const steps = [
    { id: 'address', label: 'Address', icon: MapPin },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'payment', label: 'Payment', icon: CreditCard },
  ];
  
  const currentStepIndex = steps.findIndex(s => s.id === step);
  
  const handleAddAddress = () => {
    if (newAddress.address && newAddress.city && newAddress.pincode) {
      addAddress({
        type: newAddress.type,
        address: newAddress.address,
        city: newAddress.city,
        pincode: newAddress.pincode,
        isDefault: user.addresses.length === 0,
      });
      setNewAddressOpen(false);
      setNewAddress({ type: 'Home', address: '', city: '', pincode: '' });
      toast({ title: 'Address added successfully!' });
    }
  };
  
  const handleNext = () => {
    if (step === 'address') {
      if (!selectedAddress) {
        toast({ title: 'Please select an address', variant: 'destructive' });
        return;
      }
      updateBookingDraft({ addressId: selectedAddress });
      setStep('schedule');
    } else if (step === 'schedule') {
      if (!selectedDate || !selectedTime) {
        toast({ title: 'Please select date and time', variant: 'destructive' });
        return;
      }
      updateBookingDraft({
        date: format(selectedDate, 'yyyy-MM-dd'),
        timeSlot: timeSlots.find(t => t.id === selectedTime)?.label || '',
      });
      setStep('notes');
    } else if (step === 'notes') {
      updateBookingDraft({ notes });
      setStep('payment');
    } else if (step === 'payment') {
      handlePayment();
    }
  };
  
  const handleBack = () => {
    if (step === 'schedule') setStep('address');
    else if (step === 'notes') setStep('schedule');
    else if (step === 'payment') setStep('notes');
    else if (step === 'confirm') setStep('payment');
    else navigate(-1);
  };
  
  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      const order = confirmBooking();
      setIsProcessing(false);
      setStep('confirm');
      toast({
        title: 'Booking Confirmed!',
        description: `Your booking ID is ${order.id}`,
      });
    } catch (error) {
      setIsProcessing(false);
      toast({
        title: 'Booking failed',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  };
  
  const selectedAddressData = user.addresses.find(a => a.id === selectedAddress);
  const selectedTimeData = timeSlots.find(t => t.id === selectedTime);
  
  return (
    <div className="animate-fade-in min-h-screen pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-border">
        <div className="container py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-semibold">Book {service.name}</h1>
              <p className="text-sm text-muted-foreground">₹{service.price.min} onwards</p>
            </div>
          </div>
        </div>
        
        {/* Progress Steps */}
        {step !== 'confirm' && (
          <div className="container pb-4">
            <div className="flex items-center justify-between">
              {steps.map((s, i) => (
                <div key={s.id} className="flex items-center">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    i <= currentStepIndex
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}>
                    {i < currentStepIndex ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  {i < steps.length - 1 && (
                    <div className={cn(
                      "w-8 md:w-16 h-0.5 mx-1",
                      i < currentStepIndex ? "bg-primary" : "bg-muted"
                    )} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="container py-6">
        {/* Address Step */}
        {step === 'address' && (
          <div className="animate-slide-up">
            <h2 className="text-lg font-semibold mb-4">Select Address</h2>
            
            <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
              <div className="space-y-3">
                {user.addresses.map((address) => (
                  <label
                    key={address.id}
                    className={cn(
                      "flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors",
                      selectedAddress === address.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <RadioGroupItem value={address.id} className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{address.type}</span>
                        {address.isDefault && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {address.address}, {address.city} - {address.pincode}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </RadioGroup>
            
            <Dialog open={newAddressOpen} onOpenChange={setNewAddressOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Address
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Address</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <Label>Address Type</Label>
                    <RadioGroup
                      value={newAddress.type}
                      onValueChange={(v) => setNewAddress({ ...newAddress, type: v })}
                      className="flex gap-4 mt-2"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="Home" id="home" />
                        <Label htmlFor="home">Home</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="Office" id="office" />
                        <Label htmlFor="office">Office</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="Other" id="other" />
                        <Label htmlFor="other">Other</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div>
                    <Label>Address</Label>
                    <Input
                      value={newAddress.address}
                      onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                      placeholder="Enter full address"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>City</Label>
                      <Input
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <Label>Pincode</Label>
                      <Input
                        value={newAddress.pincode}
                        onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                        placeholder="Pincode"
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddAddress} className="w-full">
                    Save Address
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
        
        {/* Schedule Step */}
        {step === 'schedule' && (
          <div className="animate-slide-up">
            <h2 className="text-lg font-semibold mb-4">Select Date & Time</h2>
            
            <div className="bg-card rounded-xl p-4 shadow-card mb-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <Calendar className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date() || date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Select Time Slot
            </h3>
            
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => slot.available && setSelectedTime(slot.id)}
                  disabled={!slot.available}
                  className={cn(
                    "p-3 rounded-xl text-sm font-medium transition-colors",
                    !slot.available && "opacity-50 cursor-not-allowed bg-muted",
                    slot.available && selectedTime === slot.id
                      ? "bg-primary text-primary-foreground"
                      : slot.available && "bg-card border border-border hover:border-primary"
                  )}
                >
                  {slot.label}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Notes Step */}
        {step === 'notes' && (
          <div className="animate-slide-up">
            <h2 className="text-lg font-semibold mb-4">Additional Notes</h2>
            
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special instructions or requirements for the service provider..."
              className="min-h-[150px]"
            />
            
            <p className="text-xs text-muted-foreground mt-2">
              Optional: Share any specific details that might help the service professional.
            </p>
          </div>
        )}
        
        {/* Payment Step */}
        {step === 'payment' && (
          <div className="animate-slide-up">
            <h2 className="text-lg font-semibold mb-4">Payment</h2>
            
            {/* Order Summary */}
            <div className="bg-card rounded-xl p-4 shadow-card mb-4">
              <h3 className="font-medium mb-3">Order Summary</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service</span>
                  <span className="font-medium">{service.name}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Address</span>
                  <span className="font-medium text-right max-w-[60%]">
                    {selectedAddressData?.address}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">
                    {selectedDate && format(selectedDate, 'PPP')}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time</span>
                  <span className="font-medium">{selectedTimeData?.label}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span className="text-primary">₹{service.price.min}</span>
                </div>
              </div>
            </div>
            
            {/* Payment Method */}
            <div className="bg-card rounded-xl p-4 shadow-card">
              <h3 className="font-medium mb-3">Payment Method</h3>
              <RadioGroup defaultValue="cod">
                <label className="flex items-center gap-3 p-3 rounded-lg border border-border cursor-pointer">
                  <RadioGroupItem value="cod" />
                  <div>
                    <p className="font-medium">Cash on Delivery</p>
                    <p className="text-xs text-muted-foreground">Pay when service is completed</p>
                  </div>
                </label>
              </RadioGroup>
            </div>
          </div>
        )}
        
        {/* Confirmation Step */}
        {step === 'confirm' && (
          <div className="animate-scale-in text-center py-8">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-success" />
            </div>
            
            <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
            <p className="text-muted-foreground mb-6">
              Your service has been booked successfully. A service professional will be assigned shortly.
            </p>
            
            <div className="bg-card rounded-xl p-4 shadow-card mb-6 text-left">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service</span>
                  <span className="font-medium">{service.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">{selectedDate && format(selectedDate, 'PPP')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time</span>
                  <span className="font-medium">{selectedTimeData?.label}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <Link to="/orders">
                <Button className="w-full">View My Orders</Button>
              </Link>
              <Link to="/">
                <Button variant="outline" className="w-full">Back to Home</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
      
      {/* Sticky Footer */}
      {step !== 'confirm' && (
        <div className="fixed bottom-16 md:bottom-0 left-0 right-0 p-4 bg-card/95 backdrop-blur-lg border-t border-border">
          <div className="container">
            <Button
              size="lg"
              className="w-full"
              onClick={handleNext}
              disabled={isProcessing}
            >
              {isProcessing ? (
                'Processing...'
              ) : step === 'payment' ? (
                `Confirm & Pay ₹${service.price.min}`
              ) : (
                'Continue'
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;

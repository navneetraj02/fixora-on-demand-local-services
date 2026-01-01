import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { currentUser, sampleOrders, sampleMessages, type OrderStatus } from '@/data/mockData';

interface Address {
  id: string;
  type: string;
  address: string;
  city: string;
  pincode: string;
  isDefault: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  addresses: Address[];
}

interface Vendor {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  completedJobs: number;
  skills: string[];
  verified: boolean;
  experience: string;
}

interface StatusHistoryItem {
  status: OrderStatus;
  timestamp: string;
}

interface Order {
  id: string;
  serviceId: string;
  serviceName: string;
  status: OrderStatus;
  vendor: Vendor;
  address: Address;
  scheduledDate: string;
  scheduledTime: string;
  totalAmount: number;
  createdAt: string;
  statusHistory: StatusHistoryItem[];
  rating?: number;
  review?: string;
}

interface Message {
  id: string;
  orderId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  message: string;
  timestamp: string;
  isVendor: boolean;
}

interface BookingDraft {
  serviceId: string;
  serviceName: string;
  price: number;
  addressId: string | null;
  date: string | null;
  timeSlot: string | null;
  notes: string;
}

interface AppState {
  user: User;
  orders: Order[];
  messages: Message[];
  bookingDraft: BookingDraft | null;
  
  // Actions
  setUser: (user: User) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  removeAddress: (addressId: string) => void;
  setDefaultAddress: (addressId: string) => void;
  
  // Booking actions
  startBooking: (serviceId: string, serviceName: string, price: number) => void;
  updateBookingDraft: (updates: Partial<BookingDraft>) => void;
  clearBookingDraft: () => void;
  confirmBooking: () => Order;
  
  // Order actions
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  cancelOrder: (orderId: string) => void;
  addReview: (orderId: string, rating: number, review: string) => void;
  
  // Message actions
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  getOrderMessages: (orderId: string) => Message[];
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: currentUser,
      orders: sampleOrders,
      messages: sampleMessages,
      bookingDraft: null,
      
      setUser: (user) => set({ user }),
      
      addAddress: (address) => set((state) => ({
        user: {
          ...state.user,
          addresses: [
            ...state.user.addresses,
            { ...address, id: `a${Date.now()}` },
          ],
        },
      })),
      
      removeAddress: (addressId) => set((state) => ({
        user: {
          ...state.user,
          addresses: state.user.addresses.filter((a) => a.id !== addressId),
        },
      })),
      
      setDefaultAddress: (addressId) => set((state) => ({
        user: {
          ...state.user,
          addresses: state.user.addresses.map((a) => ({
            ...a,
            isDefault: a.id === addressId,
          })),
        },
      })),
      
      startBooking: (serviceId, serviceName, price) => set({
        bookingDraft: {
          serviceId,
          serviceName,
          price,
          addressId: null,
          date: null,
          timeSlot: null,
          notes: '',
        },
      }),
      
      updateBookingDraft: (updates) => set((state) => ({
        bookingDraft: state.bookingDraft
          ? { ...state.bookingDraft, ...updates }
          : null,
      })),
      
      clearBookingDraft: () => set({ bookingDraft: null }),
      
      confirmBooking: () => {
        const state = get();
        const draft = state.bookingDraft;
        if (!draft || !draft.addressId || !draft.date || !draft.timeSlot) {
          throw new Error('Incomplete booking');
        }
        
        const address = state.user.addresses.find((a) => a.id === draft.addressId);
        if (!address) throw new Error('Address not found');
        
        // Assign a random vendor
        const vendors = [
          {
            id: 'v1',
            name: 'Rajesh Kumar',
            avatar: 'https://i.pravatar.cc/150?img=11',
            rating: 4.9,
            completedJobs: 1247,
            skills: ['Electrician', 'AC Repair'],
            verified: true,
            experience: '8 years',
          },
          {
            id: 'v2',
            name: 'Priya Sharma',
            avatar: 'https://i.pravatar.cc/150?img=5',
            rating: 4.8,
            completedJobs: 892,
            skills: ['Beauty', 'Spa'],
            verified: true,
            experience: '6 years',
          },
        ];
        const vendor = vendors[Math.floor(Math.random() * vendors.length)];
        
        const newOrder: Order = {
          id: `ORD-${Date.now()}`,
          serviceId: draft.serviceId,
          serviceName: draft.serviceName,
          status: 'requested',
          vendor,
          address,
          scheduledDate: draft.date,
          scheduledTime: draft.timeSlot,
          totalAmount: draft.price,
          createdAt: new Date().toISOString(),
          statusHistory: [
            { status: 'requested', timestamp: new Date().toISOString() },
          ],
        };
        
        set((state) => ({
          orders: [newOrder, ...state.orders],
          bookingDraft: null,
        }));
        
        // Simulate vendor assignment after 2 seconds
        setTimeout(() => {
          get().updateOrderStatus(newOrder.id, 'assigned');
        }, 2000);
        
        return newOrder;
      },
      
      addOrder: (order) => set((state) => ({
        orders: [order, ...state.orders],
      })),
      
      updateOrderStatus: (orderId, status) => set((state) => ({
        orders: state.orders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status,
                statusHistory: [
                  ...order.statusHistory,
                  { status, timestamp: new Date().toISOString() },
                ],
              }
            : order
        ),
      })),
      
      cancelOrder: (orderId) => set((state) => ({
        orders: state.orders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: 'cancelled' as OrderStatus,
                statusHistory: [
                  ...order.statusHistory,
                  { status: 'cancelled' as OrderStatus, timestamp: new Date().toISOString() },
                ],
              }
            : order
        ),
      })),
      
      addReview: (orderId, rating, review) => set((state) => ({
        orders: state.orders.map((order) =>
          order.id === orderId
            ? { ...order, rating, review }
            : order
        ),
      })),
      
      addMessage: (message) => set((state) => ({
        messages: [
          ...state.messages,
          {
            ...message,
            id: `m${Date.now()}`,
            timestamp: new Date().toISOString(),
          },
        ],
      })),
      
      getOrderMessages: (orderId) => {
        return get().messages.filter((m) => m.orderId === orderId);
      },
    }),
    {
      name: 'fixora-storage',
    }
  )
);

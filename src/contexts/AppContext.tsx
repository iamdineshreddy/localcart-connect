import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, UserRole, CartItem, Product, WishlistItem, Order, Notification, OrderStatus } from '@/types';
import { sampleProducts } from '@/data/products';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

interface StoreContextType {
  // Products
  products: Product[];
  getProduct: (id: string) => Product | undefined;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'status' | 'rating' | 'reviewCount'>) => void;
  approveProduct: (id: string) => void;
  rejectProduct: (id: string) => void;
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  // Wishlist
  wishlist: WishlistItem[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  // Orders
  orders: Order[];
  placeOrder: (address: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  // Notifications
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  // Admin
  allUsers: User[];
  suspendUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);
const StoreContext = createContext<StoreContextType | null>(null);

const DEFAULT_USERS: (User & { password: string })[] = [
  { id: 'buyer1', email: 'buyer@test.com', password: '123456', name: 'Test Buyer', role: 'buyer', createdAt: '2024-01-01' },
  { id: 'seller1', email: 'seller@test.com', password: '123456', name: 'Test Seller', role: 'seller', createdAt: '2024-01-01' },
  { id: 'admin1', email: 'admin@test.com', password: 'admin123', name: 'Admin', role: 'admin', createdAt: '2024-01-01' },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState(DEFAULT_USERS);

  const login = useCallback((email: string, password: string) => {
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      const { password: _, ...userData } = found;
      setUser(userData);
      return true;
    }
    return false;
  }, [users]);

  const signup = useCallback((name: string, email: string, password: string, role: UserRole) => {
    if (users.find(u => u.email === email)) return false;
    const newUser = { id: `u${Date.now()}`, email, password, name, role, createdAt: new Date().toISOString() };
    setUsers(prev => [...prev, newUser]);
    const { password: _, ...userData } = newUser;
    setUser(userData);
    return true;
  }, [users]);

  const logout = useCallback(() => setUser(null), []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [allUsers] = useState<User[]>(DEFAULT_USERS.map(({ password, ...u }) => u));

  const getProduct = (id: string) => products.find(p => p.id === id);

  const addProduct = (product: Omit<Product, 'id' | 'createdAt' | 'status' | 'rating' | 'reviewCount'>) => {
    const newProduct: Product = {
      ...product,
      id: `p${Date.now()}`,
      status: 'pending',
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
    };
    setProducts(prev => [...prev, newProduct]);
    addNotification('admin1', 'New Product', `${product.name} needs approval`);
  };

  const approveProduct = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, status: 'approved' as const } : p));
    const p = products.find(pr => pr.id === id);
    if (p) addNotification(p.sellerId, 'Product Approved', `${p.name} has been approved`);
  };

  const rejectProduct = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, status: 'rejected' as const } : p));
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { id: `c${Date.now()}`, product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => setCart(prev => prev.filter(item => item.product.id !== productId));
  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(productId);
    setCart(prev => prev.map(item => item.product.id === productId ? { ...item, quantity } : item));
  };
  const clearCart = () => setCart([]);
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const addToWishlist = (product: Product) => {
    if (!wishlist.find(w => w.product.id === product.id)) {
      setWishlist(prev => [...prev, { id: `w${Date.now()}`, product, addedAt: new Date().toISOString() }]);
    }
  };
  const removeFromWishlist = (productId: string) => setWishlist(prev => prev.filter(w => w.product.id !== productId));
  const isInWishlist = (productId: string) => wishlist.some(w => w.product.id === productId);

  const placeOrder = (address: string) => {
    if (cart.length === 0 || !auth.user) return;
    const order: Order = {
      id: `o${Date.now()}`,
      buyerId: auth.user.id,
      buyerName: auth.user.name,
      items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.image,
        quantity: item.quantity,
        price: item.product.price,
        sellerId: item.product.sellerId,
        sellerName: item.product.sellerName,
      })),
      total: cartTotal,
      status: 'placed',
      address,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setOrders(prev => [order, ...prev]);
    clearCart();
    addNotification(auth.user.id, 'Order Placed', `Order #${order.id.slice(-6)} placed successfully`);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o));
  };

  const addNotification = (userId: string, title: string, message: string) => {
    setNotifications(prev => [{ id: `n${Date.now()}`, userId, title, message, read: false, createdAt: new Date().toISOString() }, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const suspendUser = (userId: string) => {
    // In real app, would update user status
    addNotification(userId, 'Account Suspended', 'Your account has been suspended by admin');
  };

  return (
    <StoreContext.Provider value={{
      products, getProduct, addProduct, approveProduct, rejectProduct,
      cart, addToCart, removeFromCart, updateCartQuantity, clearCart, cartTotal,
      wishlist, addToWishlist, removeFromWishlist, isInWishlist,
      orders, placeOrder, updateOrderStatus,
      notifications, markNotificationRead,
      allUsers, suspendUser,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
};

import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/hooks/useCart';
import { useNotifications } from '@/hooks/useNotifications';
import { ShoppingCart, Heart, Search, User, LogOut, Bell, Menu, X, Store } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { data: cart = [] } = useCart();
  const { data: notifications = [] } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [mobileMenu, setMobileMenu] = useState(false);

  const unread = notifications.filter(n => !n.read).length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) navigate(`/shop?search=${encodeURIComponent(search.trim())}`);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card shadow-card">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-4">
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="w-9 h-9 rounded-lg gradient-hero flex items-center justify-center">
                <Store className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl hidden sm:block">LOCAL-KART</span>
            </Link>

            <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:flex">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="pl-10 bg-muted border-0" />
              </div>
            </form>

            <div className="flex items-center gap-1 sm:gap-2">
              <Link to="/wishlist" className="relative p-2 rounded-lg hover:bg-muted transition-colors">
                <Heart className="w-5 h-5" />
              </Link>
              <Link to="/cart" className="relative p-2 rounded-lg hover:bg-muted transition-colors">
                <ShoppingCart className="w-5 h-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                    {cart.length}
                  </span>
                )}
              </Link>
              {unread > 0 && (
                <div className="relative p-2">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-bold">
                    {unread}
                  </span>
                </div>
              )}
              <div className="hidden sm:flex items-center gap-2 ml-2">
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
              <Button variant="ghost" size="icon" className="sm:hidden" onClick={() => setMobileMenu(!mobileMenu)}>
                {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          <form onSubmit={handleSearch} className="pb-3 md:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="pl-10 bg-muted border-0" />
            </div>
          </form>
        </div>

        <nav className="border-t bg-muted/50">
          <div className="container mx-auto px-4 flex gap-1 overflow-x-auto py-2 text-sm">
            {[
              { to: '/shop', label: 'All' },
              { to: '/shop?category=groceries', label: '🛒 Groceries' },
              { to: '/shop?category=vegetables', label: '🥬 Vegetables' },
              { to: '/shop?category=fruits', label: '🍎 Fruits' },
              { to: '/shop?category=dairy', label: '🥛 Dairy' },
              { to: '/shop?category=snacks', label: '🍿 Snacks' },
              { to: '/shop?category=beverages', label: '🥤 Beverages' },
              { to: '/shop?category=household', label: '🏠 Household' },
              { to: '/shop?category=bakery', label: '🍞 Bakery' },
            ].map(cat => (
              <Link key={cat.to} to={cat.to} className="px-3 py-1.5 rounded-full whitespace-nowrap hover:bg-primary hover:text-primary-foreground transition-colors bg-card">
                {cat.label}
              </Link>
            ))}
          </div>
        </nav>

        {mobileMenu && (
          <div className="sm:hidden border-t p-4 bg-card space-y-2">
            <Link to="/orders" className="block p-2 rounded hover:bg-muted" onClick={() => setMobileMenu(false)}>My Orders</Link>
            <button onClick={() => { handleLogout(); }} className="block w-full text-left p-2 rounded hover:bg-muted text-destructive">Logout</button>
          </div>
        )}
      </header>

      <main>{children}</main>

      <footer className="border-t mt-16 py-8 bg-card">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p className="font-display font-bold text-foreground mb-1">LOCAL-KART</p>
          <p>Supporting local businesses, empowering communities.</p>
        </div>
      </footer>
    </div>
  );
}

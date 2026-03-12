import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMyKYC } from '@/hooks/useKYC';
import { LayoutDashboard, Package, PlusCircle, ShoppingBag, DollarSign, Shield, LogOut, Store, Menu, X, BarChart3 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const navItems = [
  { to: '/seller', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/seller/products', icon: Package, label: 'My Products' },
  { to: '/seller/add-product', icon: PlusCircle, label: 'Add Product' },
  { to: '/seller/orders', icon: ShoppingBag, label: 'Orders' },
  { to: '/seller/earnings', icon: DollarSign, label: 'Earnings' },
  { to: '/seller/kyc', icon: Shield, label: 'KYC Verification' },
];

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { data: kyc } = useMyKYC();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background flex">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 gradient-dark text-sidebar-foreground transform transition-transform lg:translate-x-0 lg:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-4 flex items-center gap-3 border-b border-sidebar-border">
            <div className="w-9 h-9 rounded-lg gradient-hero flex items-center justify-center">
              <Store className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-display font-bold text-sm">LOCAL-KART</p>
              <p className="text-xs text-sidebar-foreground/60">Seller Portal</p>
            </div>
            <Button variant="ghost" size="icon" className="lg:hidden ml-auto text-sidebar-foreground" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* KYC Status Badge */}
          {kyc && (
            <div className="mx-3 mt-3 p-2 rounded-lg text-xs font-medium text-center" style={{
              backgroundColor: kyc.status === 'approved' ? 'hsl(var(--secondary) / 0.15)' : kyc.status === 'pending' ? 'hsl(var(--warning) / 0.15)' : kyc.status === 'rejected' ? 'hsl(var(--destructive) / 0.15)' : 'hsl(var(--muted) / 0.15)',
              color: kyc.status === 'approved' ? 'hsl(var(--secondary))' : kyc.status === 'pending' ? 'hsl(var(--warning))' : kyc.status === 'rejected' ? 'hsl(var(--destructive))' : 'hsl(var(--muted-foreground))',
            }}>
              KYC: {kyc.status === 'approved' ? '✅ Verified' : kyc.status === 'pending' ? '⏳ Under Review' : kyc.status === 'rejected' ? '❌ Rejected' : 'Not Submitted'}
            </div>
          )}

          <nav className="flex-1 p-3 space-y-1">
            {navItems.map(item => {
              const active = location.pathname === item.to;
              return (
                <Link key={item.to} to={item.to} onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${active ? 'bg-sidebar-accent text-sidebar-primary' : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'}`}>
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-3 border-t border-sidebar-border">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-sm font-bold">
                {user?.name?.[0] || 'S'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-sidebar-foreground/50 truncate">{user?.email}</p>
              </div>
              <Button variant="ghost" size="icon" className="text-sidebar-foreground/50" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-foreground/20 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 h-14 border-b bg-card flex items-center px-4 gap-3">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="font-display font-semibold text-lg">
            {navItems.find(n => n.to === location.pathname)?.label || 'Seller Dashboard'}
          </h1>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

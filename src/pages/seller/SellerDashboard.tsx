import { useStore, useAuth } from '@/contexts/AppContext';
import SellerLayout from '@/components/layout/SellerLayout';
import { Package, ShoppingBag, DollarSign, TrendingUp, Star } from 'lucide-react';

export default function SellerDashboard() {
  const { products, orders } = useStore();
  const { user } = useAuth();
  const myProducts = products.filter(p => p.sellerId === user?.id || p.sellerName === 'Test Seller');
  const myOrders = orders.filter(o => o.items.some(i => i.sellerId === user?.id));
  const earnings = myOrders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total, 0);
  const approved = myProducts.filter(p => p.status === 'approved').length;

  const stats = [
    { label: 'Total Products', value: myProducts.length, icon: Package, color: 'bg-primary/10 text-primary' },
    { label: 'Active Listings', value: approved, icon: TrendingUp, color: 'bg-secondary/10 text-secondary' },
    { label: 'Orders', value: myOrders.length, icon: ShoppingBag, color: 'bg-info/10 text-info' },
    { label: 'Earnings', value: `₹${earnings}`, icon: DollarSign, color: 'bg-warning/10 text-warning' },
  ];

  return (
    <SellerLayout>
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-2xl font-bold">Welcome back, {user?.name} 👋</h2>
          <p className="text-muted-foreground">Here's your seller overview</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(s => (
            <div key={s.label} className="bg-card border rounded-xl p-4">
              <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center mb-3`}>
                <s.icon className="w-5 h-5" />
              </div>
              <p className="font-display text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-card border rounded-xl p-5">
          <h3 className="font-display font-semibold mb-4">Recent Products</h3>
          {myProducts.length === 0 ? (
            <p className="text-muted-foreground text-sm py-4">No products yet. Add your first product!</p>
          ) : (
            <div className="space-y-3">
              {myProducts.slice(0, 5).map(p => (
                <div key={p.id} className="flex items-center gap-3">
                  <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">₹{p.price}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${p.status === 'approved' ? 'bg-secondary/10 text-secondary' : p.status === 'pending' ? 'bg-warning/10 text-warning' : 'bg-destructive/10 text-destructive'}`}>{p.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </SellerLayout>
  );
}

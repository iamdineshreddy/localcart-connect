import { useAuth } from '@/contexts/AuthContext';
import { useProducts } from '@/hooks/useProducts';
import { useOrders } from '@/hooks/useOrders';
import { useTrustScore, getBadgeInfo } from '@/hooks/useTrustScore';
import { useMyKYC } from '@/hooks/useKYC';
import SellerLayout from '@/components/layout/SellerLayout';
import { Package, ShoppingBag, DollarSign, TrendingUp, Star, Shield } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function SellerDashboard() {
  const { user } = useAuth();
  const { data: products = [] } = useProducts({ sellerId: user?.id });
  const { data: orders = [] } = useOrders('seller');
  const { data: trustScore } = useTrustScore(user?.id || '');
  const { data: kyc } = useMyKYC();

  const earnings = orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total, 0);
  const approved = products.filter(p => p.status === 'approved').length;
  const badge = trustScore ? getBadgeInfo(trustScore.badge) : null;

  // Analytics data
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const ordersByDay = weekDays.map(day => ({
    day,
    orders: Math.floor(Math.random() * 5) + orders.length,
  }));

  const categoryData = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const pieData = Object.entries(categoryData).map(([name, value]) => ({ name, value }));
  const COLORS = ['hsl(24, 95%, 53%)', 'hsl(145, 63%, 42%)', 'hsl(45, 93%, 58%)', 'hsl(210, 80%, 55%)', 'hsl(0, 84%, 60%)'];

  const lowStock = products.filter(p => p.stock < 10);

  const stats = [
    { label: 'Total Products', value: products.length, icon: Package, color: 'bg-primary/10 text-primary' },
    { label: 'Active Listings', value: approved, icon: TrendingUp, color: 'bg-secondary/10 text-secondary' },
    { label: 'Orders', value: orders.length, icon: ShoppingBag, color: 'bg-info/10 text-info' },
    { label: 'Earnings', value: `₹${earnings}`, icon: DollarSign, color: 'bg-warning/10 text-warning' },
  ];

  return (
    <SellerLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">Welcome back, {user?.name} 👋</h2>
            <p className="text-muted-foreground">Here's your seller overview</p>
          </div>
          {trustScore && badge && (
            <div className="text-center">
              <span className={`text-sm px-3 py-1.5 rounded-full font-medium ${badge.color}`}>
                {badge.emoji} {badge.label} Seller
              </span>
              <p className="text-xs text-muted-foreground mt-1">Trust Score: {trustScore.total_score}%</p>
            </div>
          )}
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

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-card border rounded-xl p-5">
            <h3 className="font-display font-semibold mb-4">Orders This Week</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={ordersByDay}>
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="orders" fill="hsl(24, 95%, 53%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-card border rounded-xl p-5">
            <h3 className="font-display font-semibold mb-4">Products by Category</h3>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name }) => name}>
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-sm py-8 text-center">No products yet</p>
            )}
          </div>
        </div>

        {/* Low stock */}
        {lowStock.length > 0 && (
          <div className="bg-card border rounded-xl p-5">
            <h3 className="font-display font-semibold mb-4 text-destructive">⚠️ Low Stock Items</h3>
            <div className="space-y-2">
              {lowStock.map(p => (
                <div key={p.id} className="flex items-center gap-3 text-sm">
                  <img src={p.image} alt={p.name} className="w-8 h-8 rounded object-cover" />
                  <span className="flex-1">{p.name}</span>
                  <span className="text-destructive font-medium">{p.stock} left</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-card border rounded-xl p-5">
          <h3 className="font-display font-semibold mb-4">Recent Products</h3>
          {products.length === 0 ? (
            <p className="text-muted-foreground text-sm py-4">No products yet. Add your first product!</p>
          ) : (
            <div className="space-y-3">
              {products.slice(0, 5).map(p => (
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

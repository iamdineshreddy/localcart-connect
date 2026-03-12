import { useProducts } from '@/hooks/useProducts';
import { useOrders } from '@/hooks/useOrders';
import { useAllProfiles } from '@/hooks/useProfiles';
import AdminLayout from '@/components/layout/AdminLayout';
import { BarChart3, TrendingUp, Users, Package } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function AdminAnalyticsPage() {
  const { data: products = [] } = useProducts();
  const { data: orders = [] } = useOrders('admin');
  const { data: users = [] } = useAllProfiles();

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const avgTrust = products.length > 0 ? Math.round(products.reduce((sum, p) => sum + p.trust_score, 0) / products.length) : 0;

  const stats = [
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, change: '+12%', icon: TrendingUp },
    { label: 'Active Users', value: `${users.length}`, change: '+8%', icon: Users },
    { label: 'Products Listed', value: `${products.length}`, change: `+${products.filter(p => p.status === 'pending').length}`, icon: Package },
    { label: 'Avg Trust Score', value: `${avgTrust}%`, change: '+2%', icon: BarChart3 },
  ];

  // Order trend data
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const orderTrend = days.map(day => ({ day, orders: Math.floor(Math.random() * 10) + orders.length, revenue: Math.floor(Math.random() * 5000) + totalRevenue / 7 }));

  // Category breakdown
  const categoryBreakdown = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const categoryData = Object.entries(categoryBreakdown).map(([category, count]) => ({ category, count }));

  return (
    <AdminLayout>
      <h2 className="font-display text-2xl font-bold mb-6">Analytics</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-card border rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <s.icon className="w-5 h-5 text-muted-foreground" />
              <span className="text-xs text-secondary font-medium">{s.change}</span>
            </div>
            <p className="font-display text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-card border rounded-xl p-5">
          <h3 className="font-display font-semibold mb-4">Order Trends</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={orderTrend}>
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="orders" stroke="hsl(24, 95%, 53%)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border rounded-xl p-5">
          <h3 className="font-display font-semibold mb-4">Products by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryData}>
              <XAxis dataKey="category" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(145, 63%, 42%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AdminLayout>
  );
}

import AdminLayout from '@/components/layout/AdminLayout';
import { BarChart3, TrendingUp, Users, Package } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const stats = [
    { label: 'Total Revenue', value: '₹45,230', change: '+12%', icon: TrendingUp },
    { label: 'Active Users', value: '128', change: '+8%', icon: Users },
    { label: 'Products Listed', value: '52', change: '+5', icon: Package },
    { label: 'Avg Trust Score', value: '86%', change: '+2%', icon: BarChart3 },
  ];

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

      <div className="bg-card border rounded-xl p-8 text-center">
        <BarChart3 className="w-16 h-16 mx-auto text-muted-foreground/30 mb-3" />
        <p className="text-muted-foreground">Detailed charts and analytics coming soon</p>
        <p className="text-xs text-muted-foreground mt-1">Connect to Lovable Cloud for real-time data analytics</p>
      </div>
    </AdminLayout>
  );
}

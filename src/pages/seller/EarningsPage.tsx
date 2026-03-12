import { useOrders } from '@/hooks/useOrders';
import SellerLayout from '@/components/layout/SellerLayout';
import { DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function EarningsPage() {
  const { data: orders = [] } = useOrders('seller');

  const delivered = orders.filter(o => o.status === 'delivered');
  const totalEarnings = delivered.reduce((sum, o) => sum + o.total, 0);
  const pendingEarnings = orders.filter(o => ['placed', 'confirmed', 'shipped', 'out_for_delivery'].includes(o.status)).reduce((sum, o) => sum + o.total, 0);
  
  // Monthly earnings mock (last 6 months)
  const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  const monthlyData = months.map(month => ({
    month,
    earnings: Math.floor(Math.random() * 5000) + totalEarnings / 6,
  }));

  return (
    <SellerLayout>
      <h2 className="font-display text-2xl font-bold mb-6">Earnings</h2>
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Earnings', value: `₹${totalEarnings}`, desc: 'All time' },
          { label: 'This Month', value: `₹${Math.floor(totalEarnings / 3)}`, desc: 'March 2026' },
          { label: 'Pending', value: `₹${pendingEarnings}`, desc: 'Awaiting delivery' },
        ].map(s => (
          <div key={s.label} className="bg-card border rounded-xl p-5">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="font-display text-3xl font-bold mt-1">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.desc}</p>
          </div>
        ))}
      </div>
      
      <div className="bg-card border rounded-xl p-5">
        <h3 className="font-display font-semibold mb-4">Monthly Earnings</h3>
        {orders.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v: number) => `₹${v.toFixed(0)}`} />
              <Bar dataKey="earnings" fill="hsl(145, 63%, 42%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Start selling to see your earnings here</p>
          </div>
        )}
      </div>
    </SellerLayout>
  );
}

import { useProducts } from '@/hooks/useProducts';
import { useOrders } from '@/hooks/useOrders';
import { useAllProfiles } from '@/hooks/useProfiles';
import AdminLayout from '@/components/layout/AdminLayout';
import { Users, Package, ShieldCheck, ShoppingBag } from 'lucide-react';

export default function AdminDashboard() {
  const { data: products = [] } = useProducts();
  const { data: orders = [] } = useOrders('admin');
  const { data: users = [] } = useAllProfiles();
  const pending = products.filter(p => p.status === 'pending').length;

  const stats = [
    { label: 'Total Users', value: users.length, icon: Users, color: 'bg-primary/10 text-primary' },
    { label: 'Products', value: products.length, icon: Package, color: 'bg-secondary/10 text-secondary' },
    { label: 'Pending Approval', value: pending, icon: ShieldCheck, color: 'bg-warning/10 text-warning' },
    { label: 'Orders', value: orders.length, icon: ShoppingBag, color: 'bg-info/10 text-info' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-2xl font-bold">Admin Dashboard</h2>
          <p className="text-muted-foreground">Platform overview and management</p>
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

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-card border rounded-xl p-5">
            <h3 className="font-display font-semibold mb-4">Recent Orders</h3>
            {orders.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">No orders yet</p>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 5).map(o => (
                  <div key={o.id} className="flex justify-between text-sm">
                    <span>#{o.id.slice(0, 8)} — {o.buyer_name}</span>
                    <span className="font-medium">₹{o.total}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="bg-card border rounded-xl p-5">
            <h3 className="font-display font-semibold mb-4">Pending Products</h3>
            {pending === 0 ? (
              <p className="text-sm text-muted-foreground py-4">All products reviewed</p>
            ) : (
              <div className="space-y-3">
                {products.filter(p => p.status === 'pending').slice(0, 5).map(p => (
                  <div key={p.id} className="flex items-center gap-3 text-sm">
                    <img src={p.image} alt={p.name} className="w-8 h-8 rounded object-cover" />
                    <span className="flex-1 truncate">{p.name}</span>
                    <span className="text-warning text-xs">Pending</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

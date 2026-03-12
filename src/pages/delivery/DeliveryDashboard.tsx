import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders, useUpdateOrderStatus } from '@/hooks/useOrders';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Truck, Package, LogOut, Store } from 'lucide-react';
import { toast } from 'sonner';

export default function DeliveryDashboard() {
  const { user, logout } = useAuth();
  const { data: orders = [], isLoading } = useOrders('delivery');
  const updateStatus = useUpdateOrderStatus();
  const navigate = useNavigate();

  const handleLogout = async () => { await logout(); navigate('/login'); };

  const statusOptions = ['shipped', 'out_for_delivery', 'delivered'];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card shadow-card">
        <div className="container mx-auto px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
              <Truck className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold">LOCAL-KART Delivery</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{user?.name}</span>
            <Button variant="ghost" size="icon" onClick={handleLogout}><LogOut className="w-4 h-4" /></Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <h2 className="font-display text-2xl font-bold mb-6">My Deliveries</h2>

        {isLoading ? (
          <div className="text-center py-16 text-muted-foreground">Loading...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <Truck className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">No deliveries assigned yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-card border rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-display font-semibold">Order #{order.id.slice(0, 8)}</p>
                    <p className="text-xs text-muted-foreground">{order.buyer_name} · {new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <Select value={order.status} onValueChange={v => updateStatus.mutate({ orderId: order.id, status: v })}>
                    <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(s => (
                        <SelectItem key={s} value={s} className="capitalize">{s.replace('_', ' ')}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-sm text-muted-foreground">📍 {order.address}</p>
                <div className="space-y-2 mt-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <img src={item.product_image} alt={item.product_name} className="w-8 h-8 rounded object-cover" />
                      <span className="flex-1">{item.product_name} × {item.quantity}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t mt-3 pt-3 text-right font-display font-bold">Total: ₹{order.total}</div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

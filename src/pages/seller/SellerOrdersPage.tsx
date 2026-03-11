import { useStore, useAuth } from '@/contexts/AppContext';
import SellerLayout from '@/components/layout/SellerLayout';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OrderStatus } from '@/types';
import { toast } from 'sonner';

export default function SellerOrdersPage() {
  const { orders, updateOrderStatus } = useStore();
  const { user } = useAuth();
  // Show all orders for demo
  const myOrders = orders;

  return (
    <SellerLayout>
      <h2 className="font-display text-2xl font-bold mb-6">Orders Received</h2>
      {myOrders.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">No orders yet.</div>
      ) : (
        <div className="space-y-4">
          {myOrders.map(order => (
            <div key={order.id} className="bg-card border rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-display font-semibold">Order #{order.id.slice(-6)}</p>
                  <p className="text-xs text-muted-foreground">{order.buyerName} · {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <Select value={order.status} onValueChange={v => { updateOrderStatus(order.id, v as OrderStatus); toast.success('Status updated'); }}>
                  <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['placed', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(s => (
                      <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <img src={item.productImage} alt={item.productName} className="w-8 h-8 rounded object-cover" />
                    <span className="flex-1">{item.productName} × {item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="border-t mt-3 pt-3 text-right font-display font-bold">Total: ₹{order.total}</div>
            </div>
          ))}
        </div>
      )}
    </SellerLayout>
  );
}

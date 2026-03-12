import { useOrders, useUpdateOrderStatus } from '@/hooks/useOrders';
import SellerLayout from '@/components/layout/SellerLayout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function SellerOrdersPage() {
  const { data: orders = [], isLoading } = useOrders('seller');
  const updateStatus = useUpdateOrderStatus();

  return (
    <SellerLayout>
      <h2 className="font-display text-2xl font-bold mb-6">Orders Received</h2>
      {isLoading ? (
        <div className="text-center py-16 text-muted-foreground">Loading...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">No orders yet.</div>
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
                  <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['placed', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'].map(s => (
                      <SelectItem key={s} value={s} className="capitalize">{s.replace('_', ' ')}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
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
    </SellerLayout>
  );
}

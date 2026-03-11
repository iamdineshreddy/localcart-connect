import { useStore, useAuth } from '@/contexts/AppContext';
import BuyerLayout from '@/components/layout/BuyerLayout';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';

const statusColors: Record<string, string> = {
  placed: 'bg-info text-info-foreground',
  confirmed: 'bg-primary text-primary-foreground',
  shipped: 'bg-warning text-warning-foreground',
  delivered: 'bg-secondary text-secondary-foreground',
  cancelled: 'bg-destructive text-destructive-foreground',
};

export default function OrdersPage() {
  const { orders } = useStore();
  const { user } = useAuth();
  const myOrders = orders.filter(o => o.buyerId === user?.id);

  if (myOrders.length === 0) {
    return (
      <BuyerLayout>
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-5xl mb-4">📦</p>
          <h2 className="font-display text-xl font-bold mb-2">No orders yet</h2>
          <p className="text-muted-foreground mb-4">Start shopping to see your orders here</p>
          <Link to="/shop"><button className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium">Shop Now</button></Link>
        </div>
      </BuyerLayout>
    );
  }

  return (
    <BuyerLayout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="font-display text-2xl font-bold mb-6">My Orders</h1>
        <div className="space-y-4">
          {myOrders.map(order => (
            <div key={order.id} className="bg-card border rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-display font-semibold">Order #{order.id.slice(-6)}</p>
                  <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${statusColors[order.status] || ''}`}>{order.status}</span>
              </div>
              <div className="space-y-2">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <img src={item.productImage} alt={item.productName} className="w-10 h-10 rounded-lg object-cover" />
                    <span className="flex-1">{item.productName} × {item.quantity}</span>
                    <span className="font-medium">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="border-t mt-3 pt-3 flex justify-between">
                <span className="text-sm text-muted-foreground">Delivery: {order.address}</span>
                <span className="font-display font-bold">Total: ₹{order.total}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </BuyerLayout>
  );
}

import { useOrders } from '@/hooks/useOrders';
import BuyerLayout from '@/components/layout/BuyerLayout';
import { Link } from 'react-router-dom';
import OrderTimeline from '@/components/OrderTimeline';

export default function OrdersPage() {
  const { data: orders = [], isLoading } = useOrders('buyer');

  if (isLoading) return <BuyerLayout><div className="container mx-auto px-4 py-20 text-center text-muted-foreground">Loading...</div></BuyerLayout>;

  if (orders.length === 0) {
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
        <div className="space-y-5">
          {orders.map(order => (
            <div key={order.id} className="bg-card border rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-display font-semibold">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <span className="text-xs text-muted-foreground capitalize">
                  {(order as any).payment_method === 'online' ? '💳 Online' : '💵 COD'}
                </span>
              </div>

              {/* Order tracking timeline */}
              <OrderTimeline status={order.status} />

              <div className="space-y-2 mt-2">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <img src={item.product_image} alt={item.product_name} className="w-10 h-10 rounded-lg object-cover" />
                    <span className="flex-1">{item.product_name} × {item.quantity}</span>
                    <span className="font-medium">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="border-t mt-3 pt-3 flex justify-between items-start gap-2">
                <span className="text-xs text-muted-foreground flex-1">📍 {order.address}</span>
                <span className="font-display font-bold whitespace-nowrap">₹{order.total}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </BuyerLayout>
  );
}

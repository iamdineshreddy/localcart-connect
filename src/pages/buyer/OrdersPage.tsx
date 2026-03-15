import { useOrders } from '@/hooks/useOrders';
import BuyerLayout from '@/components/layout/BuyerLayout';
import { Link } from 'react-router-dom';
import { Package, CheckCircle2, Truck, MapPin, Home, XCircle } from 'lucide-react';

const ORDER_STEPS = [
  { key: 'placed', label: 'Placed', icon: Package },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: MapPin },
  { key: 'delivered', label: 'Delivered', icon: Home },
];

function getStepIndex(status: string) {
  if (status === 'cancelled') return -1;
  return ORDER_STEPS.findIndex(s => s.key === status);
}

function OrderTimeline({ status }: { status: string }) {
  const currentIdx = getStepIndex(status);
  const isCancelled = status === 'cancelled';

  if (isCancelled) {
    return (
      <div className="flex items-center gap-2 py-3 px-2 bg-destructive/5 rounded-lg">
        <XCircle className="w-5 h-5 text-destructive" />
        <span className="text-sm font-medium text-destructive">Order Cancelled</span>
      </div>
    );
  }

  return (
    <div className="py-3">
      <div className="flex items-center justify-between relative">
        {/* Background line */}
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-muted z-0" />
        {/* Progress line */}
        <div
          className="absolute top-4 left-4 h-0.5 bg-primary z-[1] transition-all duration-500"
          style={{ width: `calc(${(currentIdx / (ORDER_STEPS.length - 1)) * 100}% - 2rem)` }}
        />
        {ORDER_STEPS.map((step, i) => {
          const isCompleted = i <= currentIdx;
          const isCurrent = i === currentIdx;
          const Icon = step.icon;
          return (
            <div key={step.key} className="flex flex-col items-center z-10 relative">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                  isCompleted
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'bg-card border-muted text-muted-foreground'
                } ${isCurrent ? 'ring-2 ring-primary/30 ring-offset-1 ring-offset-background' : ''}`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span
                className={`text-[10px] mt-1.5 text-center leading-tight max-w-[56px] ${
                  isCompleted ? 'text-primary font-medium' : 'text-muted-foreground'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

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

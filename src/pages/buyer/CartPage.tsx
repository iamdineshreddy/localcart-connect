import { useAuth } from '@/contexts/AuthContext';
import { useCart, useRemoveFromCart, useUpdateCartQuantity } from '@/hooks/useCart';
import { usePlaceOrder, useOrders } from '@/hooks/useOrders';
import BuyerLayout from '@/components/layout/BuyerLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, ShoppingBag, Minus, Plus, MapPin, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useState } from 'react';
import OrderTimeline from '@/components/OrderTimeline';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CartPage() {
  const { data: cart = [], isLoading } = useCart();
  const removeFromCart = useRemoveFromCart();
  const updateQuantity = useUpdateCartQuantity();
  const placeOrder = usePlaceOrder();
  const { user } = useAuth();
  const [address, setAddress] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
  const [locating, setLocating] = useState(false);

  const cartTotal = cart.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );
          const data = await res.json();
          const addr = data.display_name || `${latitude}, ${longitude}`;
          setAddress(addr);
          toast.success('Location detected!');
        } catch {
          toast.error('Could not fetch address from location');
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setLocating(false);
        toast.error(err.message || 'Could not get your location');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const placeOrderFn = (paymentId?: string) => {
    placeOrder.mutate({
      items: cart.map(item => ({
        product_id: item.product_id,
        product_name: item.product?.name || '',
        product_image: item.product?.image || '',
        quantity: item.quantity,
        price: item.product?.price || 0,
        seller_id: item.product?.seller_id || '',
        seller_name: item.product?.seller_name || '',
      })),
      total: cartTotal,
      address,
      payment_method: paymentMethod,
      payment_id: paymentId,
    });
    setShowCheckout(false);
    setAddress('');
  };

  const handleOrder = () => {
    if (!address.trim()) { toast.error('Enter delivery address'); return; }

    if (paymentMethod === 'online') {
      const options = {
        key: 'rzp_test_SMT1XI6sdyhuQy',
        amount: Math.round(cartTotal * 100),
        currency: 'INR',
        name: 'LOCAL-KART',
        description: `Order of ${cart.length} items`,
        handler: (response: any) => {
          toast.success('Payment successful!');
          placeOrderFn(response.razorpay_payment_id);
        },
        prefill: {
          email: user?.email || '',
          name: user?.name || '',
        },
        theme: { color: '#16a34a' },
        modal: {
          ondismiss: () => toast.info('Payment cancelled'),
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      placeOrderFn();
    }
  };

  const { data: activeOrders = [] } = useOrders('buyer');
  const recentActiveOrders = activeOrders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').slice(0, 3);

  if (isLoading) return <BuyerLayout><div className="container mx-auto px-4 py-20 text-center text-muted-foreground">Loading...</div></BuyerLayout>;

  if (cart.length === 0) {
    return (
      <BuyerLayout>
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-5xl mb-4">🛒</p>
          <h2 className="font-display text-xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-4">Start adding products to your cart</p>
          <Link to="/shop"><Button>Browse Products</Button></Link>
        </div>
      </BuyerLayout>
    );
  }

  return (
    <BuyerLayout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="font-display text-2xl font-bold mb-6">Shopping Cart ({cart.length} items)</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {cart.map(item => (
              <div key={item.id} className="flex gap-4 bg-card border rounded-xl p-4">
                <img src={item.product?.image} alt={item.product?.name} className="w-20 h-20 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.product_id}`} className="font-medium text-sm hover:text-primary">{item.product?.name}</Link>
                  <p className="text-xs text-muted-foreground">{item.product?.seller_name}</p>
                  <p className="font-display font-bold mt-1">₹{item.product?.price}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeFromCart.mutate(item.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <div className="flex items-center border rounded-lg">
                    <button onClick={() => updateQuantity.mutate({ itemId: item.id, quantity: item.quantity - 1 })} className="px-2 py-1 hover:bg-muted"><Minus className="w-3 h-3" /></button>
                    <span className="px-3 py-1 border-x text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity.mutate({ itemId: item.id, quantity: item.quantity + 1 })} className="px-2 py-1 hover:bg-muted"><Plus className="w-3 h-3" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-card border rounded-xl p-6 h-fit sticky top-32">
            <h3 className="font-display font-bold mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{cartTotal}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span className="text-secondary font-medium">FREE</span></div>
              <div className="border-t pt-2 flex justify-between font-display font-bold text-lg"><span>Total</span><span>₹{cartTotal}</span></div>
            </div>

            {showCheckout ? (
              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Delivery Address</label>
                  <Input placeholder="Enter delivery address" value={address} onChange={e => setAddress(e.target.value)} />
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full"
                    onClick={handleGetLocation}
                    disabled={locating}
                  >
                    {locating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <MapPin className="w-4 h-4 mr-2" />}
                    {locating ? 'Detecting location...' : 'Use Current Location'}
                  </Button>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Payment Method</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-3 rounded-lg border-2 text-center text-sm font-medium transition-colors ${
                        paymentMethod === 'cod'
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-muted-foreground'
                      }`}
                    >
                      💵 Cash on Delivery
                    </button>
                    <button
                      onClick={() => setPaymentMethod('online')}
                      className={`p-3 rounded-lg border-2 text-center text-sm font-medium transition-colors ${
                        paymentMethod === 'online'
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-muted-foreground'
                      }`}
                    >
                      💳 Pay Online
                    </button>
                  </div>
                </div>

                <Button className="w-full" onClick={handleOrder} disabled={placeOrder.isPending}>
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  {placeOrder.isPending ? 'Placing...' : paymentMethod === 'online' ? `Pay ₹${cartTotal}` : 'Place Order (COD)'}
                </Button>
                <Button variant="outline" className="w-full" onClick={() => setShowCheckout(false)}>Cancel</Button>
              </div>
            ) : (
              <Button className="w-full mt-4" onClick={() => setShowCheckout(true)}>Proceed to Checkout</Button>
            )}
          </div>
        </div>
      </div>
    </BuyerLayout>
  );
}

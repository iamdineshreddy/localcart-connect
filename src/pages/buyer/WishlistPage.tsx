import { useStore } from '@/contexts/AppContext';
import BuyerLayout from '@/components/layout/BuyerLayout';
import { Button } from '@/components/ui/button';
import { Trash2, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, addToCart } = useStore();

  if (wishlist.length === 0) {
    return (
      <BuyerLayout>
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-5xl mb-4">💝</p>
          <h2 className="font-display text-xl font-bold mb-2">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-4">Save products you love for later</p>
          <Link to="/shop"><Button>Browse Products</Button></Link>
        </div>
      </BuyerLayout>
    );
  }

  return (
    <BuyerLayout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="font-display text-2xl font-bold mb-6">Wishlist ({wishlist.length} items)</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {wishlist.map(item => (
            <div key={item.id} className="bg-card rounded-xl border overflow-hidden">
              <Link to={`/product/${item.product.id}`}>
                <div className="aspect-square bg-muted overflow-hidden">
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                </div>
              </Link>
              <div className="p-3">
                <p className="font-medium text-sm truncate">{item.product.name}</p>
                <p className="font-display font-bold mt-1">₹{item.product.price}</p>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" className="flex-1 text-xs" onClick={() => { addToCart(item.product); toast.success('Added to cart'); }}>
                    <ShoppingCart className="w-3 h-3 mr-1" /> Add
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => removeFromWishlist(item.product.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </BuyerLayout>
  );
}

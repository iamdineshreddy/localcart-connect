import { useParams, Link } from 'react-router-dom';
import { useStore } from '@/contexts/AppContext';
import BuyerLayout from '@/components/layout/BuyerLayout';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart, Heart, Shield, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getProduct, addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useStore();
  const product = getProduct(id || '');
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <BuyerLayout>
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-4xl mb-3">😕</p>
          <p className="font-display font-semibold">Product not found</p>
          <Link to="/shop"><Button variant="outline" className="mt-4">Back to Shop</Button></Link>
        </div>
      </BuyerLayout>
    );
  }

  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const inWishlist = isInWishlist(product.id);
  const trustLevel = product.trustScore >= 80 ? 'high' : product.trustScore >= 60 ? 'medium' : 'low';

  return (
    <BuyerLayout>
      <div className="container mx-auto px-4 py-6">
        <Link to="/shop" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to shop
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="aspect-square rounded-2xl overflow-hidden bg-muted border">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>

          {/* Details */}
          <div>
            <p className="text-sm text-muted-foreground capitalize">{product.category}</p>
            <h1 className="font-display text-2xl md:text-3xl font-bold mt-1">{product.name}</h1>
            
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-accent text-accent" />
                <span className="font-medium">{product.rating}</span>
                <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium trust-badge-${trustLevel}`}>
                <Shield className="w-3 h-3 inline mr-1" />
                Trust {product.trustScore}%
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="font-display text-3xl font-bold">₹{product.price}</span>
              {product.mrp > product.price && (
                <>
                  <span className="text-lg text-muted-foreground line-through">₹{product.mrp}</span>
                  <span className="text-sm font-medium text-secondary">{discount}% off</span>
                </>
              )}
            </div>

            <p className="text-muted-foreground mt-4">{product.description}</p>
            <p className="text-sm text-muted-foreground mt-2">Unit: {product.unit} · Stock: {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}</p>
            <p className="text-sm mt-1">Sold by: <span className="font-medium text-primary">{product.sellerName}</span></p>

            {/* Quantity */}
            <div className="flex items-center gap-3 mt-6">
              <span className="text-sm font-medium">Qty:</span>
              <div className="flex items-center border rounded-lg">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-1.5 text-lg hover:bg-muted">-</button>
                <span className="px-4 py-1.5 border-x font-medium">{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="px-3 py-1.5 text-lg hover:bg-muted">+</button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <Button size="lg" className="flex-1" onClick={() => { addToCart(product, qty); toast.success('Added to cart'); }} disabled={product.stock === 0}>
                <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
              </Button>
              <Button size="lg" variant="outline" onClick={() => { inWishlist ? removeFromWishlist(product.id) : addToWishlist(product); toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist'); }}>
                <Heart className={`w-4 h-4 ${inWishlist ? 'fill-destructive text-destructive' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </BuyerLayout>
  );
}

import { useParams, Link } from 'react-router-dom';
import { useProduct } from '@/hooks/useProducts';
import { useAddToCart } from '@/hooks/useCart';
import { useWishlist, useAddToWishlist, useRemoveFromWishlist } from '@/hooks/useWishlist';
import { useTrustScore, getBadgeInfo } from '@/hooks/useTrustScore';
import { useUserLocation, useSellerLocation } from '@/hooks/useUserLocation';
import { calculateDistance, getEstimatedDelivery } from '@/lib/distance';
import { useProductReviews, useMyReview, useSubmitReview } from '@/hooks/useReviews';
import BuyerLayout from '@/components/layout/BuyerLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, ShoppingCart, Heart, Shield, ArrowLeft, MapPin, Clock, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

function StarRating({ value, onChange, readonly = false }: { value: number; onChange?: (v: number) => void; readonly?: boolean }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type="button"
          disabled={readonly}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer'}`}
          onClick={() => onChange?.(i)}
          onMouseEnter={() => !readonly && setHover(i)}
          onMouseLeave={() => !readonly && setHover(0)}
        >
          <Star className={`w-5 h-5 ${(hover || value) >= i ? 'fill-accent text-accent' : 'text-muted-foreground/30'}`} />
        </button>
      ))}
    </div>
  );
}

/** Hook to get buyer coordinates — tries profile first, falls back to browser geolocation */
function useBuyerCoords() {
  const { data: profileLoc } = useUserLocation();
  const [browserCoords, setBrowserCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [detecting, setDetecting] = useState(false);

  const hasProfileCoords = !!(profileLoc?.latitude && profileLoc?.longitude);

  useEffect(() => {
    // If profile already has coords, skip browser geolocation
    if (hasProfileCoords) return;
    // Auto-detect via browser
    if (!navigator.geolocation) return;
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setBrowserCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setDetecting(false);
      },
      () => setDetecting(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [hasProfileCoords]);

  const coords = hasProfileCoords
    ? { latitude: profileLoc!.latitude!, longitude: profileLoc!.longitude! }
    : browserCoords;

  return { coords, detecting };
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useProduct(id || '');
  const addToCart = useAddToCart();
  const { data: wishlist = [] } = useWishlist();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const { data: trustScore } = useTrustScore(product?.seller_id || '');
  const { coords: buyerCoords, detecting: detectingLocation } = useBuyerCoords();
  const { data: sellerLocation } = useSellerLocation(product?.seller_id);
  const [qty, setQty] = useState(1);

  // Reviews
  const { data: reviews = [] } = useProductReviews(id || '');
  const { data: myReview } = useMyReview(id || '');
  const submitReview = useSubmitReview();
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    if (myReview) {
      setReviewRating(myReview.rating);
      setReviewComment(myReview.comment);
    }
  }, [myReview]);

  const distance = (buyerCoords && sellerLocation?.latitude && sellerLocation?.longitude)
    ? calculateDistance(buyerCoords.latitude, buyerCoords.longitude, sellerLocation.latitude, sellerLocation.longitude)
    : null;
  const estimatedTime = distance != null ? getEstimatedDelivery(distance) : null;

  if (isLoading) return <BuyerLayout><div className="container mx-auto px-4 py-20 text-center text-muted-foreground">Loading...</div></BuyerLayout>;

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
  const wishlistItem = wishlist.find(w => w.product?.id === product.id);
  const inWishlist = !!wishlistItem;
  const score = trustScore?.total_score ?? product.trust_score;
  const trustLevel = score >= 80 ? 'high' : score >= 60 ? 'medium' : 'low';
  const badge = trustScore ? getBadgeInfo(trustScore.badge) : null;

  const handleSubmitReview = () => {
    if (reviewRating === 0) return;
    submitReview.mutate({ productId: product.id, rating: reviewRating, comment: reviewComment });
  };

  return (
    <BuyerLayout>
      <div className="container mx-auto px-4 py-6">
        <Link to="/shop" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to shop
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-square rounded-2xl overflow-hidden bg-muted border">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>

          <div>
            <p className="text-sm text-muted-foreground capitalize">{product.category}</p>
            <h1 className="font-display text-2xl md:text-3xl font-bold mt-1">{product.name}</h1>
            
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-accent text-accent" />
                <span className="font-medium">{product.rating}</span>
                <span className="text-sm text-muted-foreground">({product.review_count} reviews)</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium trust-badge-${trustLevel}`}>
                <Shield className="w-3 h-3 inline mr-1" />
                Trust {score}%
              </span>
              {badge && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.color}`}>
                  {badge.emoji} {badge.label}
                </span>
              )}
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
            <p className="text-sm mt-1">Sold by: <span className="font-medium text-primary">{product.seller_name}</span></p>

            {/* Distance & Estimated Delivery */}
            {detectingLocation && (
              <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" /> Detecting your location for delivery estimate...
              </div>
            )}
            {distance != null && estimatedTime && (
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <span className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full bg-accent text-accent-foreground">
                  <MapPin className="w-3.5 h-3.5" /> {distance.toFixed(1)} km away
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full bg-secondary/20 text-secondary-foreground">
                  <Clock className="w-3.5 h-3.5" /> Est. delivery: {estimatedTime}
                </span>
              </div>
            )}
            {!detectingLocation && distance == null && (
              <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Enable location access to see delivery estimate
              </p>
            )}

            <div className="flex items-center gap-3 mt-6">
              <span className="text-sm font-medium">Qty:</span>
              <div className="flex items-center border rounded-lg">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-1.5 text-lg hover:bg-muted">-</button>
                <span className="px-4 py-1.5 border-x font-medium">{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="px-3 py-1.5 text-lg hover:bg-muted">+</button>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button size="lg" className="flex-1" onClick={() => addToCart.mutate({ productId: product.id, quantity: qty })} disabled={product.stock === 0}>
                <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
              </Button>
              <Button size="lg" variant="outline" onClick={() => {
                if (inWishlist && wishlistItem) removeFromWishlist.mutate(wishlistItem.id);
                else addToWishlist.mutate(product.id);
              }}>
                <Heart className={`w-4 h-4 ${inWishlist ? 'fill-destructive text-destructive' : ''}`} />
              </Button>
            </div>
          </div>
        </div>

        {/* Review Section */}
        <div className="mt-10">
          <h2 className="font-display text-xl font-bold mb-4">Ratings & Reviews</h2>

          {/* Write / Edit Review */}
          <div className="bg-card border rounded-xl p-5 mb-6">
            <h3 className="font-semibold text-sm mb-2">{myReview ? 'Update your review' : 'Write a review'}</h3>
            <StarRating value={reviewRating} onChange={setReviewRating} />
            <Textarea
              placeholder="Share your experience with this product..."
              value={reviewComment}
              onChange={e => setReviewComment(e.target.value)}
              className="mt-3"
              rows={3}
            />
            <Button
              size="sm"
              className="mt-3"
              onClick={handleSubmitReview}
              disabled={reviewRating === 0 || submitReview.isPending}
            >
              {submitReview.isPending ? 'Submitting...' : myReview ? 'Update Review' : 'Submit Review'}
            </Button>
          </div>

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <p className="text-sm text-muted-foreground">No reviews yet. Be the first to review!</p>
          ) : (
            <div className="space-y-4">
              {reviews.map(r => (
                <div key={r.id} className="bg-card border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{r.buyer_name || 'Anonymous'}</span>
                    <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</span>
                  </div>
                  <StarRating value={r.rating} readonly />
                  {r.comment && <p className="text-sm text-muted-foreground mt-2">{r.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </BuyerLayout>
  );
}

import { Link } from 'react-router-dom';
import { useStore, useAuth } from '@/contexts/AppContext';
import { CATEGORIES } from '@/types';
import BuyerLayout from '@/components/layout/BuyerLayout';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart, ArrowRight, TrendingUp, Shield, Truck } from 'lucide-react';
import { toast } from 'sonner';

export default function HomePage() {
  const { products, addToCart } = useStore();
  const { user } = useAuth();
  const approved = products.filter(p => p.status === 'approved');
  const trending = [...approved].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 8);
  const deals = [...approved].sort((a, b) => (b.mrp - b.price) / b.mrp - (a.mrp - a.price) / a.mrp).slice(0, 4);

  return (
    <BuyerLayout>
      {/* Hero */}
      <section className="gradient-hero py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-4 animate-fade-in">
              Fresh from your<br />neighbourhood
            </h1>
            <p className="text-primary-foreground/80 text-lg mb-6">
              Shop groceries, vegetables, fruits & daily essentials from verified local sellers near you.
            </p>
            <div className="flex gap-3">
              <Link to="/shop">
                <Button size="lg" variant="secondary" className="font-display">
                  Shop Now <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-8 border-b bg-card">
        <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Shield, title: 'KYC Verified', desc: 'All sellers verified' },
            { icon: Truck, title: 'Quick Delivery', desc: 'From nearby shops' },
            { icon: TrendingUp, title: 'Trust Scores', desc: 'Transparent ratings' },
          ].map(f => (
            <div key={f.title} className="flex items-center gap-3 p-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-display font-semibold text-sm">{f.title}</p>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-10">
        <h2 className="font-display text-xl font-bold mb-5">Shop by Category</h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {CATEGORIES.map(cat => (
            <Link key={cat.value} to={`/shop?category=${cat.value}`} className="flex flex-col items-center p-3 rounded-xl bg-card border hover:shadow-elevated hover:border-primary/30 transition-all group">
              <span className="text-3xl mb-1 group-hover:scale-110 transition-transform">{cat.emoji}</span>
              <span className="text-xs font-medium text-center">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Deals */}
      <section className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-bold">🔥 Best Deals</h2>
          <Link to="/shop" className="text-sm text-primary hover:underline">View all</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {deals.map(product => {
            const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
            return (
              <Link key={product.id} to={`/product/${product.id}`} className="bg-card rounded-xl border overflow-hidden hover:shadow-elevated transition-all group">
                <div className="aspect-square bg-muted relative overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
                  {discount > 0 && (
                    <span className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-0.5 rounded-full">{discount}% OFF</span>
                  )}
                </div>
                <div className="p-3">
                  <p className="font-medium text-sm truncate">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.sellerName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-display font-bold">₹{product.price}</span>
                    {product.mrp > product.price && <span className="text-xs text-muted-foreground line-through">₹{product.mrp}</span>}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Trending */}
      <section className="container mx-auto px-4 py-6 pb-12">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-bold">⭐ Trending Products</h2>
          <Link to="/shop" className="text-sm text-primary hover:underline">View all</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {trending.map(product => (
            <Link key={product.id} to={`/product/${product.id}`} className="bg-card rounded-xl border overflow-hidden hover:shadow-elevated transition-all group">
              <div className="aspect-square bg-muted overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
              </div>
              <div className="p-3">
                <p className="font-medium text-sm truncate">{product.name}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3 fill-accent text-accent" />
                  <span className="text-xs">{product.rating}</span>
                  <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
                </div>
                <p className="font-display font-bold mt-1">₹{product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </BuyerLayout>
  );
}

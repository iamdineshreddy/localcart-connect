import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import { useAddToCart } from '@/hooks/useCart';
import { useAllTrustScores, getBadgeInfo } from '@/hooks/useTrustScore';
import { CATEGORIES, ProductCategory } from '@/types';
import BuyerLayout from '@/components/layout/BuyerLayout';
import { Star, ShoppingCart, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ShopPage() {
  const { data: allProducts = [], isLoading } = useProducts({ status: 'approved' });
  const addToCart = useAddToCart();
  const { data: trustScores = [] } = useAllTrustScores();
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') as ProductCategory | null;
  const search = searchParams.get('search')?.toLowerCase() || '';

  const filtered = useMemo(() => {
    return allProducts
      .filter(p => !category || p.category === category)
      .filter(p => !search || p.name.toLowerCase().includes(search) || p.category.includes(search));
  }, [allProducts, category, search]);

  return (
    <BuyerLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold">
              {category ? CATEGORIES.find(c => c.value === category)?.label || 'Shop' : search ? `Results for "${search}"` : 'All Products'}
            </h1>
            <p className="text-sm text-muted-foreground">{filtered.length} products</p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-muted-foreground">Loading products...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-display font-semibold">No products found</p>
            <p className="text-sm text-muted-foreground">Try a different search or category</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map(product => {
              const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
              return (
                <div key={product.id} className="bg-card rounded-xl border overflow-hidden hover:shadow-elevated transition-all group">
                  <Link to={`/product/${product.id}`}>
                    <div className="aspect-square bg-muted relative overflow-hidden">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
                      {discount > 0 && (
                        <span className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-0.5 rounded-full">{discount}% OFF</span>
                      )}
                    </div>
                  </Link>
                  <div className="p-3">
                    <Link to={`/product/${product.id}`}>
                      <p className="font-medium text-sm truncate hover:text-primary">{product.name}</p>
                    </Link>
                    <p className="text-xs text-muted-foreground">{product.unit}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 fill-accent text-accent" />
                      <span className="text-xs">{product.rating}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div>
                        <span className="font-display font-bold">₹{product.price}</span>
                        {product.mrp > product.price && <span className="text-xs text-muted-foreground line-through ml-1">₹{product.mrp}</span>}
                      </div>
                      <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => addToCart.mutate({ productId: product.id })}>
                        <ShoppingCart className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </BuyerLayout>
  );
}

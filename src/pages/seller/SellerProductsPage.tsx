import { useStore, useAuth } from '@/contexts/AppContext';
import SellerLayout from '@/components/layout/SellerLayout';
import { Badge } from '@/components/ui/badge';

export default function SellerProductsPage() {
  const { products } = useStore();
  const { user } = useAuth();
  // For demo, show products from all sellers when logged as test seller
  const myProducts = products.filter(p => p.sellerId === user?.id || (user?.email === 'seller@test.com'));

  return (
    <SellerLayout>
      <h2 className="font-display text-2xl font-bold mb-6">My Products</h2>
      {myProducts.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">No products yet.</div>
      ) : (
        <div className="bg-card border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3 font-medium">Product</th>
                  <th className="text-left p-3 font-medium">Category</th>
                  <th className="text-left p-3 font-medium">Price</th>
                  <th className="text-left p-3 font-medium">Stock</th>
                  <th className="text-left p-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {myProducts.map(p => (
                  <tr key={p.id} className="border-t">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                        <span className="font-medium">{p.name}</span>
                      </div>
                    </td>
                    <td className="p-3 capitalize">{p.category}</td>
                    <td className="p-3 font-display font-bold">₹{p.price}</td>
                    <td className="p-3">{p.stock}</td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${p.status === 'approved' ? 'bg-secondary/10 text-secondary' : p.status === 'pending' ? 'bg-warning/10 text-warning' : 'bg-destructive/10 text-destructive'}`}>{p.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </SellerLayout>
  );
}

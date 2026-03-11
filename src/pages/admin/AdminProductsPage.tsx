import { useStore } from '@/contexts/AppContext';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminProductsPage() {
  const { products, approveProduct, rejectProduct } = useStore();
  const pending = products.filter(p => p.status === 'pending');
  const all = products;

  return (
    <AdminLayout>
      <h2 className="font-display text-2xl font-bold mb-6">Product Approval</h2>

      {pending.length > 0 && (
        <div className="mb-8">
          <h3 className="font-display font-semibold mb-3 text-warning">⏳ Pending Approval ({pending.length})</h3>
          <div className="space-y-3">
            {pending.map(p => (
              <div key={p.id} className="flex items-center gap-4 bg-card border rounded-xl p-4">
                <img src={p.image} alt={p.name} className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{p.name}</p>
                  <p className="text-sm text-muted-foreground">{p.sellerName} · ₹{p.price} · {p.category}</p>
                  <p className="text-xs text-muted-foreground mt-1">{p.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="default" onClick={() => { approveProduct(p.id); toast.success('Product approved'); }}>
                    <CheckCircle2 className="w-4 h-4 mr-1" /> Approve
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => { rejectProduct(p.id); toast.success('Product rejected'); }}>
                    <XCircle className="w-4 h-4 mr-1" /> Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <h3 className="font-display font-semibold mb-3">All Products ({all.length})</h3>
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 font-medium">Product</th>
                <th className="text-left p-3 font-medium">Seller</th>
                <th className="text-left p-3 font-medium">Price</th>
                <th className="text-left p-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {all.slice(0, 20).map(p => (
                <tr key={p.id} className="border-t">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <img src={p.image} alt={p.name} className="w-8 h-8 rounded object-cover" />
                      <span>{p.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground">{p.sellerName}</td>
                  <td className="p-3 font-display font-bold">₹{p.price}</td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${p.status === 'approved' ? 'bg-secondary/10 text-secondary' : p.status === 'pending' ? 'bg-warning/10 text-warning' : 'bg-destructive/10 text-destructive'}`}>{p.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

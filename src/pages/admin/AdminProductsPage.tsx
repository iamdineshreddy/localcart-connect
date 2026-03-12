import { useProducts, useUpdateProductStatus } from '@/hooks/useProducts';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

export default function AdminProductsPage() {
  const { data: products = [], isLoading } = useProducts();
  const updateStatus = useUpdateProductStatus();
  const [rejectionReasons, setRejectionReasons] = useState<Record<string, string>>({});
  
  const pending = products.filter(p => p.status === 'pending');

  const handleApprove = (id: string) => {
    updateStatus.mutate({ id, status: 'approved' }, { onSuccess: () => toast.success('Product approved') });
  };

  const handleReject = (id: string) => {
    const reason = rejectionReasons[id] || 'Does not meet quality standards';
    updateStatus.mutate({ id, status: 'rejected', rejection_reason: reason }, { onSuccess: () => toast.success('Product rejected') });
  };

  if (isLoading) return <AdminLayout><div className="text-center py-16 text-muted-foreground">Loading...</div></AdminLayout>;

  return (
    <AdminLayout>
      <h2 className="font-display text-2xl font-bold mb-6">Product Approval</h2>

      {pending.length > 0 && (
        <div className="mb-8">
          <h3 className="font-display font-semibold mb-3 text-warning">⏳ Pending Approval ({pending.length})</h3>
          <div className="space-y-3">
            {pending.map(p => (
              <div key={p.id} className="bg-card border rounded-xl p-4">
                <div className="flex items-start gap-4">
                  <img src={p.image} alt={p.name} className="w-20 h-20 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{p.name}</p>
                    <p className="text-sm text-muted-foreground">{p.seller_name} · ₹{p.price} · {p.category}</p>
                    <p className="text-xs text-muted-foreground mt-1">{p.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">Stock: {p.stock} · Unit: {p.unit}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button size="sm" onClick={() => handleApprove(p.id)}>
                      <CheckCircle2 className="w-4 h-4 mr-1" /> Approve
                    </Button>
                    <div className="flex gap-1">
                      <Input
                        placeholder="Rejection reason"
                        className="text-xs h-8"
                        value={rejectionReasons[p.id] || ''}
                        onChange={e => setRejectionReasons(prev => ({ ...prev, [p.id]: e.target.value }))}
                      />
                      <Button size="sm" variant="destructive" onClick={() => handleReject(p.id)}>
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <h3 className="font-display font-semibold mb-3">All Products ({products.length})</h3>
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
              {products.slice(0, 30).map(p => (
                <tr key={p.id} className="border-t">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <img src={p.image} alt={p.name} className="w-8 h-8 rounded object-cover" />
                      <span>{p.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground">{p.seller_name}</td>
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

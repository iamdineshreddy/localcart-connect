import AdminLayout from '@/components/layout/AdminLayout';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useState } from 'react';

const mockKYC = [
  { id: 'k1', sellerName: 'Krishna Stores', phone: '9876543210', aadhaar: '1234-5678-9012', pan: 'ABCDE1234F', status: 'pending' },
  { id: 'k2', sellerName: 'Fresh Farm Veggies', phone: '9876543211', aadhaar: '2345-6789-0123', pan: 'BCDEF2345G', status: 'pending' },
];

export default function AdminKYCPage() {
  const [kycs, setKycs] = useState(mockKYC);

  const approve = (id: string) => {
    setKycs(prev => prev.map(k => k.id === id ? { ...k, status: 'approved' } : k));
    toast.success('KYC approved');
  };

  return (
    <AdminLayout>
      <h2 className="font-display text-2xl font-bold mb-6">KYC Verification</h2>
      <div className="space-y-4">
        {kycs.map(k => (
          <div key={k.id} className="bg-card border rounded-xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium">{k.sellerName}</p>
              <p className="text-xs text-muted-foreground">Phone: {k.phone} · Aadhaar: {k.aadhaar} · PAN: {k.pan}</p>
            </div>
            {k.status === 'pending' ? (
              <Button size="sm" onClick={() => approve(k.id)}>
                <CheckCircle2 className="w-4 h-4 mr-1" /> Approve
              </Button>
            ) : (
              <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/10 text-secondary">Approved</span>
            )}
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}

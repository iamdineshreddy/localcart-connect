import AdminLayout from '@/components/layout/AdminLayout';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

const mockReports = [
  { id: 'f1', reporter: 'Test Buyer', seller: 'Krishna Stores', type: 'Fake Product', desc: 'Product quality does not match description', status: 'pending' },
  { id: 'f2', reporter: 'Test Buyer', seller: 'Subzi Mandi', type: 'Wrong Delivery', desc: 'Received wrong item', status: 'pending' },
];

export default function AdminFraudPage() {
  const [reports, setReports] = useState(mockReports);

  const resolve = (id: string) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'resolved' } : r));
    toast.success('Report resolved');
  };

  return (
    <AdminLayout>
      <h2 className="font-display text-2xl font-bold mb-6">Fraud Reports</h2>
      <div className="space-y-4">
        {reports.map(r => (
          <div key={r.id} className="bg-card border rounded-xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{r.type}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${r.status === 'pending' ? 'bg-warning/10 text-warning' : 'bg-secondary/10 text-secondary'}`}>{r.status}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{r.desc}</p>
                <p className="text-xs text-muted-foreground mt-1">Reporter: {r.reporter} · Seller: {r.seller}</p>
              </div>
              {r.status === 'pending' && (
                <Button size="sm" variant="outline" onClick={() => resolve(r.id)}>Resolve</Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}

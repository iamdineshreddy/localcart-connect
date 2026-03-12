import { useAllKYC, useUpdateKYCStatus } from '@/hooks/useKYC';
import AdminLayout from '@/components/layout/AdminLayout';
import { ShieldCheck, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useState } from 'react';

export default function AdminKYCPage() {
  const { data: kycs = [], isLoading } = useAllKYC();
  const updateStatus = useUpdateKYCStatus();
  const [rejectionReasons, setRejectionReasons] = useState<Record<string, string>>({});

  const approve = (id: string) => {
    updateStatus.mutate({ id, status: 'approved' }, { onSuccess: () => toast.success('KYC approved') });
  };

  const reject = (id: string) => {
    const reason = rejectionReasons[id] || 'Documents not clear';
    updateStatus.mutate({ id, status: 'rejected', rejection_reason: reason }, { onSuccess: () => toast.success('KYC rejected') });
  };

  if (isLoading) return <AdminLayout><div className="text-center py-16 text-muted-foreground">Loading...</div></AdminLayout>;

  return (
    <AdminLayout>
      <h2 className="font-display text-2xl font-bold mb-6">KYC Verification</h2>
      {kycs.length === 0 ? (
        <p className="text-muted-foreground text-center py-16">No KYC submissions yet</p>
      ) : (
        <div className="space-y-4">
          {kycs.map(k => (
            <div key={k.id} className="bg-card border rounded-xl p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{k.full_name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${k.status === 'approved' ? 'bg-secondary/10 text-secondary' : k.status === 'pending' ? 'bg-warning/10 text-warning' : 'bg-destructive/10 text-destructive'}`}>{k.status}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Email: {k.profiles?.email} · Phone: {k.phone}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Aadhaar: {k.aadhaar_number} · PAN: {k.pan_number}
                  </p>
                  {k.upi_id && <p className="text-xs text-muted-foreground">UPI: {k.upi_id}</p>}
                  {k.bank_account && <p className="text-xs text-muted-foreground">Bank: {k.bank_account} · IFSC: {k.ifsc_code}</p>}
                  <p className="text-xs text-muted-foreground">Address: {k.address}</p>
                  {k.rejection_reason && <p className="text-xs text-destructive mt-1">Rejection: {k.rejection_reason}</p>}
                </div>
                {k.status === 'pending' && (
                  <div className="flex flex-col gap-2 shrink-0">
                    <Button size="sm" onClick={() => approve(k.id)}>
                      <CheckCircle2 className="w-4 h-4 mr-1" /> Approve
                    </Button>
                    <div className="flex gap-1">
                      <Input
                        placeholder="Reason"
                        className="text-xs h-8 w-28"
                        value={rejectionReasons[k.id] || ''}
                        onChange={e => setRejectionReasons(prev => ({ ...prev, [k.id]: e.target.value }))}
                      />
                      <Button size="sm" variant="destructive" onClick={() => reject(k.id)}>
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

import { useFraudReports, useUpdateFraudReport } from '@/hooks/useFraudReports';
import AdminLayout from '@/components/layout/AdminLayout';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function AdminFraudPage() {
  const { data: reports = [], isLoading } = useFraudReports();
  const updateReport = useUpdateFraudReport();

  const handleAction = (id: string, status: string, action: string) => {
    updateReport.mutate({ id, status, admin_action: action }, { onSuccess: () => toast.success(`Report ${status}`) });
  };

  // Auto-flagged sellers (3+ complaints)
  const sellerComplaints = reports.reduce((acc, r) => {
    acc[r.seller_name] = (acc[r.seller_name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const flaggedSellers = Object.entries(sellerComplaints).filter(([_, count]) => count >= 3);

  if (isLoading) return <AdminLayout><div className="text-center py-16 text-muted-foreground">Loading...</div></AdminLayout>;

  return (
    <AdminLayout>
      <h2 className="font-display text-2xl font-bold mb-6">Fraud Reports</h2>

      {flaggedSellers.length > 0 && (
        <div className="mb-6 bg-destructive/5 border border-destructive/20 rounded-xl p-4">
          <h3 className="font-display font-semibold text-destructive mb-3">🚨 Auto-Flagged Sellers</h3>
          <div className="space-y-2">
            {flaggedSellers.map(([name, count]) => (
              <div key={name} className="flex items-center justify-between text-sm">
                <span className="font-medium">{name} — {count} complaints</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="text-xs" onClick={() => toast.success(`Warning sent to ${name}`)}>Warn</Button>
                  <Button size="sm" variant="destructive" className="text-xs" onClick={() => toast.success(`${name} suspended`)}>Suspend</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {reports.length === 0 ? (
        <p className="text-muted-foreground text-center py-16">No fraud reports</p>
      ) : (
        <div className="space-y-4">
          {reports.map(r => (
            <div key={r.id} className="bg-card border rounded-xl p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium capitalize">{r.type.replace('_', ' ')}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${r.status === 'pending' ? 'bg-warning/10 text-warning' : r.status === 'investigating' ? 'bg-info/10 text-info' : r.status === 'resolved' ? 'bg-secondary/10 text-secondary' : 'bg-muted text-muted-foreground'}`}>{r.status}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{r.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">Reporter: {r.reporter_name} · Seller: {r.seller_name}</p>
                  {r.admin_action && <p className="text-xs text-info mt-1">Action: {r.admin_action}</p>}
                </div>
                {r.status === 'pending' && (
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" variant="outline" onClick={() => handleAction(r.id, 'investigating', 'Under investigation')}>Investigate</Button>
                    <Button size="sm" onClick={() => handleAction(r.id, 'resolved', 'Resolved')}>Resolve</Button>
                    <Button size="sm" variant="ghost" onClick={() => handleAction(r.id, 'dismissed', 'Dismissed')}>Dismiss</Button>
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

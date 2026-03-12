import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useMyKYC, useSubmitKYC } from '@/hooks/useKYC';
import SellerLayout from '@/components/layout/SellerLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Shield, CheckCircle2, Clock, AlertCircle, XCircle } from 'lucide-react';

export default function KYCPage() {
  const { data: kyc, isLoading } = useMyKYC();
  const submitKYC = useSubmitKYC();
  const [form, setForm] = useState({
    full_name: '', phone: '', address: '', upi_id: '', bank_account: '', ifsc_code: '',
    aadhaar_number: '', pan_number: '',
  });

  if (isLoading) return <SellerLayout><div className="text-center py-16 text-muted-foreground">Loading...</div></SellerLayout>;

  if (kyc?.status === 'approved') {
    return (
      <SellerLayout>
        <div className="max-w-lg mx-auto text-center py-16">
          <CheckCircle2 className="w-16 h-16 text-secondary mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold mb-2">KYC Verified</h2>
          <p className="text-muted-foreground">Your identity has been verified. You can now sell products.</p>
        </div>
      </SellerLayout>
    );
  }

  if (kyc?.status === 'pending') {
    return (
      <SellerLayout>
        <div className="max-w-lg mx-auto text-center py-16">
          <Clock className="w-16 h-16 text-warning mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold mb-2">Under Review</h2>
          <p className="text-muted-foreground">Your KYC documents are being reviewed. This usually takes 24-48 hours.</p>
        </div>
      </SellerLayout>
    );
  }

  if (kyc?.status === 'rejected') {
    return (
      <SellerLayout>
        <div className="max-w-lg mx-auto text-center py-16">
          <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold mb-2">KYC Rejected</h2>
          <p className="text-muted-foreground mb-2">Reason: {kyc.rejection_reason || 'Documents not clear'}</p>
          <Button onClick={() => {
            setForm({
              full_name: kyc.full_name, phone: kyc.phone, address: kyc.address,
              upi_id: kyc.upi_id || '', bank_account: kyc.bank_account || '', ifsc_code: kyc.ifsc_code || '',
              aadhaar_number: kyc.aadhaar_number, pan_number: kyc.pan_number,
            });
          }}>Resubmit KYC</Button>
        </div>
      </SellerLayout>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitKYC.mutate(form);
  };

  return (
    <SellerLayout>
      <div className="max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-8 h-8 text-primary" />
          <div>
            <h2 className="font-display text-2xl font-bold">KYC Verification</h2>
            <p className="text-sm text-muted-foreground">Complete your identity verification to start selling</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-card border rounded-xl p-6">
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Full Name</Label><Input value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} required /></div>
            <div><Label>Phone Number</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required /></div>
          </div>
          <div><Label>Address</Label><Textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required /></div>
          <div className="grid grid-cols-3 gap-4">
            <div><Label>UPI ID</Label><Input value={form.upi_id} onChange={e => setForm({ ...form, upi_id: e.target.value })} placeholder="name@upi" /></div>
            <div><Label>Bank Account</Label><Input value={form.bank_account} onChange={e => setForm({ ...form, bank_account: e.target.value })} /></div>
            <div><Label>IFSC Code</Label><Input value={form.ifsc_code} onChange={e => setForm({ ...form, ifsc_code: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Aadhaar Number</Label><Input value={form.aadhaar_number} onChange={e => setForm({ ...form, aadhaar_number: e.target.value })} required /></div>
            <div><Label>PAN Number</Label><Input value={form.pan_number} onChange={e => setForm({ ...form, pan_number: e.target.value })} required /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Aadhaar Card (Front)</Label><Input type="file" accept="image/*" /></div>
            <div><Label>Aadhaar Card (Back)</Label><Input type="file" accept="image/*" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>PAN Card Image</Label><Input type="file" accept="image/*" /></div>
            <div><Label>Shop Photo</Label><Input type="file" accept="image/*" /></div>
          </div>
          <Button type="submit" className="w-full" disabled={submitKYC.isPending}>
            {submitKYC.isPending ? 'Submitting...' : 'Submit KYC Documents'}
          </Button>
        </form>
      </div>
    </SellerLayout>
  );
}

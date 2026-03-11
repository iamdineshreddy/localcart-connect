import { useState } from 'react';
import SellerLayout from '@/components/layout/SellerLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Shield, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function KYCPage() {
  const [status, setStatus] = useState<'not_submitted' | 'pending' | 'approved'>('not_submitted');
  const [form, setForm] = useState({ fullName: '', phone: '', address: '', upiId: '', aadhaar: '', pan: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('pending');
    toast.success('KYC submitted for review!');
  };

  if (status === 'approved') {
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

  if (status === 'pending') {
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
            <div><Label>Full Name</Label><Input value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} required /></div>
            <div><Label>Phone Number</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required /></div>
          </div>
          <div><Label>Address</Label><Textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required /></div>
          <div className="grid grid-cols-3 gap-4">
            <div><Label>UPI ID</Label><Input value={form.upiId} onChange={e => setForm({ ...form, upiId: e.target.value })} placeholder="name@upi" required /></div>
            <div><Label>Aadhaar Number</Label><Input value={form.aadhaar} onChange={e => setForm({ ...form, aadhaar: e.target.value })} required /></div>
            <div><Label>PAN Number</Label><Input value={form.pan} onChange={e => setForm({ ...form, pan: e.target.value })} required /></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div><Label>Aadhaar Card Image</Label><Input type="file" accept="image/*" /></div>
            <div><Label>PAN Card Image</Label><Input type="file" accept="image/*" /></div>
            <div><Label>Shop Image</Label><Input type="file" accept="image/*" /></div>
          </div>
          <Button type="submit" className="w-full">Submit KYC Documents</Button>
        </form>
      </div>
    </SellerLayout>
  );
}

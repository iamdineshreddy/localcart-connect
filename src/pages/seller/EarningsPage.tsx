import SellerLayout from '@/components/layout/SellerLayout';
import { DollarSign, TrendingUp } from 'lucide-react';

export default function EarningsPage() {
  return (
    <SellerLayout>
      <h2 className="font-display text-2xl font-bold mb-6">Earnings</h2>
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Earnings', value: '₹0', desc: 'All time' },
          { label: 'This Month', value: '₹0', desc: 'March 2026' },
          { label: 'Pending', value: '₹0', desc: 'Awaiting delivery' },
        ].map(s => (
          <div key={s.label} className="bg-card border rounded-xl p-5">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="font-display text-3xl font-bold mt-1">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.desc}</p>
          </div>
        ))}
      </div>
      <div className="bg-card border rounded-xl p-8 text-center text-muted-foreground">
        <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p>Start selling to see your earnings here</p>
      </div>
    </SellerLayout>
  );
}

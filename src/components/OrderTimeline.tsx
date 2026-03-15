import { Package, CheckCircle2, Truck, MapPin, Home, XCircle } from 'lucide-react';

const ORDER_STEPS = [
  { key: 'placed', label: 'Placed', icon: Package },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: MapPin },
  { key: 'delivered', label: 'Delivered', icon: Home },
];

function getStepIndex(status: string) {
  if (status === 'cancelled') return -1;
  return ORDER_STEPS.findIndex(s => s.key === status);
}

export default function OrderTimeline({ status }: { status: string }) {
  const currentIdx = getStepIndex(status);

  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-2 py-3 px-2 bg-destructive/5 rounded-lg">
        <XCircle className="w-5 h-5 text-destructive" />
        <span className="text-sm font-medium text-destructive">Order Cancelled</span>
      </div>
    );
  }

  return (
    <div className="py-3">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-muted z-0" />
        <div
          className="absolute top-4 left-4 h-0.5 bg-primary z-[1] transition-all duration-500"
          style={{ width: `calc(${(currentIdx / (ORDER_STEPS.length - 1)) * 100}% - 2rem)` }}
        />
        {ORDER_STEPS.map((step, i) => {
          const isCompleted = i <= currentIdx;
          const isCurrent = i === currentIdx;
          const Icon = step.icon;
          return (
            <div key={step.key} className="flex flex-col items-center z-10 relative">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                  isCompleted
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'bg-card border-muted text-muted-foreground'
                } ${isCurrent ? 'ring-2 ring-primary/30 ring-offset-1 ring-offset-background' : ''}`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span
                className={`text-[10px] mt-1.5 text-center leading-tight max-w-[56px] ${
                  isCompleted ? 'text-primary font-medium' : 'text-muted-foreground'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

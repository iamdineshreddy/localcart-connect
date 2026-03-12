import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Store } from 'lucide-react';
import { toast } from 'sonner';

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('buyer');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    const result = await signup(name, email, password, role);
    setLoading(false);
    if (result.success) {
      toast.success('Account created!');
      navigate(role === 'seller' ? '/seller' : role === 'delivery' ? '/delivery' : '/');
    } else {
      toast.error(result.error || 'Signup failed');
    }
  };

  const roles: { value: UserRole; emoji: string; label: string }[] = [
    { value: 'buyer', emoji: '🛒', label: 'Buy Products' },
    { value: 'seller', emoji: '🏪', label: 'Sell Products' },
    { value: 'delivery', emoji: '🚚', label: 'Deliver Orders' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-6">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
            <Store className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-2xl">LOCAL-KART</span>
        </div>

        <h2 className="font-display text-2xl font-bold mb-1">Create account</h2>
        <p className="text-muted-foreground mb-6">Join your local marketplace</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Full Name</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" required />
          </div>
          <div>
            <Label>I want to</Label>
            <div className="grid grid-cols-3 gap-3 mt-2">
              {roles.map(r => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${role === r.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}
                >
                  <span className="text-2xl block mb-1">{r.emoji}</span>
                  <span className="text-xs font-medium">{r.label}</span>
                </button>
              ))}
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

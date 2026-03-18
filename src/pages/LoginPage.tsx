import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Store, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email.trim(), password);
    setLoading(false);
    if (success) {
      toast.success('Welcome back!');
    } else {
      toast.error('Invalid credentials. Please check your email and password.');
    }
  };

  const quickLogin = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="min-h-screen flex bg-muted">
      {/* Left */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero items-center justify-center p-12">
        <div className="max-w-md text-primary-foreground">
          <div className="w-16 h-16 rounded-2xl bg-primary-foreground/20 flex items-center justify-center mb-8">
            <Store className="w-8 h-8" />
          </div>
          <h1 className="font-display text-4xl font-bold mb-4">LOCAL-KART</h1>
          <p className="text-lg opacity-90 mb-6">Your neighborhood marketplace, now digital. Connect with trusted local sellers and shop fresh products from your community.</p>
          <div className="space-y-3 text-sm opacity-80">
            <p>✓ Verified local sellers with trust scores</p>
            <p>✓ Fresh groceries, vegetables, fruits & more</p>
            <p>✓ KYC verified for buyer protection</p>
            <p>✓ Support your local community</p>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
              <Store className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-2xl">LOCAL-KART</span>
          </div>

          <h2 className="font-display text-2xl font-bold mb-1">Sign in</h2>
          <p className="text-muted-foreground mb-6">Enter your credentials to access your account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••" required />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Don't have an account? <Link to="/signup" className="text-primary font-medium hover:underline">Sign up</Link>
          </p>

          {/* Quick login */}
          <div className="mt-8 p-4 rounded-xl bg-card border">
            <p className="text-xs text-muted-foreground mb-3 font-medium">QUICK LOGIN (Dev)</p>
            <div className="grid gap-2">
              <Button variant="outline" size="sm" className="justify-start text-xs" onClick={() => quickLogin('buyer@test.com', '123456')}>
                🛒 Buyer — buyer@test.com / 123456
              </Button>
              <Button variant="outline" size="sm" className="justify-start text-xs" onClick={() => quickLogin('seller@test.com', '123456')}>
                🏪 Seller — seller@test.com / 123456
              </Button>
              <Button variant="outline" size="sm" className="justify-start text-xs" onClick={() => quickLogin('admin@test.com', 'admin123')}>
                ⚙️ Admin — admin@test.com / admin123
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

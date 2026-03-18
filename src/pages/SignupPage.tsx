import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Store, MapPin, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('buyer');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported by your browser');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude: lat, longitude: lng } = position.coords;
          setLatitude(lat);
          setLongitude(lng);
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
          );
          const data = await res.json();
          const addr = data.address || {};
          setAddress(data.display_name || `${lat}, ${lng}`);
          setCity(addr.city || addr.town || addr.village || '');
          setState(addr.state || '');
          setPincode(addr.postcode || '');
          toast.success('Location detected!');
        } catch {
          toast.error('Could not fetch address from location');
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setLocating(false);
        toast.error(err.message || 'Could not get your location');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (!address.trim()) { toast.error('Please enter your address'); return; }
    setLoading(true);
    const result = await signup(name, email, password, role);
    if (result.success) {
      // Update profile with address fields after signup
      // Small delay to let the trigger create the profile first
      setTimeout(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('profiles').update({
            address,
            city,
            state,
            pincode,
            latitude,
            longitude,
          } as any).eq('id', user.id);
        }
      }, 1000);
      toast.success('Account created!');
      navigate(role === 'seller' ? '/seller' : role === 'delivery' ? '/delivery' : '/');
    } else {
      toast.error(result.error || 'Signup failed');
    }
    setLoading(false);
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

          {/* Address Section */}
          <div className="space-y-3 p-4 border rounded-xl bg-card">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">📍 Address</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGetLocation}
                disabled={locating}
              >
                {locating ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <MapPin className="w-3 h-3 mr-1" />}
                {locating ? 'Detecting...' : 'Auto-detect'}
              </Button>
            </div>
            <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="Full address" required />
            <div className="grid grid-cols-2 gap-2">
              <Input value={city} onChange={e => setCity(e.target.value)} placeholder="City" />
              <Input value={state} onChange={e => setState(e.target.value)} placeholder="State" />
            </div>
            <Input value={pincode} onChange={e => setPincode(e.target.value)} placeholder="Pincode" />
            {latitude && longitude && (
              <p className="text-xs text-muted-foreground">📌 Coordinates: {latitude.toFixed(4)}, {longitude.toFixed(4)}</p>
            )}
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
